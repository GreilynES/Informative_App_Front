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

//Hato Ganadero 

export const hatoItemSchema = z.object({
  animal: z
    .string()
    .min(1, "El nombre del animal es requerido")
    .max(75, "Máximo 75 caracteres"),

  edad: z.preprocess(
    (v) => (typeof v === "string" ? Number(v) : v),
    z.number().int().min(0, "La edad no puede ser negativa").max(110, "Edad excesiva")
  ),

  cantidad: z.preprocess(
    (v) => (typeof v === "string" ? Number(v) : v),
    z.number().int().min(1, "La cantidad debe ser al menos 1").max(100000, "Cantidad demasiado alta")
  ),
});

export const hatoGanaderoSchema = z
  .object({
    tipoExplotacion: z
      .string()
      .min(1, "Tipo de explotación requerida")
      .max(75, "Máximo 75 caracteres"),

    razaPredominante: z
      .string()
      .max(75, "Máximo 75 caracteres")
      .optional()
      .or(z.literal("")),

    hatoItems: z
      .array(hatoItemSchema)
      .min(1, "Agrega al menos un registro de animales")
      .max(200, "Demasiados registros"),
  });

export type HatoItemValues = z.infer<typeof hatoItemSchema>;
export type HatoGanaderoValues = z.infer<typeof hatoGanaderoSchema>;
