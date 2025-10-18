// src/modules/volunteersForm/models/createVolunteer.ts

export interface CreateSolicitudVoluntarioDto {
  tipoSolicitante: 'ORGANIZACION' | 'INDIVIDUAL';
  
  // ========== Datos de ORGANIZACIÓN ==========
  organizacion?: {
    cedulaJuridica: string;
    nombre: string;
    numeroVoluntarios: number;
    direccion: string;
    telefono: string;
    email: string;
    tipoOrganizacion: string;
  };

  representantes?: Array<{
    persona: {
      cedula: string;
      nombre: string;
      apellido1: string;
      apellido2: string;
      telefono: string;
      email: string;
      fechaNacimiento?: string;
      direccion?: string;
    };
    cargo: string;
  }>;
  
  razonesSociales?: Array<{
    razonSocial: string;
  }>;

  // ========== Datos de INDIVIDUAL ==========
  voluntario?: {
    persona: {
      cedula: string;
      nombre: string;
      apellido1: string;
      apellido2: string;
      fechaNacimiento: string;
      telefono: string;
      email: string;
      direccion?: string;
    };
    motivacion: string;
    habilidades: string;
    experiencia: string;
    nacionalidad: string;
  };

  // ========== Campos compartidos (nivel raíz) ==========
  disponibilidades?: Array<{
    fechaInicio: string;
    fechaFin: string;
    dias: string[];
    horarios: string[];
  }>;
  
  areasInteres?: Array<{
    nombreArea: string;
  }>;
}

export interface SolicitudVoluntarioResponse {
  idSolicitud: number;
  tipoSolicitante: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  fechaSolicitud: string;
  organizacion?: any;
  voluntario?: any;
  disponibilidades?: any[];
  areasInteres?: any[];
}