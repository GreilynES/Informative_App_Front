import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import type { CreateSolicitudDto } from "../models/createAssociate";
import { createSolicitud, uploadDocuments } from "../services/associatesFormService";

/* --------------------------- Utils --------------------------- */

function toInt(v: any, min = 0) {
  const n = Number(v);
  if (!Number.isFinite(n)) return min;
  const t = Math.trunc(n);
  return t < min ? min : t;
}

function toFloat(v: any, min = 0) {
  const n = parseFloat(String(v ?? "0"));
  if (!Number.isFinite(n)) return min;
  return n < min ? min : n;
}

/** Normaliza lista de strings o objetos {nombre|tipo} (trim + dedup case-insensitive) */
function normalizeStringList(list: any[]): string[] {
  const base = Array.isArray(list) ? list : [];
  const flat = base
    .map((x) => (typeof x === "string" ? x : (x?.nombre ?? x?.tipo ?? "")))
    .map((s) => String(s || "").trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of flat) {
    const key = s.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(s);
    }
  }
  return out;
}

/* -------------------- Payload (100% completo) -------------------- */

export function mapToSolicitudPayload(values: any): CreateSolicitudDto {
  const payload: any = {
    // Persona del asociado
    persona: {
      cedula: values.cedula,
      nombre: values.nombre,
      apellido1: values.apellido1,
      apellido2: values.apellido2,
      fechaNacimiento: values.fechaNacimiento,
      telefono: values.telefono,
      email: values.email,
      ...(values.direccion?.trim() ? { direccion: values.direccion.trim() } : {}),
    },

    // Datos del asociado
    datosAsociado: {
      viveEnFinca: Boolean(values.viveEnFinca),
      marcaGanado: values.marcaGanado ?? "",
      CVO: values.CVO ?? "",
    },

    // Finca + geografía
    datosFinca: {
      nombre: values.nombreFinca ?? "",
      areaHa: toFloat(values.areaHa, 0),
      numeroPlano: values.numeroPlano ?? "",
      geografia: {
        provincia: values.provincia ?? "",
        canton: values.canton ?? "",
        distrito: values.distrito ?? "",
        caserio: values.caserio ?? "",
      },
    },
  };

  // Núcleo familiar (opcional)
  const hombres = toInt(values.nucleoHombres);
  const mujeres = toInt(values.nucleoMujeres);
  if (hombres > 0 || mujeres > 0) {
    payload.nucleoFamiliar = { nucleoHombres: hombres, nucleoMujeres: mujeres };
  }

  // Propietario (si NO es el asociado)
  if (values.esPropietario === false) {
    payload.propietario = {
      persona: {
        cedula: values.propietarioCedula,
        nombre: values.propietarioNombre,
        apellido1: values.propietarioApellido1,
        apellido2: values.propietarioApellido2,
        fechaNacimiento: values.propietarioFechaNacimiento,
        telefono: values.propietarioTelefono,
        email: values.propietarioEmail,
        ...(values.propietarioDireccion?.trim()
          ? { direccion: values.propietarioDireccion.trim() }
          : {}),
      },
    };
  }

  // Hato + animales (opcional)
  const hato = values.hatoData;
  if (hato) {
    payload.hato = {
      idFinca: 0, // backend lo ignora en la transacción
      tipoExplotacion: hato.tipoExplotacion ?? "",
      totalGanado: toInt(hato.totalGanado),
      ...(hato.razaPredominante?.trim()
        ? { razaPredominante: hato.razaPredominante.trim() }
        : {}),
    };

    if (Array.isArray(hato.animales) && hato.animales.length) {
      const animals = hato.animales
        .map((a: any) => ({
          tipoAnimal: String(a?.nombre ?? a?.tipoAnimal ?? "").trim(),
          edadAnios: toInt(a?.edad ?? a?.edadAnios),
          cantidad: toInt(a?.cantidad),
        }))
        .filter((a: any) => a.tipoAnimal && a.cantidad > 0);
      if (animals.length) payload.animales = animals;
    }
  }

  // Forrajes (opcional)
  if (Array.isArray(values.forrajes) && values.forrajes.length) {
    const f = values.forrajes
      .map((x: any) => ({
        tipoForraje: String(x?.tipoForraje ?? "").trim(),
        variedad: String(x?.variedad ?? "").trim(),
        hectareas: toFloat(x?.hectareas, 0),
        utilizacion: String(x?.utilizacion ?? "").trim(),
      }))
      .filter((x: any) => x.tipoForraje && x.variedad && x.utilizacion && x.hectareas > 0);
    if (f.length) payload.forrajes = f;
  }

  // Registros productivos (opcional)
  const rp = values.registrosProductivos;
  if (rp && (rp.reproductivos || rp.costosProductivos)) {
    payload.registrosProductivos = {
      reproductivos: Boolean(rp.reproductivos),
      costosProductivos: Boolean(rp.costosProductivos),
    };
  }

  // Fuentes de agua (chips / strings)
  const fuentes = normalizeStringList(values.fuentesAgua);
  if (fuentes.length) {
    payload.fuentesAgua = fuentes.map((nombre) => ({ nombre }));
  }

  // Métodos de riego (chips / strings) → { tipo }
  const riego = normalizeStringList(values.metodosRiego);
  if (riego.length) {
    payload.metodosRiego = riego.map((tipo) => ({ tipo }));
  }

  /* ==================== BLOQUES NUEVOS ==================== */

  // Actividades agropecuarias (chips texto libre)
  const acts = normalizeStringList(values.actividadesAgropecuarias);
  if (acts.length) {
    payload.actividadesAgropecuarias = acts.map((nombre) => ({ nombre }));
  }

  // Infraestructura de producción (cantidades)
  const ip = values.infraestructuraProduccion;
  if (ip) {
    payload.infraestructuraProduccion = {
      numeroAparatos: toInt(ip.numeroAparatos),
      numeroBebederos: toInt(ip.numeroBebederos),
      numeroSaleros: toInt(ip.numeroSaleros),
    };
  }

  // Tipos de cerca (checkbox simples + “otra” como campo adicional si quieres)
  const tc = values.tipoCerca ?? {};
  if (tc.viva || tc.electrica || tc.pMuerto || (tc.otra ?? "").trim()) {
    // Si tu backend espera arreglo de combinaciones:
    payload.tiposCerca = [
      { viva: !!tc.viva, electrica: !!tc.electrica, pMuerto: !!tc.pMuerto },
    ];
    // “Otra” (si decides soportarlo en el back como campo separado)
    if (tc.otra?.trim()) payload.tipoCercaOtra = tc.otra.trim();
  }

  // Equipos (lista fija + “otro” texto) → lo enviamos como otrosEquipos con cantidad=1
  const equiposSel: string[] = Array.isArray(values.equiposSeleccionados)
    ? values.equiposSeleccionados
    : [];
  const otroEquipoTxt = String(values.otroEquipoTexto || "").trim();
  const equipos = [...equiposSel];
  if (otroEquipoTxt) equipos.push(otroEquipoTxt);
  if (equipos.length) {
    payload.otrosEquipos = equipos.map((nombre) => ({
      nombreEquipo: nombre,
      cantidad: 1,
    }));
  }

  // Documentos (si manejas desde este hook un objeto archivos)
  // -> el upload real se hace con uploadDocuments tras crear la solicitud
  // -> aquí solo lo dejamos como referencia en consola si quieres ver qué hay
  console.log("[useAssociateApply] Payload final:", payload);
  return payload as CreateSolicitudDto;
}

