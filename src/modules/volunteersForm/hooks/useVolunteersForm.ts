// src/modules/volunteersForm/hooks/useVolunteersForm.ts

import { useState } from "react";
import type { VolunteersFormData } from "../../volunteersInformation/models/VolunteersType";

const SKIP_VALIDATION_INDIVIDUAL = true;

export function useVolunteersForm() {
  const [step, setStep] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [tipoSolicitante, setTipoSolicitante] = useState<'INDIVIDUAL' | 'ORGANIZACION'>('INDIVIDUAL');

  const [formData, setFormData] = useState<VolunteersFormData>({
    name: "",
    lastName1: "",
    lastName2: "",
    idNumber: "",
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
    nacionalidad: "", // ✅ NUEVO CAMPO
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleInputChange = (
    field: keyof VolunteersFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    if (SKIP_VALIDATION_INDIVIDUAL) return true;

    switch (step) {
      case 1:
        return (
          formData.name.trim() !== "" &&
          formData.lastName1.trim() !== "" &&
          formData.lastName2.trim() !== "" &&
          formData.idNumber.trim() !== "" &&
          formData.birthDate.trim() !== "" &&
          formData.phone.trim() !== "" &&
          formData.email.trim() !== ""
        );
      case 2:
        return (
          formData.volunteeringType.trim() !== "" &&
          formData.availability.trim() !== "" &&
          formData.acceptTerms
        );
      default:
        return true;
    }
  };

  return {
    formData,
    setFormData,
    step,
    nextStep,
    prevStep,
    showForm,
    setShowForm,
    tipoSolicitante,
    setTipoSolicitante,
    handleInputChange,
    isStepValid,
  };
}