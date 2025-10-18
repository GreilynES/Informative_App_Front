// src/modules/volunteersForm/hooks/useVolunteerApply.ts

import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { createSolicitudVoluntario } from "../services/volunteerFormService";
import type { CreateSolicitudVoluntarioDto } from "../models/createVolunteer";

/**
 * Mapea los valores del formulario al formato del backend
 */
function mapToSolicitudPayload(values: any): CreateSolicitudVoluntarioDto {
  const payload: CreateSolicitudVoluntarioDto = {
    tipoSolicitante: 'ORGANIZACION',
    organizacion: {
      cedulaJuridica: values.organizacion.cedulaJuridica,
      nombre: values.organizacion.nombre,
      numeroVoluntarios: parseInt(values.organizacion.numeroVoluntarios) || 1,
      direccion: values.organizacion.direccion,
      telefono: values.organizacion.telefono,
      email: values.organizacion.email,
      tipoOrganizacion: values.organizacion.tipoOrganizacion,

      // ✅ CORRECCIÓN: Enviar como array de representantes
      representantes: values.organizacion.representante ? [{
        persona: {
          cedula: values.organizacion.representante.persona.cedula,
          nombre: values.organizacion.representante.persona.nombre,
          apellido1: values.organizacion.representante.persona.apellido1,
          apellido2: values.organizacion.representante.persona.apellido2,
          telefono: values.organizacion.representante.persona.telefono,
          email: values.organizacion.representante.persona.email,
          ...(values.organizacion.representante.persona.fechaNacimiento && {
            fechaNacimiento: values.organizacion.representante.persona.fechaNacimiento,
          }),
          ...(values.organizacion.representante.persona.direccion && {
            direccion: values.organizacion.representante.persona.direccion,
          }),
        },
        cargo: values.organizacion.representante.cargo,
      }] : [],
    },
  };

  // Razones sociales (opcional)
  if (values.organizacion.razonesSociales?.length > 0) {
    payload.organizacion!.razonesSociales = values.organizacion.razonesSociales;
  }

  // Disponibilidades (opcional)
  if (values.organizacion.disponibilidades?.length > 0) {
    payload.organizacion!.disponibilidades = values.organizacion.disponibilidades;
  }

  // Áreas de interés (opcional)
  if (values.organizacion.areasInteres?.length > 0) {
    payload.organizacion!.areasInteres = values.organizacion.areasInteres;
  }

  console.log("[Hook] Payload final:", JSON.stringify(payload, null, 2));
  return payload;
}

/**
 * Hook para manejar el formulario de solicitud de voluntario (ORGANIZACIÓN)
 */
export function useVolunteerApply(onSuccess?: () => void) {
  const mutation = useMutation({
    mutationFn: async (values: any) => {
      console.log("[Hook] Iniciando envío de solicitud...");
      
      const payload = mapToSolicitudPayload(values);
      const response = await createSolicitudVoluntario(payload);
      
      console.log("[Hook] Solicitud creada exitosamente:", response);
      return response;
    },
    onSuccess: (data) => {
      console.log("[Hook] ✅ Solicitud enviada:", data);
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("[Hook] ❌ Error al crear solicitud:", error);
      console.error("[Hook] Detalles:", error?.response?.data);
    },
  });

  const form = useForm({
    defaultValues: {
      tipoSolicitante: 'ORGANIZACION' as const,
      
      organizacion: {
        cedulaJuridica: "",
        nombre: "",
        numeroVoluntarios: 1,
        direccion: "",
        telefono: "",
        email: "",
        tipoOrganizacion: "",
        
        representante: {
          persona: {
            cedula: "",
            nombre: "",
            apellido1: "",
            apellido2: "",
            telefono: "",
            email: "",
            fechaNacimiento: "",
            direccion: "",
          },
          cargo: "",
        },
        
        razonesSociales: [] as Array<{ razonSocial: string }>,
        disponibilidades: [] as any[],
        areasInteres: [] as Array<{ nombreArea: string }>,
      },
    },
    onSubmit: async ({ value, formApi }) => {
      console.log("[Hook] Submit iniciado");
      console.log("[Hook] Valores del formulario:", value);
      try {
        await mutation.mutateAsync(value);
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