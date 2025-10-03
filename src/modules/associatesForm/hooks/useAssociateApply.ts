import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { associateApplySchema, type AssociateApplyValues } from "../schemas/associateApply";
import { createSolicitud } from "../services/associatesFormService";

function mapToSolicitudPayload(values: AssociateApplyValues) {
  // El backend espera este formato según CreateSolicitudDto
  const payload = {
    persona: {
      cedula: values.cedula,
      nombre: values.nombre,
      apellido1: values.apellido1,
      apellido2: values.apellido2 || undefined,
      fechaNacimiento: values.fechaNacimiento,
      telefono: values.telefono,
      email: values.email,
      direccion: values.direccion || undefined,
    },
    datosAsociado: {
      distanciaFinca: values.distanciaFinca ? Number(values.distanciaFinca) : undefined,
      viveEnFinca: Boolean(values.viveEnFinca),
      marcaGanado: values.marcaGanado || undefined,
      CVO: values.CVO || undefined,
    },
  };

  console.log("[Hook] Payload mapeado para solicitud:", payload);
  return payload;
}

export function useAssociateApply(onSuccess?: () => void) {
  const mutation = useMutation({
    mutationFn: async (values: AssociateApplyValues) => {
      console.log("[Hook] mutationFn values:", values);
      const payload = mapToSolicitudPayload(values);
      return createSolicitud(payload);
    },
    onSuccess: (data) => {
      console.log("[Hook] onSuccess:", data);
      onSuccess?.();
    },
    onError: (error) => {
      console.error("[Hook] onError:", error);
    },
    onSettled: () => {
      console.log("[Hook] onSettled");
    },
  });

  const form = useForm({
    defaultValues: {
      cedula: "",
      nombre: "",
      apellido1: "",
      apellido2: "",
      fechaNacimiento: "",
      telefono: "",
      email: "",
      direccion: "",
      distanciaFinca: "",
      viveEnFinca: false,
      marcaGanado: "",
      CVO: "",
      acceptTerms: false,
      receiveInfo: false,
      idCopy: null as File | null,
      farmDiagnosis: null as File | null,
      farmMap: null as File | null,
      otherDocuments: null as File | null,
    },
    onSubmit: async ({ value, formApi }) => {
      console.log("[Hook] SUBMIT values:", value);
      try {
        await mutation.mutateAsync(value as any);
        console.log("[Hook] Submit OK");
        formApi.reset();
      } catch (err) {
        console.error("[Hook] Submit ERROR:", err);
      }
    },
  });

  return { form, mutation };
}