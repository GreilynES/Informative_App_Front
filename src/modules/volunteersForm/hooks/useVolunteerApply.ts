import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import {
  createSolicitudVoluntario,
  uploadVolunteerDocuments,
} from "../services/volunteerFormService";
import type { CreateSolicitudVoluntarioDto } from "../models/createVolunteer";

function mapToSolicitudPayload(values: any): CreateSolicitudVoluntarioDto {
  const payload: CreateSolicitudVoluntarioDto = {
    tipoSolicitante: "ORGANIZACION",
    organizacion: {
      cedulaJuridica: values.organizacion.cedulaJuridica,
      nombre: values.organizacion.nombre,
      numeroVoluntarios: parseInt(values.organizacion.numeroVoluntarios) || 1,
      direccion: values.organizacion.direccion,
      telefono: values.organizacion.telefono,
      email: values.organizacion.email,
      tipoOrganizacion: values.organizacion.tipoOrganizacion,
    },
  };

  if (
    values.organizacion.representante?.persona?.cedula &&
    values.organizacion.representante?.persona?.nombre &&
    values.organizacion.representante?.persona?.apellido1 &&
    values.organizacion.representante?.persona?.apellido2 &&
    values.organizacion.representante?.persona?.telefono &&
    values.organizacion.representante?.persona?.email &&
    values.organizacion.representante?.cargo
  ) {
    payload.representantes = [
      {
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
      },
    ];
  }

  if (values.organizacion.razonesSociales?.length > 0) {
    const razonesFiltradas = values.organizacion.razonesSociales.filter(
      (r: any) => r?.razonSocial?.trim() || (typeof r === "string" && r.trim())
    );
    if (razonesFiltradas.length > 0) {
      payload.razonesSociales = razonesFiltradas.map((r: any) => ({
        razonSocial: typeof r === "string" ? r : r.razonSocial,
      }));
    }
  }

  if (values.organizacion.disponibilidades?.length > 0) {
    const disponibilidadesFiltradas = values.organizacion.disponibilidades.filter(
      (d: any) => d?.fechaInicio && d?.fechaFin && d?.dias?.length > 0 && d?.horarios?.length > 0
    );
    if (disponibilidadesFiltradas.length > 0) {
      payload.disponibilidades = disponibilidadesFiltradas;
    }
  }

  if (values.organizacion.areasInteres?.length > 0) {
    const areasFiltradas = values.organizacion.areasInteres.filter(
      (a: any) => a?.nombreArea?.trim() || (typeof a === "string" && a.trim())
    );
    if (areasFiltradas.length > 0) {
      payload.areasInteres = areasFiltradas.map((a: any) => ({
        nombreArea: typeof a === "string" ? a : a.nombreArea,
      }));
    }
  }

  console.log("[Hook Org] Payload final limpio:", JSON.stringify(payload, null, 2));
  return payload;
}

export function useVolunteerApply(onSuccess?: () => void) {
  const mutation = useMutation({
    mutationFn: async ({
      values,
      files,
    }: {
      values: any;
      files?: { cv?: File; cedula?: File; carta?: File };
    }) => {
      console.log("[Hook Org] Iniciando envío de solicitud...");

      const payload = mapToSolicitudPayload(values);
      const response = await createSolicitudVoluntario(payload);

      const solicitudId = response?.idSolicitudVoluntariado;
      if (!solicitudId) {
        throw new Error("El servidor no devolvió idSolicitudVoluntariado.");
      }

      if (files && (files.cv || files.cedula || files.carta)) {
        try {
          await uploadVolunteerDocuments(solicitudId, files);
          console.log("[Hook Org] ✅ Documentos subidos");
        } catch (uploadError) {
          console.error("[Hook Org] ⚠️ Error al subir documentos:", uploadError);
          // No bloquea el flujo
        }
      }

      return response;
    },
    onSuccess: () => onSuccess?.(),
    onError: (error: any) => {
      console.error("[Hook Org] ❌ Error:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });
    },
  });

  const form = useForm({
    defaultValues: {
      tipoSolicitante: "ORGANIZACION" as const,
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
        disponibilidades: [] as Array<{
          fechaInicio: string;
          fechaFin: string;
          dias: string[];
          horarios: string[];
        }>,
        areasInteres: [] as Array<{ nombreArea: string }>,
      },
    },
    onSubmit: async () => {},
  });

  const submitWithFiles = async (params: {
    values: any;
    files?: { cv?: File; cedula?: File; carta?: File };
  }) => mutation.mutateAsync(params);

  return { form, mutation, submitWithFiles };
}
