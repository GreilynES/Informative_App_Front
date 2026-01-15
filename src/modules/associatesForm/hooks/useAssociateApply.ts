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

    //  Cambiar "tipoAnimal" y "edadAnios" por "nombre" y "edad"
    if (Array.isArray(hatoData.animales) && hatoData.animales.length > 0) {
      payload.animales = hatoData.animales.map((a: any) => ({
        nombre: a.nombre,        // ✅ CORRECTO (era "tipoAnimal")
        edad: parseInt(a.edad),  // ✅ CORRECTO (era "edadAnios")
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
      // ✅ CORRECTO: Usar "nombre" en lugar de "tipo"
      payload.metodosRiego = asStrings.map((nombre) => ({ nombre }));
    } else {
      const objetos = metodosRiego
        .filter((m: any) => m?.nombre || m?.tipo)
        .map((m: any) => ({ nombre: String(m.nombre ?? m.tipo).trim() }))
        .filter((m: any) => m.nombre.length > 0);

      if (objetos.length > 0) {
        payload.metodosRiego = objetos;
      }
    }
  }

  // ========== NUEVOS CAMPOS: Actividades e Infraestructura ==========
  const actividadesInfra = (values as any).actividadesInfraestructura;
  if (actividadesInfra) {
    // 1. Mapear cultivos a actividades agropecuarias
    if (Array.isArray(actividadesInfra.cultivos) && actividadesInfra.cultivos.length > 0) {
      payload.actividades = actividadesInfra.cultivos.map((nombre: string) => ({
        nombre: nombre.trim(),
      }));
    }

    // 2. Mapear infraestructura (apartos, bebederos, saleros y comederos) a otrosEquipos
    const equiposInfra: any[] = [];

    if (actividadesInfra.apartos > 0) {
      equiposInfra.push({
        nombreEquipo: 'Apartos',
        cantidad: actividadesInfra.apartos,
      });
    }

    if (actividadesInfra.bebederos > 0) {
      equiposInfra.push({
        nombreEquipo: 'Bebederos',
        cantidad: actividadesInfra.bebederos,
      });
    }

    if (actividadesInfra.saleros > 0) {
      equiposInfra.push({
        nombreEquipo: 'Saleros',
        cantidad: actividadesInfra.saleros,
      });
    }

    if (actividadesInfra.comederos > 0) {
      equiposInfra.push({
        nombreEquipo: 'Comederos',
        cantidad: actividadesInfra.comederos,
      });
    } 

    if (equiposInfra.length > 0) {
      payload.otrosEquipos = [...(payload.otrosEquipos || []), ...equiposInfra];
    }
  }

// ========== NUEVOS CAMPOS: Accesos ==========
const viasAcceso = (values as any).viasAcceso;
if (viasAcceso && Array.isArray(viasAcceso.accesos) && viasAcceso.accesos.length > 0) {
  payload.accesos = viasAcceso.accesos.map((nombre: string) => ({
    nombre: nombre.trim(),
  }));
}

// ========== NUEVOS CAMPOS: Comercialización ==========
const comercializacion = (values as any).comercializacion;
if (comercializacion && Array.isArray(comercializacion.canales) && comercializacion.canales.length > 0) {
  payload.canales = comercializacion.canales.map((nombre: string) => ({
    nombre: nombre.trim(),
  }));
}

// ========== NUEVOS CAMPOS: Necesidades ==========
const necesidadesObs = (values as any).necesidadesObservaciones;
if (necesidadesObs) {
  // Mapear necesidades (solo las que tienen texto)
  const necesidadesValidas = necesidadesObs.necesidades
    .map((desc: string, index: number) => ({
      orden: index + 1,
      descripcion: desc.trim(),
    }))
    .filter((n: any) => n.descripcion.length > 0);

  if (necesidadesValidas.length > 0) {
    payload.necesidades = necesidadesValidas;
  }

}

  // ========== NUEVOS CAMPOS: Características Físicas ==========
  const caracteristicasFisicas = (values as any).caracteristicasFisicas;
  if (caracteristicasFisicas) {
    // 1. Mapear tipos de cerca a tipoCerca (estructura booleana)
    if (Array.isArray(caracteristicasFisicas.tiposCerca) && caracteristicasFisicas.tiposCerca.length > 0) {
      payload.tipoCerca = {
        alambrePuas: caracteristicasFisicas.tiposCerca.includes('Alambre de púas'),
        viva: caracteristicasFisicas.tiposCerca.includes('Viva'),
        electrica: caracteristicasFisicas.tiposCerca.includes('Eléctrica'),
        pMuerto: caracteristicasFisicas.tiposCerca.includes('Muerta'),
      };
    }

    // 2. Mapear equipos a otrosEquipos
    if (Array.isArray(caracteristicasFisicas.equipos) && caracteristicasFisicas.equipos.length > 0) {
      const mapeoEquipos: Record<string, string> = {
        'Bomba de agua': 'Motobomba',
        'Tractor': 'Tractor',
        'Carreta': 'Carreta',
        'Motosierra': 'Motosierra',
        'Picadora eléctrica': 'Picadora eléctrica',
        'Picadora de combustible': 'Picadora de combustible',
        'Tanque de ordeño': 'Tanque de ordeño',
      };

      const equiposValidos = caracteristicasFisicas.equipos
        .filter((eq: string) => mapeoEquipos[eq])
        .map((nombreEquipo: string) => ({
          nombreEquipo: mapeoEquipos[nombreEquipo],
          cantidad: 1,
        }));

      if (equiposValidos.length > 0) {
        payload.otrosEquipos = [...(payload.otrosEquipos || []), ...equiposValidos];
      }
    }
  }

  // ========== NUEVOS CAMPOS: Infraestructura y Corriente Eléctrica ==========
  const infraestructuraDisponible = (values as any).infraestructuraDisponible;
  if (infraestructuraDisponible) {
    // 1. Mapear infraestructuras
    if (Array.isArray(infraestructuraDisponible.infraestructuras) && 
        infraestructuraDisponible.infraestructuras.length > 0) {
      payload.infraestructuras = infraestructuraDisponible.infraestructuras.map(
        (nombre: string) => ({ nombre: nombre.trim() })
      );
    }

    // 2. Mapear corriente eléctrica (solo si al menos una está marcada)
    const corriente = infraestructuraDisponible.corrienteElectrica;
    if (corriente && (corriente.publica || corriente.privada)) {
      payload.corrienteElectrica = {
        publica: Boolean(corriente.publica),
        privada: Boolean(corriente.privada),
      };
    }
  }
  return payload;
}



/**
 * Hook para manejar el formulario de solicitud de asociado
 */
export function useAssociateApply(onSuccess?: () => void) {
  const mutation = useMutation({
    mutationFn: async (values: AssociateApplyValues) => {

      // 1) Crear solicitud con TODO el payload
      const payload = mapToSolicitudPayload(values);
      const response = await createSolicitud(payload);

      // 2) ID de la solicitud (soporta ambas formas de respuesta)
      const idSolicitud =
        (response as any)?.data?.idSolicitud ?? (response as any)?.idSolicitud;
      if (!idSolicitud) {
        throw new Error("No se recibió el ID de la solicitud");
      }

      // 3) Subir documentos (si hay)
      const cedula = values.idCopy instanceof File ? values.idCopy : undefined;
      const planoFinca = values.farmMap instanceof File ? values.farmMap : undefined;

      if (cedula || planoFinca) {
        await uploadDocuments(idSolicitud, { cedula, planoFinca });
        console.log("[Hook] Documentos subidos exitosamente");
      } else {
        console.log("[Hook] No hay archivos para subir");
      }

      return response;
    },
    onSuccess: (_data) => {
      console.log("[Hook] Solicitud creada exitosamente:");
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

      viasAcceso: {
        accesos: [] as string[],
      },
      comercializacion: {
        canales: [] as string[],
      },
      necesidadesObservaciones: {
        necesidades: ["", "", "", "", ""] as string[],
        observaciones: "",
        interes: "",
      },
    },
    onSubmit: async ({ value, formApi }) => {
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