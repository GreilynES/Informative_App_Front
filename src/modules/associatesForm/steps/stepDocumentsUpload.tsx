// Step6.tsx
import { useState } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { NavigationButtons } from "../components/NavigationButtons"
import { DocumentUpload } from "../components/DocumentUpload"

interface Step6Props {
  form: FormLike
  onNext: () => void
  onPrev: () => void
  canProceed: boolean
}

export function Step6({ form, onNext, onPrev }: Step6Props) {
  const [intentoAvanzar, setIntentoAvanzar] = useState(false)

  const values = (form as any).state?.values || {}
  const hasAnyDoc = !!values.idCopy || !!values.farmMap

  const handleNext = () => {
    setIntentoAvanzar(true)
    // ✅ Documentos opcionales: no bloquea el avance
    onNext()
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          6
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Documentos</h3>
      </div>

      {/* ✅ Aviso (NO bloqueante) si no adjuntan nada */}
      {intentoAvanzar && !hasAnyDoc && (
        <div className="mx-6 mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-amber-600 mt-0.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.59c.75 1.334-.213 2.99-1.742 2.99H3.48c-1.53 0-2.492-1.656-1.743-2.99l6.52-11.59zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-7a1 1 0 00-.993.883L9 8v4a1 1 0 001.993.117L11 12V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>

            <div>
              <h3 className="text-sm font-semibold text-amber-900">
                Documentos opcionales
              </h3>
              <p className="text-sm text-amber-800 mt-1">
                Podés continuar sin adjuntar documentos. Si los tenés a mano,
                también podés subirlos ahora.
              </p>
            </div>
          </div>
        </div>
      )}

      <DocumentUpload form={form} />

      <NavigationButtons onPrev={onPrev} onNext={handleNext} />
    </div>
  )
}
