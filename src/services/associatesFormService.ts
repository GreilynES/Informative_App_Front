import apiConfig from "../apiConfig";

export interface CreateAssociatePayload {
  cedula: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  fechaNacimiento: string; // "YYYY-MM-DD" o ISO si tu back lo transforma
  telefono: string;
  email: string;
  direccion?: string;
  distanciaFinca?: number;   // DECIMAL -> número
  viveEnFinca?: boolean;
  marcaGanado?: string;
  CVO?: string;
}

export async function createAssociate(payload: CreateAssociatePayload) {
  try {
    const { data } = await apiConfig.post("/associates", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (err: any) {
    console.error("POST /associates failed:", err?.response?.data ?? err);
    throw err;
  }
}
