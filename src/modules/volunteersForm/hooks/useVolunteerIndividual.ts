// src/modules/volunteersForm/hooks/useVolunteerIndividual.ts

import { useMutation } from "@tanstack/react-query";
import type { VolunteersFormData } from "../../volunteersInformation/models/VolunteersType";
import { createSolicitudVoluntario, uploadVolunteerDocuments } from "../services/volunteerFormService";
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

  return payload;
}

export function useVolunteerIndividual(onSuccess?: () => void) {
  const mutation = useMutation({
    mutationFn: async ({
      formData,
      files,
    }: {
      formData: VolunteersFormData;
      files: { cv?: File; cedula?: File; carta?: File };
    }) => {

      // 1) Crear la solicitud (medir SOLO create)
      const payload = mapToIndividualPayload(formData);

      const response = await createSolicitudVoluntario(payload);

      // 2) Extraer ID
      let solicitudId: number | undefined;

      if ((response as any).idSolicitudVoluntariado) {
        solicitudId = (response as any).idSolicitudVoluntariado;
      } else if ((response as any).data?.idSolicitudVoluntariado) {
        solicitudId = (response as any).data.idSolicitudVoluntariado;
      }

      // 3) Subir documentos (medir SOLO upload)
      if (solicitudId && (files.cv || files.cedula || files.carta)) {
        const uploadFiles: any = {};
        if (files.cv) uploadFiles.cv = files.cv;
        if (files.cedula) uploadFiles.cedula = files.cedula;
        if (files.carta) uploadFiles.carta = files.carta;

        try {
          await uploadVolunteerDocuments(solicitudId, uploadFiles);
        } catch (uploadError) {
          // No lanzamos error para no bloquear el flujo
        }
      } else if (!solicitudId) {
      }
      return response;
    },
    onSuccess: (_data) => {
      onSuccess?.();
    },
    onError: (_error: any) => {
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