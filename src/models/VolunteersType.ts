export type VolunteerFormData = {
    idNumber: string
  name: string
  lastName1: string
  lastName2: string
  birthDate: string

    phone: string
  email: string
  address: string
  community: string


  volunteeringType: string
  availability: string
  previousExperience: string
  motivation: string
  acceptTerms: boolean
  receiveInfo: boolean
}

export const initialVolunteerFormData: VolunteerFormData = {
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
}