import { z } from "zod";

export const associateApplySchema = z.object({
  cedula: z.string().min(8).max(12).regex(/^\d+$/, "Solo números"),
  nombre: z.string().min(1).max(30),
  apellido1: z.string().min(1).max(30),
  apellido2: z.string().min(1).max(30),
  fechaNacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD"),
  telefono: z.string().min(8).max(12).regex(/^\d+$/, "Solo números"),
  email: z.string().email(),
  direccion: z.string().max(255).optional().or(z.literal("")),

  distanciaFinca: z.string().regex(/^\d+(\.\d{1,2})?$/).optional().or(z.literal("")),
  viveEnFinca: z.boolean().optional(),
  marcaGanado: z.string().optional().or(z.literal("")),
  CVO: z.string().optional().or(z.literal("")),

  // Solo UI (no se envían)
  acceptTerms: z.boolean().refine((v) => v === true, { message: "Debes aceptar los términos" }),
  receiveInfo: z.boolean().optional(),

  // Archivos solo UI
  idCopy: z.any().nullable().optional(),
  farmDiagnosis: z.any().nullable().optional(),
  farmMap: z.any().nullable().optional(),
  otherDocuments: z.any().nullable().optional(),
});

export type AssociateApplyValues = z.infer<typeof associateApplySchema>;
