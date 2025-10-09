import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { type AssociateApplyValues } from "../schemas/associateApply";
import { createSolicitud } from "../services/associatesFormService";
import { type CreateSolicitudDto } from "../models/createAssociate";

/**
 * Mapea los valores del formulario al formato que espera el backend
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

  // Agregar núcleo familiar solo si hay datos
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

  // LÓGICA DEL PROPIETARIO
  const esPropietario = (values as any).esPropietario;

  if (esPropietario === false) {
    console.log("[Hook] El asociado NO es el propietario - enviando datos del propietario");
    
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
          : {}
        ),
      },
    };
  }

  // LÓGICA DEL HATO
  const hatoData = (values as any).hatoData;
  if (hatoData) {
    payload.hato = {
      idFinca: 0,
      tipoExplotacion: hatoData.tipoExplotacion,
      totalGanado: parseInt(hatoData.totalGanado),
      ...(hatoData.razaPredominante && { razaPredominante: hatoData.razaPredominante }),
    };
  
    if (Array.isArray(hatoData.animales) && hatoData.animales.length > 0) {
      // ⬇️ Cambio clave: enviar nombre/edad (lo que la tabla espera)
      payload.animales = hatoData.animales.map((a: any) => ({
        nombre: a.nombre,                 // antes: tipoAnimal
        edad: parseInt(a.edad),           // antes: edadAnios
        cantidad: parseInt(a.cantidad),
        // idHato lo asigna el back en la transacción
      }));
    }
  }

 // --- FORRAJES ---
const forrajes = (values as any).forrajes;
if (Array.isArray(forrajes) && forrajes.length > 0) {
  const mapeados = forrajes
    .filter((f: any) => f?.tipoForraje && f?.variedad && f?.utilizacion && Number(f?.hectareas) > 0)
    .map((f: any) => ({
      tipoForraje: String(f.tipoForraje).trim(),
      variedad: String(f.variedad).trim(),
      hectareas: Number(f.hectareas),        // número
      utilizacion: String(f.utilizacion).trim(),
    }));

  if (mapeados.length > 0) {
    payload.forrajes = mapeados;
  }
}

// --- REGISTROS PRODUCTIVOS ---
const registrosProductivos = (values as any).registrosProductivos;
if (registrosProductivos) {
  payload.registrosProductivos = {
    reproductivos: Boolean(registrosProductivos.reproductivos),
    costosProductivos: Boolean(registrosProductivos.costosProductivos),
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
      const payload = mapToSolicitudPayload(values);
      return createSolicitud(payload);
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
      // Datos de Persona
      cedula: "",
      nombre: "",
      apellido1: "",
      apellido2: "",
      fechaNacimiento: "",
      telefono: "",
      email: "",
      direccion: "",
      
      // Datos del Asociado
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

      // Datos de la Finca
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

      // NUEVOS CAMPOS
      hatoData: null as any, // Guardará: { tipoExplotacion, totalGanado, razaPredominante, animales: [] }
      forrajes: [] as any[], // Array de forrajes
      registrosProductivos: null as any, // { reproductivos: boolean, costosProductivos: boolean }
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