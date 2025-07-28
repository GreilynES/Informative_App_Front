export type VolunteerFormData = {
   cedula: string
  nombre: string
  apellidos: string
  fechaNacimiento: string

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
  cedula: "",
    nombre: "",
    apellidos: "",
    fechaNacimiento: "",
    
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