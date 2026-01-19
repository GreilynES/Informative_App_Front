
import { useCallback, useMemo, useState } from "react";
import type { VolunteersFormData } from "../../volunteersInformation/models/VolunteersType";

const SKIP_VALIDATION_INDIVIDUAL = true;

export function useVolunteersForm() {
  const [step, setStep] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [tipoSolicitante, setTipoSolicitante] = useState<"INDIVIDUAL" | "ORGANIZACION">(
    "INDIVIDUAL"
  );

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

  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);
  const prevStep = useCallback(() => setStep((prev) => Math.max(prev - 1, 1)), []);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const canProceed = useMemo(() => {
    if (SKIP_VALIDATION_INDIVIDUAL && tipoSolicitante === "INDIVIDUAL") return true;

    if (tipoSolicitante === "INDIVIDUAL") {
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
          return true; // Disponibilidad opcional
        case 3:
          return true; // Motivación opcional
        case 4:
          return !!files.cv && !!files.cedula; // Documentos
        default:
          return true;
      }
    }

    if (tipoSolicitante === "ORGANIZACION") {
      switch (step) {
        case 1:
          return true; // Se valida en el form de TanStack
        case 2:
          return true; // Disponibilidad opcional
        case 3:
          return !!files.cedula; // Documento legal obligatorio
        case 4:
          return true; // Confirmación
        default:
          return true;
      }
    }

    return true;
  }, [tipoSolicitante, step, formData, files]);

 const resetToFirstStep = useCallback(() => {
  setStep(1);
}, []);
  const isStepValid = useCallback(() => canProceed, [canProceed]);

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
    canProceed,
    resetToFirstStep,
    isStepValid,
    files,
    setFiles,
  };
}
