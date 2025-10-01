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