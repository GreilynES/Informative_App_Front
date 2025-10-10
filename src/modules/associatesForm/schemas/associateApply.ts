import { z } from "zod";
import { fincaCompleteSchema } from "../../fincaForm/schema/fincaSchema";

/* ────────────────────────────────────────────────────────────────────────────
   PERSONA
──────────────────────────────────────────────────────────────────────────── */
const personaSchema = z.object({
  cedula: z.string().min(8, "Cédula debe tener al menos 8 caracteres"),
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido1: z.string().min(1, "El primer apellido es requerido"),
  apellido2: z.string().min(1, "El segundo apellido es requerido"),
  fechaNacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es requerida, no puede ser una fecha posterior a la actual"),
  telefono: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  email: z.string().email("Email inválido"),
  direccion: z.string().optional().or(z.literal("")),
});

/* ────────────────────────────────────────────────────────────────────────────
   DATOS ASOCIADO
──────────────────────────────────────────────────────────────────────────── */
const datosAsociadoSchema = z.object({
  distanciaFinca: z.string().min(1, "La distancia es requerida"),
  viveEnFinca: z.boolean().default(false),
  marcaGanado: z.string().min(1, "La marca de ganado es requerida"),
  CVO: z.string().min(1, "El CVO es requerido"),
});

/* ────────────────────────────────────────────────────────────────────────────
   NÚCLEO FAMILIAR (opcional)
──────────────────────────────────────────────────────────────────────────── */
const nucleoFamiliarSchema = z.object({
  nucleoHombres: z.string().optional().or(z.literal("")),
  nucleoMujeres: z.string().optional().or(z.literal("")),
});

/* ────────────────────────────────────────────────────────────────────────────
   DOCUMENTOS
──────────────────────────────────────────────────────────────────────────── */
const documentosSchema = z.object({
  acceptTerms: z.boolean(),
  receiveInfo: z.boolean().default(false),
  idCopy: z.any().nullable(),
  farmDiagnosis: z.any().nullable(),
  farmMap: z.any().nullable(),
  otherDocuments: z.any().nullable(),
});

/* ────────────────────────────────────────────────────────────────────────────
   PROPIETARIO (condicional)
──────────────────────────────────────────────────────────────────────────── */
const propietarioConditionalSchema = z.object({
  esPropietario: z.boolean().default(true),
  propietarioCedula: z.string().optional().or(z.literal("")),
  propietarioNombre: z.string().optional().or(z.literal("")),
  propietarioApellido1: z.string().optional().or(z.literal("")),
  propietarioApellido2: z.string().optional().or(z.literal("")),
  propietarioTelefono: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || val === "" || val.length >= 8, {
      message: "El teléfono debe tener al menos 8 dígitos",
    }),
  propietarioEmail: z.string().optional().or(z.literal("")),
  propietarioDireccion: z.string().optional().or(z.literal("")),
  propietarioFechaNacimiento: z.string().optional().or(z.literal("")),
});

/* ────────────────────────────────────────────────────────────────────────────
   ACTIVIDADES / INFRAESTRUCTURA 
──────────────────────────────────────────────────────────────────────────── */
export const actividadCultivoSchema = z
  .string()
  .min(1, "La actividad es requerida")
  .max(75, "Máximo 75 caracteres")
  .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, "Solo se permiten letras y espacios");

export const actividadesInfraestructuraSchema = z.object({
  cultivos: z.array(actividadCultivoSchema).default([]),
  aparatos: z.number().int().nonnegative().optional(),
  bebederos: z.number().int().nonnegative().optional(),
  saleros: z.number().int().nonnegative().optional(),
});

export const viasAccesoSchema = z.object({
  /** Lista de vías (p.ej. "Externas", "Internas" o “Otras…”) */
  accesos: z.array(z.string().min(1, "Texto vacío")).default([]),
});

export const comercializacionSchema = z.object({
  /** Lista de canales (p.ej. "Subastas", "Carnicerías", etc.) */
  canales: z.array(z.string().min(1, "Texto vacío")).default([]),
});

