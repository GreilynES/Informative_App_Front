export interface ForrajeItem {
    id?: number;
    idForraje?: number;
    tipoForraje: string;
    variedad: string;
    hectareas: number;
    utilizacion?: string;
  }
  
  export interface CreateForrajeDto {
    idFinca: number;
    tipoForraje: string;
    variedad: string;
    hectareas: number;
    utilizacion?: string;
  }