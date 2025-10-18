// src/modules/volunteersForm/hooks/useVolunteerIndividual.ts

import { useMutation } from "@tanstack/react-query";
import type { VolunteersFormData } from "../../volunteersInformation/models/VolunteersType";
import { createSolicitudVoluntarioIndividual, uploadVolunteerDocuments } from "../services/volunteerFormService";
import type { CreateSolicitudVoluntarioDto } from "../models/createVolunteer";

function mapToIndividualPayload(formData: VolunteersFormData): CreateSolicitudVoluntarioDto {
  const payload: CreateSolicitudVoluntarioDto = {
    tipoSolicitante: 'INDIVIDUAL',
    
    voluntario: {
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
    },
    
    ...(formData.disponibilidades && formData.disponibilidades.length > 0 && {
      disponibilidades: formData.disponibilidades,
    }),
    
    ...(formData.areasInteres && formData.areasInteres.length > 0 && {
      areasInteres: formData.areasInteres,
    }),
  };

  console.log("[Hook Individual] Payload final:", JSON.stringify(payload, null, 2));
  return payload;
}

export function useVolunteerIndividual(onSuccess?: () => void) {
  const mutation = useMutation({
    mutationFn: async ({ 
      formData, 
      files 
    }: { 
      formData: VolunteersFormData; 
      files: { cv?: File; cedula?: File; carta?: File; } 
    }) => {
      console.log("[Hook Individual] Iniciando envío de solicitud...");
      console.log("[Hook Individual] FormData recibido:", formData);
      console.log("[Hook Individual] Files recibidos:", {
        cv: files.cv?.name,
        cedula: files.cedula?.name,
        carta: files.carta?.name,
      });
      
      // ✅ 1. Crear la solicitud
      const payload = mapToIndividualPayload(formData);
      const response = await createSolicitudVoluntarioIndividual(payload);
      
      console.log("[Hook Individual] ✅ Respuesta completa del backend:", response);
      console.log("[Hook Individual] ✅ Tipo de response:", typeof response);
      console.log("[Hook Individual] ✅ Keys de response:", Object.keys(response));
      
      // ✅ 2. Extraer el ID de la solicitud (puede venir directo o en data)
      let solicitudId: number | undefined;
      
      if (response.idSolicitudVoluntariado) {
        solicitudId = response.idSolicitudVoluntariado;
      } else if ((response as any).data?.idSolicitudVoluntariado) {
        solicitudId = (response as any).data.idSolicitudVoluntariado;
      }
      
      console.log("[Hook Individual] ✅ ID extraído:", solicitudId);
      
      // ✅ 3. Subir documentos si existen y tenemos ID
      if (solicitudId && (files.cv || files.cedula || files.carta)) {
        console.log("[Hook Individual] Subiendo documentos para solicitud:", solicitudId);
        
        const uploadFiles: any = {};
        if (files.cv) uploadFiles.cv = files.cv;
        if (files.cedula) uploadFiles.cedula = files.cedula;
        if (files.carta) uploadFiles.carta = files.carta;
        
        try {
          const uploadResponse = await uploadVolunteerDocuments(solicitudId, uploadFiles);
          console.log("[Hook Individual] ✅ Documentos subidos:", uploadResponse);
        } catch (uploadError) {
          console.error("[Hook Individual] ⚠️ Error al subir documentos:", uploadError);
          // No lanzamos error para no bloquear el flujo
        }
      } else if (!solicitudId) {
        console.error("[Hook Individual] ❌ No se pudo extraer el ID de la solicitud");
      }
      
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