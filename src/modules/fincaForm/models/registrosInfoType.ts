export interface RegistrosProductivosData {
    idRegistrosProductivos?: number;
    reproductivos: boolean;
    costosProductivos: boolean;
    idFinca?: number;
  }
  
  export interface CreateRegistrosProductivosDto {
    idFinca: number;
    reproductivos: boolean;
    costosProductivos: boolean;
  }
  
  export interface UpdateRegistrosProductivosDto {
    reproductivos?: boolean;
    costosProductivos?: boolean;
  }
  