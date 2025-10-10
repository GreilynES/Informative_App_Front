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
  const [isValid, setIsValid] = useState(false);

  // 🔹 Callback que se pasa a todas las secciones
  const handleChange = useCallback(() => {
    const state = (form as any).state?.values || {};

    // --- Forraje ---
    const forrajes = state.forrajes || [];
    const forrajesValidos =
      forrajes.length > 0 &&
      forrajes.every(
        (f: any) =>
          f.tipoForraje?.trim() &&
          f.variedad?.trim() &&
          f.hectareas > 0 &&
          f.utilizacion?.trim()
      );

    // --- Registro ---
    const registros = state.registrosProductivos || {};
    const registroValido =
      registros.reproductivos || registros.costosProductivos || registros.noTiene;

    // --- Fuente de agua ---
    const fuentes = state.fuentesAgua || [];
    const riegos = state.metodosRiego || [];
    const fuentesValidas = fuentes.length > 0;
    const riegosValidos = riegos.length > 0;

    const formCompleto =
      forrajesValidos && registroValido && fuentesValidas && riegosValidos;

    setIsValid(formCompleto);
  }, [form]);

  return (
    <div className="space-y-6">
      <ForrajeSection form={form} onChange={handleChange} />
      <RegistroSection form={form} onChange={handleChange} />
      <FuenteAguaSection form={form} onChange={handleChange} />

      <NavigationButtons
        onPrev={onPrev}
        onNext={onNext}
        disableNext={!isValid} // 🔹 habilita solo si todo está completo
      />
    </div>
  );
}
