import { z } from "zod";

// Schema para información básica de la finca
export const fincaBasicSchema = z.object({
  nombreFinca: z.string()
    .min(1, "El nombre de la finca es requerido")
    .max(100, "Máximo 100 caracteres"),
  
  areaHa: z.string()
    .min(1, "El área es requerida")
    .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido (ej: 15.50)"),
  
  numeroPlano: z.string()
    .min(1, "El número de plano es requerido")
    .max(50, "Máximo 50 caracteres"),
});

// Schema para geografía
export const geografiaSchema = z.object({
  provincia: z.string()
    .min(1, "La provincia es requerida"),
  
  canton: z.string()
    .min(1, "El cantón es requerido"),
  
  distrito: z.string()
    .min(1, "El distrito es requerido"),
  
  caserio: z.string()
    .max(100, "Máximo 100 caracteres")
    .optional()
    .or(z.literal("")),
});


// Campos del Propietario (solo se aplican si NO es el solicitante)
export const propietarioFieldsSchema = z.object({
    propietarioCedula: z.string().min(8, "Cédula del propietario debe tener al menos 8 dígitos").trim(),
    propietarioNombre: z.string().min(1, "Nombre del propietario es obligatorio").trim(),
    propietarioApellido1: z.string().min(1, "Primer apellido es obligatorio").trim(),
    propietarioApellido2: z.string().min(1, "Segundo apellido es obligatorio").trim(),
    propietarioTelefono: z.string().min(8, "Teléfono debe tener al menos 8 dígitos").trim(),
    propietarioEmail: z.string().email("Email inválido").trim(),
    propietarioDireccion: z.string().optional(),
  });


// Schema completo de finca
export const fincaCompleteSchema = z.object({
  ...fincaBasicSchema.shape,
  ...geografiaSchema.shape,
  ...propietarioFieldsSchema.shape,
});

export type FincaBasicValues = z.infer<typeof fincaBasicSchema>;
export type GeografiaValues = z.infer<typeof geografiaSchema>;
export type PropietarioValues = z.infer<typeof propietarioFieldsSchema>;
export type FincaCompleteValues = z.infer<typeof fincaCompleteSchema>;