/* ---------------------------- Hook ---------------------------- */

export function useAssociateApply(onSuccess?: () => void) {
  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const payload = mapToSolicitudPayload(values);
  
      // 1) Crear solicitud
      const resp = await createSolicitud(payload);
      const idSolicitud =
        (resp as any)?.idSolicitud ??
        (resp as any)?.data?.idSolicitud ??
        (resp as any)?.data?.data?.idSolicitud;
  
      // 2) Subir documentos, si existen (solo los que soporta tu API)
      const cedula = values.idCopy instanceof File ? values.idCopy : undefined;
      const planoFinca = values.farmMap instanceof File ? values.farmMap : undefined;
  
      if (idSolicitud && (cedula || planoFinca)) {
        const docPayload: { cedula?: File; planoFinca?: File } = {};
        if (cedula) docPayload.cedula = cedula;
        if (planoFinca) docPayload.planoFinca = planoFinca;
        await uploadDocuments(idSolicitud, docPayload);
      }
  
      return resp;
    },
    onSuccess: () => onSuccess?.(),
    onError: (e: any) => {
      console.error("[useAssociateApply] Error:", e?.message, e?.response?.data);
    },
  });
  

// En useAssociateApply.ts
// En la sección de defaultValues del form, asegúrate de que estos campos tengan valores iniciales:

const form = useForm({
  defaultValues: {
    /* -------- Persona -------- */
    cedula: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    direccion: "",

    /* -------- Asociado -------- */
    viveEnFinca: false,
    marcaGanado: "",
    CVO: "",
    distanciaFinca: "", // ← ASEGÚRATE DE QUE ESTE CAMPO EXISTA CON VALOR INICIAL

    /* -------- Núcleo familiar -------- */
    nucleoHombres: "",
    nucleoMujeres: "",

    /* -------- Finca -------- */
    nombreFinca: "",
    areaHa: "",
    numeroPlano: "",

    /* -------- Geografía -------- */
    provincia: "",
    canton: "",
    distrito: "",
    caserio: "",

    /* -------- Propietario -------- */
    esPropietario: true,
    propietarioCedula: "",
    propietarioNombre: "",
    propietarioApellido1: "",
    propietarioApellido2: "",
    propietarioFechaNacimiento: "",
    propietarioTelefono: "",
    propietarioEmail: "",
    propietarioDireccion: "",

    /* -------- Productivo -------- */
    hatoData: null as any,
    forrajes: [] as any[],
    registrosProductivos: null as any,
    fuentesAgua: [] as any[],
    metodosRiego: [] as any[],

    /* -------- NUEVO: Actividades + Infraestructura -------- */
    actividadesAgropecuarias: [] as any[],
    infraestructuraProduccion: {
      numeroAparatos: 0,
      numeroBebederos: 0,
      numeroSaleros: 0,
    },

    /* -------- NUEVO: Cercas + Equipos (front-only) -------- */
    tipoCerca: { viva: false, electrica: false, pMuerto: false, otra: "" },
    equiposSeleccionados: [] as string[],
    otroEquipoTexto: "",

    /* -------- Documentos -------- */
    idCopy: null as File | null,
    farmMap: null as File | null,
    otherDocuments: [] as File[],
  },
  onSubmit: async ({ value, formApi }) => {
    await mutation.mutateAsync(value);
  },
});

  return {
    form,
    mutation,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
