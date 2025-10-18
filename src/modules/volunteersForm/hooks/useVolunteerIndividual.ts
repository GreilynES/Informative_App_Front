// src/modules/volunteersForm/hooks/useVolunteerIndividual.ts

import { useMutation } from "@tanstack/react-query";
import type { VolunteersFormData } from "../../volunteersInformation/models/VolunteersType";
import { createSolicitudVoluntarioIndividual } from "../services/volunteerFormService";
import type { CreateSolicitudVoluntarioDto } from "../models/createVolunteer";

function mapToIndividualPayload(formData: VolunteersFormData): CreateSolicitudVoluntarioDto {
  const payload: CreateSolicitudVoluntarioDto = {
    tipoSolicitante: 'INDIVIDUAL',
    
    voluntario: {  // ✅ CAMBIO: "voluntarioIndividual" → "voluntario"
      persona: {
        cedula: formData.idNumber,
        nombre: formData.name,
        apellido1: formData.lastName1,
        apellido2: formData.lastName2,
        fechaNacimiento: formData.birthDate,
        telefono: formData.phone,
        email: formData.email,
        ...(formData.address?.trim() && { direccion: formData.address }),
      },
      motivacion: formData.motivation?.trim() || "Sin especificar",
      habilidades: formData.volunteeringType?.trim() || "Por definir",
      experiencia: formData.previousExperience?.trim() || "Sin experiencia previa",
      nacionalidad: formData.nacionalidad?.trim() || "Costarricense",
      
      disponibilidades: [],
      areasInteres: [],
    },
  };

  console.log("[Hook Individual] Payload final:", JSON.stringify(payload, null, 2));
  return payload;
}

export function useVolunteerIndividual(onSuccess?: () => void) {
  const mutation = useMutation({
    mutationFn: async (formData: VolunteersFormData) => {
      console.log("[Hook Individual] Iniciando envío de solicitud...");
      console.log("[Hook Individual] FormData recibido:", formData);
      
      const payload = mapToIndividualPayload(formData);
      const response = await createSolicitudVoluntarioIndividual(payload);
      
      console.log("[Hook Individual] Solicitud creada exitosamente:", response);
      return response;
    },
    onSuccess: (data) => {
      console.log("[Hook Individual] ✅ Solicitud enviada:", data);
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("[Hook Individual] ❌ Error al crear solicitud:", error);
      console.error("[Hook Individual] Response completo:", error?.response);
      console.error("[Hook Individual] Detalles del error:", error?.response?.data);
      
      if (error?.response?.data?.message) {
        console.error("[Hook Individual] Mensaje del servidor:", error.response.data.message);
      }
    },
  });

  return {
    submitIndividual: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}