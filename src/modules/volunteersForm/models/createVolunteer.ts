// src/modules/volunteersForm/models/createVolunteer.ts

export interface CreateSolicitudVoluntarioDto {
  tipoSolicitante: 'ORGANIZACION' | 'INDIVIDUAL';
  
  // Datos de la organización
  organizacion?: {
    cedulaJuridica: string;
    nombre: string;
    numeroVoluntarios: number;
    direccion: string;
    telefono: string;
    email: string;
    tipoOrganizacion: string;
    
    // ✅ CORRECCIÓN: Array de representantes (no objeto único)
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
    
    // Arrays opcionales
    razonesSociales?: Array<{
      razonSocial: string;
    }>;
    
    disponibilidades?: Array<{
      fechaInicio: string;
      fechaFin: string;
      dias: string[];
      horario: string;
    }>;
    
    areasInteres?: Array<{
      nombreArea: string;
    }>;
  };
}


export interface SolicitudVoluntarioResponse {
  idSolicitud: number;
  tipoSolicitante: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  fechaSolicitud: string;
  organizacion?: any;
  // ... resto de campos
}