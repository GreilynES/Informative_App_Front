// src/modules/associatesForm/steps/stepActividadesCaracteristicas.tsx

import type { FormLike } from "../../../shared/types/form-lite";
import { ActividadesInfraestructuraSection } from "../components/ActividadesInfraestructuraSection";
import { CaracteristicasFisicasSection } from "../components/CaracteristicasFisicasSection";
import { NavigationButtons } from "../components/NavigationButtons";

interface Step4Props {
  form: FormLike;
  onNext: () => void;
  onPrev: () => void;
}

export function Step4({ form, onNext, onPrev }: Step4Props) {
  return (
    <div className="space-y-6">
      <ActividadesInfraestructuraSection form={form} />
      <CaracteristicasFisicasSection form={form} />

      <NavigationButtons 
        onPrev={onPrev} 
        onNext={onNext}
      />
    </div>
  );
}