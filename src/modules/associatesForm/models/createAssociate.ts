// src/modules/associatesForm/models/createAssociate.ts

/**
 * DTO para crear una solicitud completa
 */
export interface CreateSolicitudDto {
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
  
  datosAsociado: {
    viveEnFinca: boolean;
    marcaGanado: string;
    CVO: string;
  };
  
  datosFinca: {
    nombre: string;
    areaHa: number;
    numeroPlano: string;
    geografia: {
      provincia: string;
      canton: string;
      distrito: string;
      caserio: string;
    };
  };
  
  nucleoFamiliar?: {
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

  hato?: {
    idFinca: number;
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

  // ========== NUEVOS CAMPOS ==========
  actividadesInfraestructura?: {
    cultivos: string[];
    aparatos: number;
    bebederos: number;
    saleros: number;
  };

  caracteristicasFisicas?: {
    tiposCerca: string[];
    equipos: string[];
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
    persona: any;
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
      actividadesInfraestructura?: {
        cultivos: string[];
        aparatos: number;
        bebederos: number;
        saleros: number;
      };
      caracteristicasFisicas?: {
        tiposCerca: string[];
        equipos: string[];
      };
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
  nombre: string;
}