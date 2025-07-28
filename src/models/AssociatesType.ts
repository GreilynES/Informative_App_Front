export interface AssociatesFormData {
  // Información Personal
  cedula: string
  nombre: string
  apellidos: string
  fechaNacimiento: string

  // Información de Contacto
  telefono: string
  email: string
  direccion: string
  comunidad: string

  // Información de Asociado
  necesidades: string

  // Documentos
  copiaCedula: File | null
  diagnosticoFinca: File | null
  comprobantePago: File | null
  planoFinca: File | null
  otrosDocumentos: File | null

  // Términos
  acceptTerms: boolean
  receiveInfo: boolean
}

export const initialAssociatesFormData: AssociatesFormData = {
  // Información Personal
    cedula: "",
    nombre: "",
    apellidos: "",
    fechaNacimiento: "",

  // Información de Contacto
  telefono: "",
  email: "",
  direccion: "",
  comunidad: "",

  // Información de Asociado
  necesidades: "",

  // Documentos
  copiaCedula: null,
  diagnosticoFinca: null,
  comprobantePago: null,
  planoFinca: null,
  otrosDocumentos: null,

  // Términos
  acceptTerms: false,
  receiveInfo: false,
}