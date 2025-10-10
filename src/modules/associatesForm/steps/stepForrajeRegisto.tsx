import React, { useState, useCallback } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import { NavigationButtons } from "../components/NavigationButtons";
import { ForrajeSection } from "../../fincaForm/components/ForrajeSection";
import { RegistroSection } from "../../fincaForm/components/RegistroSection";
import { FuenteAguaSection } from "../../fincaForm/components/FuenteAguaSection";

interface Step3Props {
  form: FormLike;
  onNext: () => void;
  onPrev: () => void;
}

export function Step3({ form, onNext, onPrev }: Step3Props) {
  const [canProceed, setCanProceed] = useState(false);

  // Callback que verifica si Next debe habilitarse
  const validateStep = useCallback(() => {
    const state = (form as any).state?.values || {};

    // Forraje: al menos uno
    const hasForraje = Array.isArray(state.forrajes) && state.forrajes.length > 0;

    // Registro: al menos uno marcado
    const registros = state.registrosProductivos || {};
    const hasRegistro =
      registros.reproductivos || registros.costosProductivos || registros.noTiene;

    // Fuente de agua y riego: al menos uno cada uno
    const hasFuentes =
      Array.isArray(state.fuentesAgua) && state.fuentesAgua.length > 0;
    const hasRiego =
      Array.isArray(state.metodosRiego) && state.metodosRiego.length > 0;

    // Next habilitado solo si todos cumplen
    setCanProceed(hasForraje && hasRegistro && hasFuentes && hasRiego);
  }, [form]);

  return (
    <div className="space-y-6">
      <ForrajeSection form={form} onChange={validateStep} />
      <RegistroSection form={form} onChange={validateStep} />
      <FuenteAguaSection form={form} onChange={validateStep} />

      <NavigationButtons
        onPrev={onPrev}
        onNext={onNext}
        disableNext={!canProceed} // 🔹 solo habilitado si todo es válido
      />
    </div>
  );
}