export const necesidadesObservacionesSchema = z.object({
  /**
   * 5 casillas de necesidad/mejora (strings ≤ 255).
   * Regla del paso exige: al menos UNA con texto no vacío.
   */
  necesidades: z
    .array(z.string().max(255, "Máximo 255 caracteres"))
    .length(5, "Debes mantener 5 casillas")
    .default(["", "", "", "", ""]),
  /** Campo libre opcional (≤ 500) */
  observaciones: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  /** Campo libre opcional (≤ 255) */
  interes: z.string().max(255, "Máximo 255 caracteres").optional().or(z.literal("")),
});

/* ────────────────────────────────────────────────────────────────────────────
CARACTERÍSTICAS FÍSICAS Y EQUIPOS 
──────────────────────────────────────────────────────────────────────────── */
export const otroCercaSchema = z
  .string()
  .min(1, "El tipo de cerca es requerido")
  .max(75, "Máximo 75 caracteres")
  .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, "Solo se permiten letras y espacios");

export const otroEquipoSchema = z
  .string()
  .min(1, "El nombre del equipo es requerido")
  .max(75, "Máximo 75 caracteres")
  .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, "Solo se permiten letras y espacios");

/** Estructura que guardas en el form para este paso */
export const caracteristicasFisicasSchema = z.object({
  tiposCerca: z.array(z.string()).default([]),
  equipos: z.array(z.string()).default([]),
});

/* ────────────────────────────────────────────────────────────────────────────
   SCHEMA COMPLETO
──────────────────────────────────────────────────────────────────────────── */
export const associateApplySchema = z.object({
  ...personaSchema.shape,
  ...datosAsociadoSchema.shape,
  ...nucleoFamiliarSchema.shape,
  ...documentosSchema.shape,
  ...fincaCompleteSchema.shape,
  ...propietarioConditionalSchema.shape,

  // Paso 7
  actividadesInfraestructura: actividadesInfraestructuraSchema.optional(),

  // Paso 8 (nuevo)
  caracteristicasFisicas: caracteristicasFisicasSchema.optional(),

  
});

export type ViasAcceso = z.infer<typeof viasAccesoSchema>;
export type Comercializacion = z.infer<typeof comercializacionSchema>;
export type NecesidadesObservaciones = z.infer<typeof necesidadesObservacionesSchema>;
export type AssociateApplyValues = z.infer<typeof associateApplySchema>;

export const otraInfraestructuraSchema = z
  .string()
  .min(1, "La infraestructura es requerida")
  .max(75, "Máximo 75 caracteres")
  .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/, "Solo se permiten letras y espacios");

export const infraestructuraDisponibleSchema = z.object({
  infraestructuras: z.array(z.string()).default([]),
  corrienteElectrica: z.object({
    publica: z.boolean().default(false),
    privada: z.boolean().default(false),
  }),
});

/* ────────────────────────────────────────────────────────────────────────────
   FORRAJE 
──────────────────────────────────────────────────────────────────────────── */
export const forrajeSchema = z.object({
  tipoForraje: z.string().min(1, "El tipo de forraje es requerido"),
  variedad: z
    .string()
    .min(3, "La variedad es requerida (mínimo 3 caracteres)")
    .max(100, "Máximo 100 caracteres"),
  hectareas: z
    .number()
    .refine((val) => !isNaN(val), { message: "Debe ser un número válido" })
    .positive("Las hectáreas deben ser mayores a 0")
    .max(9999, "Cantidad demasiado alta"),
  utilizacion: z
    .string()
    .min(3, "La utilización es requerida (mínimo 3 caracteres)")
    .max(150, "Máximo 150 caracteres"),
});

export type ForrajeValues = z.infer<typeof forrajeSchema>;

export const forrajeListSchema = z
  .array(forrajeSchema)
  .min(1, "Debe registrar al menos un tipo de forraje")
  .max(10, "Se pueden registrar hasta 10 tipos de forraje");

export const forrajeItemSchema = z.object({
    tipoForraje: z.string().nonempty("Campo obligatorio"),
    variedad: z.string().nonempty("Campo obligatorio"),
    hectareas: z
      .number()
      .gt(0, "Debe ser mayor a 0"),
    utilizacion: z.string().nonempty("Campo obligatorio"),
  });