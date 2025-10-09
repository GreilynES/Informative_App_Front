import type { FormLike } from "../../../shared/types/form-lite";
import { NavigationButtons } from "../components/NavigationButtons";
import { ForrajeSection } from "../../fincaForm/components/ForrajeSection";
import { RegistroSection } from "../../fincaForm/components/RegistroSection";

interface Step3Props {
  form: FormLike;
  onNext: () => void;
  onPrev: () => void;
}

export function Step3({ form, onNext, onPrev }: Step3Props) {
  return (
    <div className="space-y-6">
      <ForrajeSection form={form} />
      <RegistroSection form={form} />

      <NavigationButtons 
        onPrev={onPrev} 
        onNext={onNext}
      />
    </div>
  );
}