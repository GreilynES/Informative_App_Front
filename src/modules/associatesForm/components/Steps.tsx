import type { FormLike } from "../../../shared/types/form-lite";
import { ZodError } from "zod"; 
import { useState, useEffect } from "react";
import { associateApplySchema } from "../schemas/associateApply";
import { Step1 } from "../steps/stepPersonalInformation";
import { Step2 } from "../steps/stepFincaGeoPropi";
import { Step3 } from "../steps/stepForrajeRegisto";

import { Step5 } from "../steps/stepDocumentsUpload";
import { Step6 } from "../steps/stepConfirmation";
import { Step4 } from "../steps/stepActividadessCaracteristicas";

interface StepsProps {
  step: number;
  form: FormLike;
  lookup: (id: string) => Promise<any>;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting?: boolean;
}

export function Steps({ step, form, lookup, nextStep, prevStep, isSubmitting }: StepsProps) {
  const [canProceed, setCanProceed] = useState(false);

  const validateField = (name: string, value: any) => {
    try {
      const fieldSchema = (associateApplySchema.shape as any)[name];
      if (fieldSchema) {
        fieldSchema.parse(value);
      }
      return undefined;
    } catch (error) {
      if (error instanceof ZodError) {
        return error.issues[0]?.message || "Error de validación";
      }
      return "Error de validación";
    }
  };

  const checkStepValidity = () => {
    const values = (form as any).state.values;
  
    switch (step) {
      case 1: {
        const step1Valid = 
          values.cedula && values.cedula.length >= 8 &&
          values.nombre && values.nombre.length >= 1 &&
          values.apellido1 && values.apellido1.length >= 1 &&
          values.apellido2 && values.apellido2.length >= 1 &&
          values.fechaNacimiento && values.fechaNacimiento.length > 0 &&
          values.telefono && values.telefono.length >= 8 &&
          values.email && values.email.length >= 1 &&
          values.distanciaFinca && values.distanciaFinca.length >= 1 &&
          values.marcaGanado && values.marcaGanado.length >= 1 &&
          values.CVO && values.CVO.length >= 1;
        
        if (!step1Valid) return false;
        
        return !validateField("cedula", values.cedula) &&
               !validateField("nombre", values.nombre) &&
               !validateField("apellido1", values.apellido1) &&
               !validateField("apellido2", values.apellido2) &&
               !validateField("fechaNacimiento", values.fechaNacimiento) &&
               !validateField("telefono", values.telefono) &&
               !validateField("email", values.email) &&
               !validateField("distanciaFinca", values.distanciaFinca) &&
               !validateField("marcaGanado", values.marcaGanado) &&
               !validateField("CVO", values.CVO);
      }
  
      case 2: {
        const fincaValid = 
          values.nombreFinca && values.nombreFinca.length >= 1 &&
          values.areaHa && values.areaHa.length >= 1 &&
          values.numeroPlano && values.numeroPlano.length >= 1;
      
        const geografiaValid = 
          values.provincia && values.provincia.length >= 1 &&
          values.canton && values.canton.length >= 1 &&
          values.distrito && values.distrito.length >= 1;
      
        let propietarioValid = true;
        
        if (values.esPropietario === false) {
          propietarioValid = !!(
            values.propietarioCedula && values.propietarioCedula.length >= 8 &&
            values.propietarioNombre && values.propietarioNombre.length >= 1 &&
            values.propietarioApellido1 && values.propietarioApellido1.length >= 1 &&
            values.propietarioApellido2 && values.propietarioApellido2.length >= 1 &&
            values.propietarioTelefono && values.propietarioTelefono.length >= 8 &&
            values.propietarioEmail && values.propietarioEmail.length >= 1 &&
            values.propietarioFechaNacimiento && values.propietarioFechaNacimiento.length > 0
          );
        }
        
        return fincaValid && geografiaValid && propietarioValid;
      }

      case 3: {
        const hasForrajes = values.forrajes && values.forrajes.length > 0;
        const hasRegistros = values.registrosProductivos !== null;
        
        return hasForrajes && hasRegistros;
      }

      case 4: {
        // Actividades e infraestructura (opcional)
        return true;
      }
  
      case 5: {
        // Documentos
        const step5Valid = 
          values.idCopy !== null && values.idCopy !== undefined &&
          values.farmMap !== null && values.farmMap !== undefined;
        
        return step5Valid;
      }
  
      case 6: {
        // Confirmación
        return !!values.acceptTerms;
      }
  
      default:
        return false;
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCanProceed(checkStepValidity());
    }, 300);

    return () => clearInterval(intervalId);
  }, [step]);

  useEffect(() => {
    setCanProceed(checkStepValidity());
  }, [step]);

  return (
    <>
      {step === 1 && (
        <Step1 
          form={form} 
          lookup={lookup} 
          onNext={nextStep} 
          canProceed={canProceed}
        />
      )}

      {step === 2 && (
        <Step2 
          form={form} 
          onNext={nextStep} 
          onPrev={prevStep}
          canProceed={canProceed}
        />
      )}

      {step === 3 && (
        <Step3
          form={form}
          onPrev={prevStep} 
          onNext={nextStep}
        />
      )}

      {step === 4 && (
        <Step4
          form={form}
          onPrev={prevStep} 
          onNext={nextStep}
        />
      )}

      {step === 5 && (
        <Step5
          form={form} 
          onPrev={prevStep} 
          onNext={nextStep}
          canProceed={canProceed}
        />
      )}

      {step === 6 && (
        <Step6
          form={form} 
          onPrev={prevStep} 
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}