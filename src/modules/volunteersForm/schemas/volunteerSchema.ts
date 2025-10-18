// src/modules/volunteersForm/schemas/volunteerSchema.ts

import { z } from "zod";

// ========== PERSONA (para el representante) ==========
const personaSchema = z.object({
  cedula: z.string().min(8, "Cédula debe tener al menos 8 caracteres"),
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido1: z.string().min(1, "El primer apellido es requerido"),
  apellido2: z.string().min(1, "El segundo apellido es requerido"),
  telefono: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  email: z.string().email("Email inválido"),
  fechaNacimiento: z.string().optional(),
  direccion: z.string().optional(),
});

// ========== REPRESENTANTE ==========
const representanteSchema = z.object({
  persona: personaSchema,
  cargo: z.string().min(1, "El cargo es requerido"),
});

// ========== ORGANIZACIÓN ==========
const organizacionSchema = z.object({
  cedulaJuridica: z.string().min(1, "La cédula jurídica es requerida"),
  nombre: z.string().min(1, "El nombre de la organización es requerido"),
  numeroVoluntarios: z.number()
    .int("Debe ser un número entero")
    .min(1, "Debe ser al menos 1"),
  direccion: z.string().min(1, "La dirección es requerida"),
  telefono: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  email: z.string().email("Email institucional inválido"),
  tipoOrganizacion: z.string().min(1, "El tipo de organización es requerido"),
  
  // Representante (obligatorio)
  representante: representanteSchema,
  
  // Opcionales
  razonesSociales: z.array(z.object({
    razonSocial: z.string().min(1, "La razón social no puede estar vacía"),
  })).optional(),
  
  disponibilidades: z.array(z.object({
    fechaInicio: z.string().min(1, "Fecha de inicio requerida"),
    fechaFin: z.string().min(1, "Fecha de fin requerida"),
    dias: z.array(z.string()).min(1, "Seleccione al menos un día"),
    horario: z.string().min(1, "El horario es requerido"),
  })).optional(),
  
  areasInteres: z.array(z.object({
    nombreArea: z.string().min(1, "El área no puede estar vacía"),
  })).optional(),
});

// ========== SCHEMA COMPLETO ==========
export const volunteerOrganizacionSchema = z.object({
  tipoSolicitante: z.literal('ORGANIZACION'),
  organizacion: organizacionSchema,
});

export type VolunteerOrganizacionValues = z.infer<typeof volunteerOrganizacionSchema>;