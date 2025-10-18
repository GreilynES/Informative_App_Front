// src/modules/volunteersForm/steps/stepOrganizacionInfo.tsx

import type { FormLike } from "../../../shared/types/form-lite";
import { OrganizacionSection } from "../components/OrganizacionSection";
import { RepresentanteSection } from "../components/RepresentanteSection";
import { NavigationButtons } from "../components/NavigationButtons";

interface Step1Props {
  form: FormLike;
  onNext: () => void;
  canProceed: boolean;
}

export function Step1({ form, onNext, canProceed }: Step1Props) {
  return (
    <div className="space-y-6">
      <OrganizacionSection form={form} />
      <RepresentanteSection form={form} />

      <NavigationButtons 
        onNext={onNext}
        showPrev={false}  
        disableNext={!canProceed}  
      />
    </div>
  );
}