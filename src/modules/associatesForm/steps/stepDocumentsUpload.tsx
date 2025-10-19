import { useState } from "react";
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
  const [intentoAvanzar, setIntentoAvanzar] = useState(false);

  const handleNext = () => {
    setIntentoAvanzar(true);
    const values = (form as any).state?.values || {};

    const docsOk =
      values.idCopy !== null && values.idCopy !== undefined &&
      values.farmMap !== null && values.farmMap !== undefined;

    if (!docsOk) {
      // Scroll al inicio para ver el mensaje de error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Si todo está válido, avanzar
    onNext();
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">6</div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Documentos</h3>
      </div>

      {intentoAvanzar && !canProceed && (
        <div className="mx-6 mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-red-800">
                Documentos requeridos
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Debe subir ambos documentos obligatorios: copia de cédula y copia del plano de la finca.
              </p>
            </div>
          </div>
        </div>
      )}

      <DocumentUpload form={form} />

      <NavigationButtons 
        onPrev={onPrev} 
        onNext={handleNext}
      />
    </div>
  );
}