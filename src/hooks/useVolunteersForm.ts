import { useState } from "react"
import { initialVolunteersFormData, type VolunteersFormData } from "../models/VolunteersType"

export function useVolunteersForm() {
  const [formData, setFormData] = useState<VolunteersFormData>(initialVolunteersFormData)
  const [showForm, setShowForm] = useState(false)
  const [step, setStep] = useState(1)

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => Math.max(1, prev - 1))

  const handleInputChange = (field: keyof VolunteersFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isStepValid = () => {
    if (step === 1) {
      return (
        formData.idNumber.trim() !== "" &&
        formData.name.trim() !== "" &&
        formData.lastName1.trim() !== "" &&
        formData.lastName2.trim() !== "" &&
        formData.birthDate.trim() !== ""
      )
    }
    if (step === 2) {
      return (
        formData.phone.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.community.trim() !== ""
      )
    }
    return true // pasos 3–5 no son obligatorios para avanzar
  }

  return {
    formData,
    setFormData,
    step,
    nextStep,
    prevStep,
    showForm,
    setShowForm,
    handleInputChange,
    isStepValid,
  }
}
