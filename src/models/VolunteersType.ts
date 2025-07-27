export type VolunteerFormData = {
  nombre: string
  apellidos: string
  cedula: string
  edad: string
  telefono: string
  email: string
  direccion: string
  comunidad: string
  tipoVoluntariado: string
  disponibilidad: string
  experienciaPrevia: string
  motivacion: string
  acceptTerms: boolean
  receiveInfo: boolean
}

export const initialVolunteerFormData: VolunteerFormData = {
  nombre: "",
  apellidos: "",
  cedula: "",
  edad: "",
  telefono: "",
  email: "",
  direccion: "",
  comunidad: "",
  tipoVoluntariado: "",
  disponibilidad: "",
  experienciaPrevia: "",
  motivacion: "",
  acceptTerms: false,
  receiveInfo: false,
}