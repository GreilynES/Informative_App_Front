export interface AssociatesFormData {
   // Personal Information
  idNumber: string
  name: string
  lastName1: string
  lastName2: string
  birthDate: string

  // Contact Information
  phone: string
  email: string
  address: string
  community: string

  // Associate Information
  needs: string

  // Documents
  idCopy: File | null
  farmDiagnosis: File | null
  paymentProof: File | null
  farmMap: File | null
  otherDocuments: File | null

  // Terms
  acceptTerms: boolean
  receiveInfo: boolean
}

export const initialAssociatesFormData: AssociatesFormData = {
  // Personal Information
  idNumber: "",
  name: "",
  lastName1: "",
  lastName2: "",
  birthDate: "",

  // Contact Information
  phone: "",
  email: "",
  address: "",
  community: "",

  // Associate Information
  needs: "",

  // Documents
  idCopy: null,
  farmDiagnosis: null,
  paymentProof: null,
  farmMap: null,
  otherDocuments: null,

  // Terms
  acceptTerms: false,
  receiveInfo: false,
}