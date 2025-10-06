// src/modules/associatesForm/models/solicitudTypes.ts

/**
 * DTO para crear una solicitud completa
 * Incluye: persona, datos del asociado, datos de la finca y núcleo familiar (opcional)
 */
export interface CreateSolicitudDto {
  persona: {
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    fechaNacimiento: string; // Formato: "YYYY-MM-DD"
    telefono: string;
    email: string;
    direccion?: string; // Opcional
  };
  
  datosAsociado: {
    viveEnFinca: boolean;
    marcaGanado: string;
    CVO: string;
    // NOTA: distanciaFinca NO se incluye aquí en la creación inicial
    // Se puede actualizar después mediante el endpoint de actualización
  };
  
  datosFinca: {
    nombre: string;
    areaHa: number; // Número decimal, ej: 15.5
    numeroPlano: string;
    geografia: {
      provincia: string;
      canton: string;
      distrito: string;
      caserio: string; // Puede ser string vacío ""
    };
  };
  
  nucleoFamiliar?: { // OPCIONAL
    nucleoHombres: number;
    nucleoMujeres: number;
  };

  propietario?: {
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
  };
}

/**
 * Respuesta del backend al crear una solicitud
 */
export interface SolicitudResponse {
  idSolicitud: number;
  persona: {
    idPersona: number;
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    fechaNacimiento: string;
    telefono: string;
    email: string;
    direccion?: string;
    createdAt: string;
    updatedAt: string;
  };
  asociado: {
    idAsociado: number;
    persona: any; // Referencia a persona
    distanciaFinca: number | null;
    viveEnFinca: boolean;
    marcaGanado: string;
    CVO: string;
    estado: boolean;
    createdAt: string;
    updatedAt: string;
    nucleoFamiliar?: {
      idNucleoFamiliar: number;
      nucleoHombres: number;
      nucleoMujeres: number;
      nucleoTotal: number;
    };
    fincas: Array<{
      idFinca: number;
      idAsociado: number;
      nombre: string;
      areaHa: string;
      numeroPlano: string;
      createdAt: string;
      updatedAt: string;
      idGeografia: number;
    }>;
  };
  propietario?: {
    persona: {
      idPersona: number;
      cedula: string;
      nombre: string;
      apellido1: string;
      apellido2: string;
      fechaNacimiento: string;
      telefono: string;
      email: string;
      direccion?: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  fechaSolicitud: string;
  fechaResolucion: string | null;
  motivo: string | null;
  createdAt: string;
  updatedAt: string;
}
