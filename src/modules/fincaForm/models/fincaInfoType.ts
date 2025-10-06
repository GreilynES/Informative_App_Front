// Tipo para crear una geografía
export interface CreateGeografiaDto {
    provincia: string;
    canton: string;
    distrito: string;
    caserio: string;
  }
  
  // Tipo para crear un propietario
  export interface CreatePropietarioDto {
    persona: {
      cedula: string;
      nombre: string;
      apellido1: string;
      apellido2: string;
      fechaNacimiento?: string;
      telefono: string;
      email: string;
      direccion?: string;
    };
  }
  
  // Tipo para crear una finca
  export interface CreateFincaDto {
    idAsociado: number;
    nombre: string;
    areaHa: number;
    numeroPlano: string;
    idGeografia?: number;
    idPropietario?: number;
  }
  
  // Tipo completo para el payload del formulario
  export interface FincaFormPayload {
    // Datos básicos
    nombreFinca: string;
    areaHa: string;
    numeroPlano: string;
    
    // Geografía
    provincia: string;
    canton: string;
    distrito: string;
    caserio: string;
    
    // Propietario
    esPropietario: boolean;
    propietarioCedula?: string;
    propietarioNombre?: string;
    propietarioApellido1?: string;
    propietarioApellido2?: string;
    propietarioTelefono?: string;
    propietarioEmail?: string;
    propietarioFechaNacimiento?: string;
    propietarioDireccion?: string;
  }
  
  // Respuestas de la API
  export interface Geografia {
    idGeografia: number;
    provincia: string;
    canton: string;
    distrito: string;
    caserio: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Propietario {
    idPropietario: number;
    persona: {
      idPersona: number;
      cedula: string;
      nombre: string;
      apellido1: string;
      apellido2: string;
      fechaNacimiento?: string;
      telefono: string;
      email: string;
      direccion?: string;
    };
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Finca {
    idFinca: number;
    idAsociado: number;
    nombre: string;
    areaHa: number;
    numeroPlano: string;
    idGeografia?: number;
    idPropietario?: number;
    geografia?: Geografia;
    propietario?: Propietario;
    createdAt: string;
    updatedAt: string;
  }

  export interface Persona {
    idPersona: number;
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    fechaNacimiento?: string;
    telefono: string;
    email: string;
    direccion?: string;
  }