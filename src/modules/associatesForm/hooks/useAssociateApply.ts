import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { type AssociateApplyValues } from "../schemas/associateApply";
import { createSolicitud, uploadDocuments } from "../services/associatesFormService";
import { type CreateSolicitudDto } from "../models/createAssociate";

/** Normaliza una lista a strings únicos (trim + sin duplicados, case-insensitive) */
function normalizeStringList(list: any[]): string[] {
  const base = Array.isArray(list) ? list : [];
  const flat = base
    .map((x) => (typeof x === "string" ? x : (x?.nombre ?? x?.tipo ?? "")))
    .map((s) => String(s || "").trim())
    .filter((s) => s.length > 0);

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

/**
 * Mapea los valores del formulario al formato que espera el backend (PURO)
 */
function mapToSolicitudPayload(values: AssociateApplyValues): CreateSolicitudDto {
  const payload: CreateSolicitudDto = {
    persona: {
      cedula: values.cedula,
      nombre: values.nombre,
      apellido1: values.apellido1,
      apellido2: values.apellido2,
      fechaNacimiento: values.fechaNacimiento,
      telefono: values.telefono,
      email: values.email,
      ...(values.direccion && { direccion: values.direccion }),
    },
    datosAsociado: {
      viveEnFinca: Boolean(values.viveEnFinca),
      marcaGanado: values.marcaGanado,
      CVO: values.CVO,
    },
    datosFinca: {
      nombre: values.nombreFinca,
      areaHa: parseFloat(values.areaHa),
      numeroPlano: values.numeroPlano,
      geografia: {
        provincia: values.provincia,
        canton: values.canton,
        distrito: values.distrito,
        caserio: values.caserio || "",
      },
    },
  };

  // Núcleo familiar opcional
  if (values.nucleoHombres || values.nucleoMujeres) {
    const hombres = parseInt(values.nucleoHombres || "0") || 0;
    const mujeres = parseInt(values.nucleoMujeres || "0") || 0;
    if (hombres > 0 || mujeres > 0) {
      payload.nucleoFamiliar = {
        nucleoHombres: hombres,
        nucleoMujeres: mujeres,
      };
    }
  }

  // Propietario (si no es el asociado)
  const esPropietario = (values as any).esPropietario;
  if (esPropietario === false) {
    payload.propietario = {
      persona: {
        cedula: (values as any).propietarioCedula,
        nombre: (values as any).propietarioNombre,
        apellido1: (values as any).propietarioApellido1,
        apellido2: (values as any).propietarioApellido2,
        telefono: (values as any).propietarioTelefono,
        email: (values as any).propietarioEmail,
        fechaNacimiento: (values as any).propietarioFechaNacimiento,
        ...((values as any).propietarioDireccion?.trim()
          ? { direccion: (values as any).propietarioDireccion.trim() }
          : {}),
      },
    };
  }

  // Hato
  const hatoData = (values as any).hatoData;
  if (hatoData) {
    payload.hato = {
      idFinca: 0,
      tipoExplotacion: hatoData.tipoExplotacion,
      totalGanado: parseInt(hatoData.totalGanado),
      ...(hatoData.razaPredominante && { razaPredominante: hatoData.razaPredominante }),
    };

    if (Array.isArray(hatoData.animales) && hatoData.animales.length > 0) {
      payload.animales = hatoData.animales.map((a: any) => ({
        nombre: a.nombre,
        edad: parseInt(a.edad),
        cantidad: parseInt(a.cantidad),
      }));
    }
  }

  // Forrajes
  const forrajes = (values as any).forrajes;
  if (Array.isArray(forrajes) && forrajes.length > 0) {
    const mapeados = forrajes
      .filter((f: any) => f?.tipoForraje && f?.variedad && f?.utilizacion && Number(f?.hectareas) > 0)
      .map((f: any) => ({
        tipoForraje: String(f.tipoForraje).trim(),
        variedad: String(f.variedad).trim(),
        hectareas: Number(f.hectareas),
        utilizacion: String(f.utilizacion).trim(),
      }));
    if (mapeados.length > 0) payload.forrajes = mapeados;
  }

  // Registros productivos
  const registrosProductivos = (values as any).registrosProductivos;
  if (registrosProductivos) {
    payload.registrosProductivos = {
      reproductivos: Boolean(registrosProductivos.reproductivos),
      costosProductivos: Boolean(registrosProductivos.costosProductivos),
    };
  }

  // Fuentes de agua (acepta strings u objetos)
  const fuentesAgua = (values as any).fuentesAgua;
  if (Array.isArray(fuentesAgua) && fuentesAgua.length > 0) {
    const asStrings = normalizeStringList(fuentesAgua);
    if (asStrings.length > 0) {
      payload.fuentesAgua = asStrings.map((nombre) => ({ nombre }));
    } else {
      const objetos = fuentesAgua
        .filter((f: any) => f?.nombre)
        .map((f: any) => ({ nombre: String(f.nombre).trim() }));
      if (objetos.length > 0) payload.fuentesAgua = objetos;
    }
  }

  const metodosRiego = (values as any).metodosRiego;
  if (Array.isArray(metodosRiego) && metodosRiego.length > 0) {
    const asStrings = normalizeStringList(metodosRiego);

    if (asStrings.length > 0) {
      payload.metodosRiego = asStrings.map((nombre) => ({ nombre, tipo: nombre }));
    } else {
      const objetos = metodosRiego
        .filter((m: any) => m?.nombre || m?.tipo)
        .map((m: any) => ({ nombre: String(m.nombre ?? m.tipo).trim() }))
        .filter((m: any) => m.nombre.length > 0);

      if (objetos.length > 0) {
        payload.metodosRiego = objetos.map((m: any) => ({ nombre: m.nombre, tipo: m.nombre }));
      }
    }
  }

  // ========== NUEVOS CAMPOS: Actividades e Infraestructura ==========
  const actividadesInfra = (values as any).actividadesInfraestructura;
  if (actividadesInfra && (
    (Array.isArray(actividadesInfra.cultivos) && actividadesInfra.cultivos.length > 0) ||
    actividadesInfra.aparatos > 0 ||
    actividadesInfra.bebederos > 0 ||
    actividadesInfra.saleros > 0
  )) {
    payload.actividadesInfraestructura = {
      cultivos: actividadesInfra.cultivos || [],
      aparatos: actividadesInfra.aparatos || 0,
      bebederos: actividadesInfra.bebederos || 0,
      saleros: actividadesInfra.saleros || 0,
    };
  }

  // ========== NUEVOS CAMPOS: Características Físicas ==========
  const caracteristicasFisicas = (values as any).caracteristicasFisicas;
  if (caracteristicasFisicas && (
    (Array.isArray(caracteristicasFisicas.tiposCerca) && caracteristicasFisicas.tiposCerca.length > 0) ||
    (Array.isArray(caracteristicasFisicas.equipos) && caracteristicasFisicas.equipos.length > 0)
  )) {
    payload.caracteristicasFisicas = {
      tiposCerca: caracteristicasFisicas.tiposCerca || [],
      equipos: caracteristicasFisicas.equipos || [],
    };
  }

  console.log("[Hook] Payload final:", JSON.stringify(payload, null, 2));
  return payload;
}

/**
 * Hook para manejar el formulario de solicitud de asociado
 */
export function useAssociateApply(onSuccess?: () => void) {
  const mutation = useMutation({
    mutationFn: async (values: AssociateApplyValues) => {
      console.log("[Hook] Iniciando envío de solicitud...");

      // 1) Crear solicitud con TODO el payload
      const payload = mapToSolicitudPayload(values);
      const response = await createSolicitud(payload);

      // 2) ID de la solicitud (soporta ambas formas de respuesta)
      const idSolicitud =
        (response as any)?.data?.idSolicitud ?? (response as any)?.idSolicitud;
      if (!idSolicitud) {
        throw new Error("No se recibió el ID de la solicitud");
      }
      console.log("[Hook] Solicitud creada con ID:", idSolicitud);

      // 3) Subir documentos (si hay)
      const cedula = values.idCopy instanceof File ? values.idCopy : undefined;
      const planoFinca = values.farmMap instanceof File ? values.farmMap : undefined;

      if (cedula || planoFinca) {
        console.log("[Hook] Subiendo documentos...");
        await uploadDocuments(idSolicitud, { cedula, planoFinca });
        console.log("[Hook] Documentos subidos exitosamente");
      } else {
        console.log("[Hook] No hay archivos para subir");
      }

      return response;
    },
    onSuccess: (data) => {
      console.log("[Hook] Solicitud creada exitosamente:", data);
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("[Hook] Error al crear solicitud:", error);
      console.error("[Hook] Detalles:", error?.response?.data);
    },
    onSettled: () => {
      console.log("[Hook] Proceso finalizado");
    },
  });

  const form = useForm({
    defaultValues: {
      // Persona
      cedula: "",
      nombre: "",
      apellido1: "",
      apellido2: "",
      fechaNacimiento: "",
      telefono: "",
      email: "",
      direccion: "",

      // Asociado
      distanciaFinca: "",
      viveEnFinca: false,
      marcaGanado: "",
      CVO: "",

      // Núcleo Familiar (Opcional)
      nucleoHombres: "",
      nucleoMujeres: "",

      // Documentos y Términos
      acceptTerms: false,
      receiveInfo: false,
      idCopy: null as File | null,
      farmDiagnosis: null as File | null,
      farmMap: null as File | null,
      otherDocuments: null as File | null,

      // Finca
      nombreFinca: "",
      areaHa: "",
      numeroPlano: "",

      // Geografía
      provincia: "",
      canton: "",
      distrito: "",
      caserio: "",

      // Propietario
      esPropietario: true,
      propietarioCedula: "",
      propietarioNombre: "",
      propietarioApellido1: "",
      propietarioApellido2: "",
      propietarioTelefono: "",
      propietarioEmail: "",
      propietarioDireccion: "",
      propietarioFechaNacimiento: "",

      // Secciones dinámicas
      hatoData: null as any,
      forrajes: [] as any[],
      registrosProductivos: null as any,
      fuentesAgua: [] as any[],
      metodosRiego: [] as any[],

      // ========== NUEVOS CAMPOS PARA STEP 4 ==========
      actividadesInfraestructura: {
        cultivos: [] as string[],
        aparatos: 0,
        bebederos: 0,
        saleros: 0,
      },
      caracteristicasFisicas: {
        tiposCerca: [] as string[],
        equipos: [] as string[],
      },
    },
    onSubmit: async ({ value, formApi }) => {
      console.log("[Hook] Submit iniciado");
      try {
        await mutation.mutateAsync(value as any);
        console.log("[Hook] Submit exitoso, reseteando formulario...");
        formApi.reset();
      } catch (err) {
        console.error("[Hook] Submit falló:", err);
      }
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