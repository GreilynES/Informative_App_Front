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
    nacionalidad: "",
    disponibilidades: [],
    areasInteres: [],
  });

  const [files, setFiles] = useState<{
    cv?: File | null;
    cedula?: File | null;
    carta?: File | null;
  }>({
    cv: null,
    cedula: null,
    carta: null,
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    if (SKIP_VALIDATION_INDIVIDUAL && tipoSolicitante === 'INDIVIDUAL') return true;

    // ✅ Validación para INDIVIDUAL
    if (tipoSolicitante === 'INDIVIDUAL') {
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
          return true; // Disponibilidad es opcional
        case 3:
          return true; // Motivación es opcional
        case 4: // ✅ Paso de documentos
          return !!files.cv && !!files.cedula;
        default:
          return true;
      }
    }

    // ✅ Validación para ORGANIZACION
    if (tipoSolicitante === 'ORGANIZACION') {
      switch (step) {
        case 1:
          return true; // Se valida en el form de TanStack
        case 2:
          return true; // Disponibilidad es opcional
        case 3: // ✅ Paso de documentos para organización
          return !!files.cedula; // Solo documento legal obligatorio
        case 4:
          return true; // Confirmación
        default:
          return true;
      }
    }

    return true;
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
    files,
    setFiles,
  };
}