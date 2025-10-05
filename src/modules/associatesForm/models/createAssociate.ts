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
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  fechaSolicitud: string;
  fechaResolucion: string | null;
  motivo: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Ejemplo de payload válido
 */
export const ejemploPayload: CreateSolicitudDto = {
  persona: {
    cedula: "109909999",
    nombre: "Juan",
    apellido1: "Pérez",
    apellido2: "González",
    fechaNacimiento: "1990-05-12",
    telefono: "8765-4321",
    email: "juan@email.com",
    direccion: "San José, 200m norte del parque"
  },
  datosAsociado: {
    viveEnFinca: true,
    marcaGanado: "AR-2025",
    CVO: "CVO-98765"
  },
  datosFinca: {
    nombre: "Finca La Esperanza",
    areaHa: 15.5,
    numeroPlano: "L-32345-2025",
    geografia: {
      provincia: "Guanacaste",
      canton: "Hojancha",
      distrito: "Hojancha",
      caserio: "Monte Romo"
    }
  },
  nucleoFamiliar: {
    nucleoHombres: 2,
    nucleoMujeres: 3
  }
};