// src/modules/associatesForm/hooks/useAssociateApply.ts

import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import {type AssociateApplyValues } from "../schemas/associateApply";
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
      // NOTA: distanciaFinca NO se envía en la creación inicial
      // Se puede actualizar después mediante el endpoint PATCH /associates/:id
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

  console.log("[Hook] Payload mapeado:", JSON.stringify(payload, null, 2));
  
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
      distanciaFinca: "", // Campo en el form pero NO se envía al crear
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

      // Propietario (deshabilitado - backend pendiente)
      esPropietario: true,
    },
    onSubmit: async ({ value, formApi }) => {
      console.log("[Hook] Submit iniciado");
      console.log("[Hook] Valores del formulario:", value);
      
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