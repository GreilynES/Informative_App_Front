// src/modules/associatesForm/steps/stepDocumentsUpload.tsx

import type { FormLike } from "../../../shared/types/form-lite";
import { NavigationButtons } from "../components/NavigationButtons";
import { DocumentUpload } from "../components/DocumentUpload";

interface Step6Props {
  form: FormLike;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
}

export function Step6({ form, onNext, onPrev, canProceed }: Step6Props) {
  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">6</div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Documentos</h3>
      </div>

      <DocumentUpload form={form} />

      <NavigationButtons 
        onPrev={onPrev} 
        onNext={onNext}
        disableNext={!canProceed}
      />
    </div>
  );
}