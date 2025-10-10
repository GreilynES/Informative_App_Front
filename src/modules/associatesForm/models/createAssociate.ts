// src/modules/associatesForm/models/createAssociate.ts

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

  // ========== NUEVOS CAMPOS OPCIONALES ==========
  
  hato?: {
    idFinca: number; // Placeholder, el backend lo ignora en la transacción
    tipoExplotacion: string;
    totalGanado: number;
    razaPredominante?: string;
  };

  animales?: Array<{
    tipoAnimal: string;
    edadAnios: number;
    cantidad: number;
  }>;

  forrajes?: Array<{
    tipoForraje: string;
    variedad: string;
    hectareas: number;
    utilizacion: string;
  }>;

  registrosProductivos?: {
    reproductivos: boolean;
    costosProductivos: boolean;
  };

  fuentesAgua?: CreateFuenteAguaDto[];
  metodosRiego?: CreateMetodoRiegoDto[];

    actividadesAgropecuarias?: Array<{ idActividad: number; nombre: string }>;
      equiposEstandar?: Array<{ idFincaEquipo: number; idEquipo: number; cantidad: number }>;
      otrosEquipos?: Array<{ id: number; nombreEquipo: string; cantidad: number }>;
      tiposCerca?: Array<{ idTipoCerca: number; viva: boolean; electrica: boolean; pMuerto: boolean }>;

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
      hato?: {
        idHato: number;
        tipoExplotacion: string;
        totalGanado: number;
        razaPredominante?: string;
        animales?: Array<{
          idAnimal: number;
          tipoAnimal: string;
          edadAnios: number;
          cantidad: number;
        }>;
      };
      forrajes?: Array<{
        idForraje: number;
        tipoForraje: string;
        variedad: string;
        hectareas: number;
        utilizacion: string;
      }>;
      registrosProductivos?: {
        idRegistrosProductivos: number;
        reproductivos: boolean;
        costosProductivos: boolean;
      };
      fuentesAgua?: CreateFuenteAguaDto[];
      metodosRiego?: CreateMetodoRiegoDto[];
      // ===== NUEVAS SECCIONES OPCIONALES =====

// Equipos estándar (del catálogo) para la finca principal creada en la solicitud
equiposEstandar?: Array<{
  idEquipo: number;   // del catálogo /equipos
  cantidad: number;
}>;

// Otros equipos (libres) para esa finca
otrosEquipos?: Array<{
  nombreEquipo: string; // texto libre (validado en back)
  cantidad: number;
}>;

// Tipos de cerca (pueden venir varias combinaciones; el back deduplica)
tiposCerca?: Array<{
  viva: boolean;
  electrica: boolean;
  pMuerto: boolean;
}>;

// Actividades agropecuarias (libres pero deduplicadas por finca en back)
actividadesAgropecuarias?: Array<{
  nombre: string;
}>;

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

export interface CreateFuenteAguaDto {
  nombre: string;
}

export interface CreateMetodoRiegoDto {
  tipo: string;
}

export interface CreateActividadDto {
  idFinca: number;        // lo rellena el backend en la transacción
  nombre: string;         // p.ej. "Maíz", "Café"
}

export interface CreateInfraestructuraProduccionDto {
  idFinca: number;        // lo rellena el backend en la transacción
  numeroAparatos: number; // "Aparatos" (del boceto)
  numeroBebederos: number; // "Abrevaderos"
  numeroSaleros: number;  // "Saladeros"
}

export interface CreateOtroEquipoDto {
  idFinca: number;
  nombreEquipo: string;
  cantidad: number;
}

export interface CreateTipoCercaDto {
  viva: boolean;
  electrica: boolean;
  pMuerto: boolean; // poste muerto
}

export interface CreateFincaEquipoDto {
  idFinca: number;
  idEquipo: number;   // del catálogo
  cantidad: number;
}

