import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { associateApplySchema, type AssociateApplyValues } from "../schemas/associateApply";
import { createAssociate, type CreateAssociatePayload } from "../services/associatesFormService";

// Valida con Zod y DEVUELVE Record<string, string>
function validateWithZod(values: any) {
  const parsed = associateApplySchema.safeParse(values);
  if (parsed.success) return; // sin errores

  const errors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0] ?? "");
    if (!key) continue;
    // primera ocurrencia por campo
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

function mapToPayload(v: AssociateApplyValues): CreateAssociatePayload {
  return {
    cedula: v.cedula,
    nombre: v.nombre,
    apellido1: v.apellido1,
    apellido2: v.apellido2,
    // si tu back requiere ISO: `${v.fechaNacimiento}T00:00:00.000Z`
    fechaNacimiento: v.fechaNacimiento,
    telefono: v.telefono,
    email: v.email,
    direccion: v.direccion || undefined,
    distanciaFinca: v.distanciaFinca ? Number(v.distanciaFinca) : undefined,
    viveEnFinca: Boolean(v.viveEnFinca),
    marcaGanado: v.marcaGanado || undefined,
    CVO: v.CVO || undefined,
  };
}

export function useAssociateApply(onSuccess?: () => void) {
  const mutation = useMutation({
    mutationFn: async (values: AssociateApplyValues) => {
      const dto = mapToPayload(values);
      return createAssociate(dto);
    },
  });

  // SIN genéricos: dejamos que la lib infiera
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
      // Archivos (solo UI)
      idCopy: null as File | null,
      farmDiagnosis: null as File | null,
      farmMap: null as File | null,
      otherDocuments: null as File | null,
    },
    validators: {
      // ⚠️ SIEMPRE devolver Record<string, string>
      onChange: ({ value }) => validateWithZod(value),
      onBlur: ({ value }) => validateWithZod(value),
      onSubmit: ({ value }) => validateWithZod(value),
    },
    onSubmit: async ({ value, formApi }) => {
      console.log("[TanStack Form] submit start, values:", value);
      const dto = mapToPayload(value as any);
      console.log("[POST] /associates payload =>", dto);

      await mutation.mutateAsync(value as any);

      console.log("[TanStack Form] submit success");
      onSuccess?.();
      formApi.reset();
    },
  });

  return { form, mutation };
}
