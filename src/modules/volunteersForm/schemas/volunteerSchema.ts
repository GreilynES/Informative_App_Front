import { z } from "zod";

// helper: mayoría de edad (≥16 años)
const isAdult = (isoDate: string) => {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age >= 16;
};

// ========== PERSONA (también para el representante) ==========
const personaSchema = z.object({
  cedula: z
    .string()
    .trim()
    .min(8, "Cédula debe tener al menos 8 caracteres") 
    .max(60, "Máximo 60 caracteres"), 
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es requerido")
    .max(60, "Máximo 60 caracteres"),
  apellido1: z
    .string()
    .trim()
    .min(1, "El primer apellido es requerido")
    .max(60, "Máximo 60 caracteres"),
  apellido2: z
    .string()
    .trim()
    .min(1, "El segundo apellido es requerido")
    .max(60, "Máximo 60 caracteres"),
  telefono: z
    .string()
    .trim()
    .min(8, "El teléfono debe tener al menos 8 caracteres") 
    .max(20, "Máximo 20 caracteres"), 
  email: z.string().trim().toLowerCase().email("Email inválido"),

  // AHORA OBLIGATORIA + MAYOR DE 16 AÑOS
  fechaNacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es requerida")
    .refine(isAdult, "Debes ser mayor de 16 años"), 

  // Opcionales
  direccion: z.string().trim().max(200, "Máximo 200 caracteres").optional(),
  nacionalidad: z.string().trim().max(60, "Máximo 60 caracteres").optional(),
});

// ========== REPRESENTANTE ==========
const representanteSchema = z.object({
  persona: personaSchema,
  cargo: z.string().trim().min(1, "El cargo es requerido"),
});

// ========== ORGANIZACIÓN ==========
const organizacionSchema = z.object({
  cedulaJuridica: z.string().trim().min(1, "La cédula jurídica es requerida"),
  nombre: z.string().trim().min(1, "El nombre de la organización es requerido"),
  numeroVoluntarios: z
    .number()
    .int("Debe ser un número entero")
    .min(1, "Debe ser al menos 1"),
  direccion: z.string().trim().min(1, "La dirección es requerida"),
  telefono: z
    .string()
    .trim()
    .min(8, "El teléfono debe tener al menos 8 caracteres") 
    .max(20, "Máximo 20 caracteres"),
  email: z.string().trim().toLowerCase().email("Email institucional inválido"),
  tipoOrganizacion: z.string().trim().min(1, "El tipo de organización es requerido"),

  // Representante (obligatorio)
  representante: representanteSchema,

  // Opcionales
  razonesSociales: z
    .array(
      z.object({
        razonSocial: z.string().trim().min(1, "La razón social no puede estar vacía"),
      })
    )
    .optional(),

  disponibilidades: z
    .array(
      z.object({
        fechaInicio: z.string().trim().min(1, "Fecha de inicio requerida"),
        fechaFin: z.string().trim().min(1, "Fecha de fin requerida"),
        dias: z.array(z.string()).min(1, "Seleccione al menos un día"),
        horario: z.string().trim().min(1, "El horario es requerido"),
      })
    )
    .optional(),

  areasInteres: z
    .array(
      z.object({
        nombreArea: z.string().trim().min(1, "El área no puede estar vacía"),
      })
    )
    .optional(),
});

// ========== SCHEMA COMPLETO ==========
export const volunteerOrganizacionSchema = z.object({
  tipoSolicitante: z.literal("ORGANIZACION"),
  organizacion: organizacionSchema,
});

export type VolunteerOrganizacionValues = z.infer<typeof volunteerOrganizacionSchema>;
