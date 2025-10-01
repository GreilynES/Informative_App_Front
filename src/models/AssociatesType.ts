// // Zod + tipos del formulario público (informativo)
// // OJO: Este schema está alineado al DTO del backend (associate.create)

// import { z } from "zod";

// // Reglas útiles
// const onlyDigits = z
//   .string()
//   .trim()
//   .regex(/^\d+$/, "Solo números");

// export const AssociateFormSchema = z.object({
//   // Paso 1 — Identidad
//   idNumber: onlyDigits.min(8, "Mínimo 8 dígitos").max(12, "Máximo 12 dígitos"),
//   name: z.string().trim().min(1, "Requerido").max(30),
//   lastName1: z.string().trim().min(1, "Requerido").max(30),
//   lastName2: z.string().trim().min(1, "Requerido").max(30),
//   birthDate: z
//     .string()
//     .trim()
//     .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD"),

//   // Paso 2 — Contacto
//   phone: onlyDigits.min(8, "Mínimo 8 dígitos").max(12, "Máximo 12 dígitos"),
//   email: z.string().trim().email("Correo inválido").max(100),
//   address: z.string().trim().max(255).optional().or(z.literal("")), // opcional
//   community: z.string().trim().max(80).optional().or(z.literal("")), // Solo UI; no se envía

//   // Paso 3 — Finca / Ganado
//   viveEnFinca: z.boolean(), // requerido por backend
//   distanciaFinca: z
//     .string()
//     .trim()
//     .regex(/^\d+(\.\d{1,2})?$/, "Formato 99.99")
//     .optional()
//     .or(z.literal("")),
//   marcaGanado: z.string().trim().max(100).optional().or(z.literal("")),
//   CVO: z.string().trim().max(100).optional().or(z.literal("")),

//   // Paso 5 — Términos (solo UI)
//   acceptTerms: z.literal(true, {
//     errorMap: () => ({ message: "Debes aceptar los términos" }),
//   }),
//   receiveInfo: z.boolean().optional(), // No se envía; solo preferencia UI
// });

// export type AssociateFormValues = z.infer<typeof AssociateFormSchema>;

// export const initialAssociateFormValues: AssociateFormValues = {
//   // Identidad
//   idNumber: "",
//   name: "",
//   lastName1: "",
//   lastName2: "",
//   birthDate: "",

//   // Contacto
//   phone: "",
//   email: "",
//   address: "",
//   community: "",

//   // Finca / Ganado
//   viveEnFinca: false,
//   distanciaFinca: "",
//   marcaGanado: "",
//   CVO: "",

//   // Términos
//   acceptTerms: false,
//   receiveInfo: false,
// };
