// src/modules/volunteersInformation/models/VolunteersType.ts

export type VolunteersFormData = {
  idNumber: string;
  name: string;
  lastName1: string;
  lastName2: string;
  birthDate: string;

  phone: string;
  email: string;
  address: string;
  community: string;

  volunteeringType: string;
  availability: string;
  previousExperience: string;
  motivation: string;
  acceptTerms: boolean;
  receiveInfo: boolean;
  
  nacionalidad?: string;
  
  // ✅ NUEVOS CAMPOS PARA PASO 3
  disponibilidades?: Array<{
    fechaInicio: string;
    fechaFin: string;
    dias: string[];
    horarios: string[];
  }>;
  areasInteres?: Array<{ nombreArea: string }>;
}

export type Form = any;

export const initialVolunteersFormData: VolunteersFormData = {
  idNumber: "",
  name: "",
  lastName1: "",
  lastName2: "",
  birthDate: "",
    
  phone: "",
  email: "",
  address: "",
  community: "",

  volunteeringType: "",
  availability: "",
  previousExperience: "",
  motivation: "",
  acceptTerms: false,
  receiveInfo: false,
  
  nacionalidad: "",
  disponibilidades: [],
  areasInteres: [],
}