import type { VolunteersFormData } from "@/modules/volunteersInformation/models/VolunteersType"
import { StepPersonalInformation } from "./stepPersonalInformation"
import { lookupPersonaByCedula } from "../../services/volunteerFormService" 

export function Step1Individual(props: {
  formData: VolunteersFormData
  handleInputChange: (field: string, value: any) => void
  isStepValid: () => boolean
  lookup: (id: string) => Promise<any> 
  onNext: () => void
}) {
  const { formData, handleInputChange, isStepValid, lookup, onNext } = props

  const lookupCombined = async (id: string) => {
  const ced = (id ?? "").trim()
  if (!ced) return null

  const db = await lookupPersonaByCedula(ced)

  // Caso 1: backend devuelve PersonaFormLookupDto (nuevo)
  if (db?.found) {
    console.log("[lookupCombined] usando DB (DTO)")
    return {
      source: "DB",
      ...(db.legacy ?? {}),
      volunteerIndividual: db.volunteerIndividual,
      persona: db.persona,
    }
  }

  // Caso 2: backend devuelve Persona entity (lo que te está pasando ahora)
  if (db?.cedula && db?.nombre && db?.apellido1) {
    console.log("[lookupCombined] usando DB (ENTITY)")
    return {
      source: "DB",
      firstname: db.nombre ?? "",
      lastname1: db.apellido1 ?? "",
      lastname2: db.apellido2 ?? "",
      volunteerIndividual: {
        idNumber: db.cedula ?? "",
        name: db.nombre ?? "",
        lastName1: db.apellido1 ?? "",
        lastName2: db.apellido2 ?? "",
        phone: db.telefono ?? "",
        email: db.email ?? "",
        birthDate: db.fechaNacimiento ?? "",
        address: db.direccion ?? "",
      },
      persona: db,
    }
  }

  const tse = await lookup(ced)
  return tse ? { source: "TSE", ...tse } : null
}


  return (
    <StepPersonalInformation
      formData={formData}
      handleInputChange={handleInputChange as any}
      onNextCombined={onNext}
      isStepValid={isStepValid}
      lookup={lookupCombined} 
    />
  )
}
