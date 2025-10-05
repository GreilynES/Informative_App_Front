import { z } from "zod";
import { fincaCompleteSchema } from "../../fincaForm/schema/fincaSchema";

// Schema de persona
const personaSchema = z.object({
  cedula: z.string().min(8, "Cédula debe tener al menos 8 caracteres"),
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido1: z.string().min(1, "El primer apellido es requerido"),
  apellido2: z.string().min(1, "El segundo apellido es requerido"),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es requerida"),
  telefono: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  email: z.string().email("Email inválido"),
  direccion: z.string().optional().or(z.literal("")),
});

// Schema de datos del asociado
const datosAsociadoSchema = z.object({
  distanciaFinca: z.string().min(1, "La distancia es requerida"),
  viveEnFinca: z.boolean().default(false),
  marcaGanado: z.string().min(1, "La marca de ganado es requerida"),
  CVO: z.string().min(1, "El CVO es requerido"),
});

// Schema de núcleo familiar (NUEVO - OPCIONAL)
const nucleoFamiliarSchema = z.object({
  nucleoHombres: z.string().optional().or(z.literal("")),
  nucleoMujeres: z.string().optional().or(z.literal("")),
});

// Schema de documentos
const documentosSchema = z.object({
  acceptTerms: z.boolean(),
  receiveInfo: z.boolean().default(false),
  idCopy: z.any().nullable(),
  farmDiagnosis: z.any().nullable(),
  farmMap: z.any().nullable(),
  otherDocuments: z.any().nullable(),
});

// Schema completo que combina todo
export const associateApplySchema = z.object({
  ...personaSchema.shape,
  ...datosAsociadoSchema.shape,
  ...nucleoFamiliarSchema.shape, // NUEVO: campos de núcleo familiar
  ...documentosSchema.shape,
  ...fincaCompleteSchema.shape,
});

export type AssociateApplyValues = z.infer<typeof associateApplySchema>;