export interface CreateAssociatePayload 
{
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

export type CreatePersonaPayload = {
  cedula: string;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  fechaNacimiento: string; // ISO yyyy-mm-dd (o ISO datetime si así lo guardas)
  telefono: string;
  email: string;
  direccion?: string;
};

export type CreateAsociadoPayload = {
  distanciaFinca?: number;
  viveEnFinca?: boolean;
  marcaGanado?: string;
  CVO?: string;
};

