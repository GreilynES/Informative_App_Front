// src/modules/associatesForm/steps/stepAccesoComercializacion.tsx

import type { FormLike } from "../../../shared/types/form-lite";
import { AccesoSection } from "../../fincaForm/components/AccesoSection";
import { ComercializacionSection } from "../../fincaForm/components/ComercializacionSection";
import { NecesidadesSection } from "../../fincaForm/components/NecesidadesSection";

import { NavigationButtons } from "../components/NavigationButtons";

interface Step5Props {
  form: FormLike;
  onNext: () => void;
  onPrev: () => void;
}

export function Step5({ form, onNext, onPrev }: Step5Props) {
  return (
    <div className="space-y-6">
      <AccesoSection form={form} />
      <ComercializacionSection form={form} />
      <NecesidadesSection form={form} />

      <NavigationButtons 
        onPrev={onPrev} 
        onNext={onNext}
      />
    </div>
  );
}