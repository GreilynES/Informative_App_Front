import type { FormLike } from "../../../shared/types/form-lite";
import { NavigationButtons } from "../components/NavigationButtons";
import { FincaBasicInfo } from "../../fincaForm/components/FincaBasicInfo";
import { GeografiaSection } from "../../fincaForm/components/GeografiaSection";
import { PropietarioSection} from "../../fincaForm/components/PropieatarioSection";


interface Step2Props {
  form: FormLike;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
}

export function Step2({ form, onNext, onPrev, canProceed }: Step2Props) {
  return (
    <div className="space-y-6">
      <FincaBasicInfo form={form} />
      <GeografiaSection form={form} />
      <PropietarioSection form={form}/>

      <NavigationButtons 
        onPrev={onPrev} 
        onNext={onNext}
        disableNext={!canProceed}
      />
    </div>
  );
}