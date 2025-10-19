import { z } from "zod";

/* Helpers */
export const isAdult = (isoDate: string) => {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age >= 16;
};

export const isFutureOrToday = (isoDate: string) => {
  if (!isoDate) return false;
  const selected = new Date(isoDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);
  return selected >= today;
};

/* Sub-schemas */
export const personaSchema = z.object({
  cedula: z.string().trim().min(8, "Cédula debe tener al menos 8 caracteres").max(60, "Máximo 60 caracteres"),
  nombre: z.string().trim().min(1, "El nombre es requerido").max(60, "Máximo 60 caracteres"),
  apellido1: z.string().trim().min(1, "El primer apellido es requerido").max(60, "Máximo 60 caracteres"),
  apellido2: z.string().trim().min(1, "El segundo apellido es requerido").max(60, "Máximo 60 caracteres"),
  telefono: z.string().trim().min(8, "El teléfono debe tener al menos 8 caracteres").max(20, "Máximo 20 caracteres"),
  email: z.string().trim().toLowerCase().email("Email inválido"),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es requerida").refine(isAdult, "Debes ser mayor de 16 años"),
  direccion: z.string().trim().max(200, "Máximo 200 caracteres").optional(),
  nacionalidad: z.string().trim().max(60, "Máximo 60 caracteres").optional(),
});

export const representanteSchema = z.object({
  persona: personaSchema,
  cargo: z.string().trim().min(1, "El cargo es requerido"),
});

export const disponibilidadSchema = z
  .object({
    fechaInicio: z.string().trim().min(1, "Fecha de inicio requerida").refine(isFutureOrToday, "La fecha de inicio no puede ser anterior a hoy"),
    fechaFin: z.string().trim().min(1, "Fecha de fin requerida").refine(isFutureOrToday, "La fecha de fin no puede ser anterior a hoy"),
    dias: z.array(z.string()).min(1, "Seleccione al menos un día disponible"),
    horarios: z.array(z.string()).min(1, "Seleccione al menos un horario preferido"),
  })
  .refine(
    (data) => {
      if (!data.fechaInicio || !data.fechaFin) return true;
      return new Date(data.fechaFin) >= new Date(data.fechaInicio);
    },
    { message: "La fecha de fin no puede ser anterior a la de inicio", path: ["fechaFin"] }
  );

export const areaInteresSchema = z.object({
  nombreArea: z.string().trim().min(1, "El área no puede estar vacía"),
});

/* Paso 3: Motivación / Habilidades — con máximo 150 */
export const motivacionHabilidadesSchema = z.object({
  motivation: z
    .string()
    .trim()
    .min(10, "Describe tu motivación en al menos 10 caracteres")
    .max(150, "Máximo 150 caracteres"),
  volunteeringType: z
    .string()
    .trim()
    .min(1, "Indica al menos una habilidad o área en la que puedas apoyar")
    .max(150, "Máximo 150 caracteres"),
  previousExperience: z
    .string()
    .trim()
    .max(150, "Máximo 150 caracteres")
    .optional(),
});

/* ORGANIZACIÓN */
export const organizacionSchema = z.object({
  cedulaJuridica: z.string().trim().min(1, "La cédula jurídica es requerida"),
  nombre: z.string().trim().min(1, "El nombre de la organización es requerido"),
  numeroVoluntarios: z.number().int("Debe ser un número entero").min(1, "Debe ser al menos 1"),
  direccion: z.string().trim().min(1, "La dirección es requerida"),
  telefono: z.string().trim().min(8, "El teléfono debe tener al menos 8 caracteres").max(20, "Máximo 20 caracteres"),
  email: z.string().trim().toLowerCase().email("Email institucional inválido"),
  tipoOrganizacion: z.string().trim().min(1, "El tipo de organización es requerido"),
  representante: representanteSchema,
  razonesSociales: z.array(z.object({ razonSocial: z.string().trim().min(1, "La razón social no puede estar vacía") })).optional(),
  disponibilidades: z.array(disponibilidadSchema).optional(),
  areasInteres: z.array(areaInteresSchema).min(1, "Seleccione al menos un área de interés").optional(),
});

export const volunteerOrganizacionSchema = z.object({
  tipoSolicitante: z.literal("ORGANIZACION"),
  organizacion: organizacionSchema,
});
export type VolunteerOrganizacionValues = z.infer<typeof volunteerOrganizacionSchema>;

/* INDIVIDUAL (opcional) */
export const volunteerIndividualSchema = z.object({
  tipoSolicitante: z.literal("INDIVIDUAL"),
  persona: personaSchema.optional(),
  disponibilidades: z.array(disponibilidadSchema).optional(),
  areasInteres: z.array(areaInteresSchema).optional(),
  motivacion: motivacionHabilidadesSchema,
});
export type VolunteerIndividualValues = z.infer<typeof volunteerIndividualSchema>;
