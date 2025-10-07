export interface CreateHatoDto {
    idFinca: number;
    tipoExplotacion: string;
    totalGanado: number;
    razaPredominante?: string;
  }
  
  export interface CreateAnimalDto {
    idHato: number;
    tipoAnimal: string;
    edadAnios: number;
    cantidad: number;
  }
  
  export interface Hato {
    idHato: number;
    tipoExplotacion: string;
    totalGanado: number;
    razaPredominante?: string;
    idFinca: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Animal {
    idAnimal: number;
    tipoAnimal: string;
    edadAnios: number;
    cantidad: number;
    idHato: number;
    createdAt: string;
    updatedAt: string;
  }