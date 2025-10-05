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

// Schema para propietario (DESHABILITADO - Backend pendiente)
// Por ahora solo validamos que esPropietario exista
export const propietarioSchema = z.object({
  esPropietario: z.boolean().default(true),
  
  // Campos opcionales - no se validan por ahora
  propietarioCedula: z.string().optional().or(z.literal("")),
  propietarioNombre: z.string().optional().or(z.literal("")),
  propietarioApellido1: z.string().optional().or(z.literal("")),
  propietarioApellido2: z.string().optional().or(z.literal("")),
  propietarioTelefono: z.string().optional().or(z.literal("")),
  propietarioEmail: z.string().optional().or(z.literal("")),
  propietarioFechaNacimiento: z.string().optional().or(z.literal("")),
  propietarioDireccion: z.string().optional().or(z.literal("")),
});

// Cuando el backend esté listo, descomentar esta validación:
/*
export const propietarioSchema = z.object({
  esPropietario: z.boolean(),
  
  propietarioCedula: z.string().optional().or(z.literal("")),
  propietarioNombre: z.string().optional().or(z.literal("")),
  propietarioApellido1: z.string().optional().or(z.literal("")),
  propietarioApellido2: z.string().optional().or(z.literal("")),
  propietarioTelefono: z.string().optional().or(z.literal("")),
  propietarioEmail: z.string().optional().or(z.literal("")),
  propietarioFechaNacimiento: z.string().optional().or(z.literal("")),
  propietarioDireccion: z.string().optional().or(z.literal("")),
}).refine((data) => {
  // Si NO es propietario, todos los campos son obligatorios
  if (!data.esPropietario) {
    return (
      data.propietarioCedula && data.propietarioCedula.length >= 8 &&
      data.propietarioNombre && data.propietarioNombre.length >= 1 &&
      data.propietarioApellido1 && data.propietarioApellido1.length >= 1 &&
      data.propietarioApellido2 && data.propietarioApellido2.length >= 1 &&
      data.propietarioTelefono && data.propietarioTelefono.length >= 8 &&
      data.propietarioEmail && data.propietarioEmail.length >= 1
    );
  }
  return true;
}, {
  message: "Complete todos los datos del propietario",
});
*/

// Schema completo de finca
export const fincaCompleteSchema = z.object({
  ...fincaBasicSchema.shape,
  ...geografiaSchema.shape,
  ...propietarioSchema.shape,
});

export type FincaBasicValues = z.infer<typeof fincaBasicSchema>;
export type GeografiaValues = z.infer<typeof geografiaSchema>;
export type PropietarioValues = z.infer<typeof propietarioSchema>;
export type FincaCompleteValues = z.infer<typeof fincaCompleteSchema>;