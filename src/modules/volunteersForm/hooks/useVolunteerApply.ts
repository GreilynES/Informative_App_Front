// src/modules/volunteersForm/hooks/useVolunteerApply.ts

import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { createSolicitudVoluntario, uploadVolunteerDocuments } from "../services/volunteerFormService";
import type { CreateSolicitudVoluntarioDto } from "../models/createVolunteer";

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
    },
  };

  // Solo agregar representante si tiene datos completos
  if (
    values.organizacion.representante?.persona?.cedula &&
    values.organizacion.representante?.persona?.nombre &&
    values.organizacion.representante?.persona?.apellido1 &&
    values.organizacion.representante?.persona?.apellido2 &&
    values.organizacion.representante?.persona?.telefono &&
    values.organizacion.representante?.persona?.email &&
    values.organizacion.representante?.cargo
  ) {
    payload.representantes = [{
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
    }];
  }
  
  // Solo agregar razones sociales si existen
  if (values.organizacion.razonesSociales?.length > 0) {
    const razonesFiltradas = values.organizacion.razonesSociales.filter(
      (r: any) => r?.razonSocial?.trim() || (typeof r === 'string' && r.trim())
    );
    
    if (razonesFiltradas.length > 0) {
      payload.razonesSociales = razonesFiltradas.map((r: any) => ({
        razonSocial: typeof r === 'string' ? r : r.razonSocial,
      }));
    }
  }

  // Solo agregar disponibilidades si existen
  if (values.organizacion.disponibilidades?.length > 0) {
    const disponibilidadesFiltradas = values.organizacion.disponibilidades.filter(
      (d: any) => d?.fechaInicio && d?.fechaFin && d?.dias?.length > 0 && d?.horarios?.length > 0
    );
    
    if (disponibilidadesFiltradas.length > 0) {
      payload.disponibilidades = disponibilidadesFiltradas;
    }
  }

  // Solo agregar áreas de interés si existen
  if (values.organizacion.areasInteres?.length > 0) {
    const areasFiltradas = values.organizacion.areasInteres.filter(
      (a: any) => a?.nombreArea?.trim() || (typeof a === 'string' && a.trim())
    );
    
    if (areasFiltradas.length > 0) {
      payload.areasInteres = areasFiltradas.map((a: any) => ({
        nombreArea: typeof a === 'string' ? a : a.nombreArea,
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
      files 
    }: { 
      values: any; 
      files?: { cv?: File; cedula?: File; carta?: File; } 
    }) => {
      console.log("[Hook Org] Iniciando envío de solicitud...");
      console.log("[Hook Org] Valores recibidos:", values);
      console.log("[Hook Org] Files recibidos:", {
        cv: files?.cv?.name,
        cedula: files?.cedula?.name,
        carta: files?.carta?.name,
      });
      
      // ✅ 1. Crear la solicitud
      const payload = mapToSolicitudPayload(values);
      const response = await createSolicitudVoluntario(payload);
      
      console.log("[Hook Org] ✅ Solicitud creada:", response);
      
      // ✅ 2. Extraer el ID de la solicitud (ya viene directo en response)
      const solicitudId = response.idSolicitudVoluntariado;
      console.log("[Hook Org] ✅ ID extraído:", solicitudId);
      
      // ✅ 3. Subir documentos si existen
      if (solicitudId && files && (files.cv || files.cedula || files.carta)) {
        console.log("[Hook Org] Subiendo documentos para solicitud:", solicitudId);
        
        const uploadFiles: any = {};
        if (files.cv) uploadFiles.cv = files.cv;
        if (files.cedula) uploadFiles.cedula = files.cedula;
        if (files.carta) uploadFiles.carta = files.carta;
        
        try {
          const uploadResponse = await uploadVolunteerDocuments(solicitudId, uploadFiles);
          console.log("[Hook Org] ✅ Documentos subidos:", uploadResponse);
        } catch (uploadError) {
          console.error("[Hook Org] ⚠️ Error al subir documentos:", uploadError);
          // No lanzamos error para no bloquear el flujo
        }
      } else {
        console.log("[Hook Org] No hay archivos para subir o falta ID");
      }
      
      return response;
    },
    onSuccess: (data) => {
      console.log("[Hook Org] ✅ Todo completado:", data);
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("[Hook Org] ❌ Error:", error);
      console.error("[Hook Org] Detalles:", error?.response?.data);
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
        disponibilidades: [] as Array<{
          fechaInicio: string;
          fechaFin: string;
          dias: string[];
          horarios: string[];
        }>,
        areasInteres: [] as Array<{ nombreArea: string }>,
      },
    },
    onSubmit: async () => {
      // ✅ No hacer nada aquí - se maneja desde submitWithFiles
      console.log("[Hook Org Form] Submit llamado (no debería usarse directamente)");
    },
  });

  // ✅ Exponer la función de submit con archivos
  const submitWithFiles = async (params: { 
    values: any; 
    files?: { cv?: File; cedula?: File; carta?: File; } 
  }) => {
    return mutation.mutateAsync(params);
  };

  return {
    form,
    mutation,
    submitWithFiles,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}