import { Users } from "lucide-react"
import type { VolunteersFormData } from "../../models/VolunteersType"


interface TermsAndSubmitProps {
  formData: VolunteersFormData
  handleInputChange: (field: keyof VolunteersFormData, value: boolean) => void
  prevStep: () => void
}

export function TermsAndSubmit({
  formData,
  handleInputChange,
  prevStep,
}: TermsAndSubmitProps) {
  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="p-6 space-y-4">
        {/* Términos */}
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={formData.acceptTerms}
            onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
            className="mt-1 h-4 w-4 text-[#708C3E] border-gray-300 rounded focus:ring-[#A3853D]"
          />
          <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
            Acepto los{" "}
            <a href="#" className="text-[#A3853D] underline">
              términos y condiciones
            </a>{" "}
            y autorizo el tratamiento de mis datos.
          </label>
        </div>

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="info"
            checked={formData.receiveInfo}
            onChange={(e) => handleInputChange("receiveInfo", e.target.checked)}
            className="mt-1 h-4 w-4 text-[#708C3E] border-gray-300 rounded focus:ring-[#A3853D]"
          />
          <label htmlFor="info" className="text-sm text-gray-700">
            Deseo recibir información sobre eventos, capacitaciones y oportunidades.
          </label>
        </div>

        {/* Botones */}
        <div className="flex flex-col items-center gap-4 pt-6">
          <div className="flex flex-col md:flex-row gap-5">
            <button
              type="button"
              onClick={prevStep}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg shadow transition-all duration-200 w-full md:w-auto"
            >
              ← Volver al formulario
            </button>

            <button
              type="submit"
              disabled={!formData.acceptTerms}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white text-lg shadow transition-colors duration-200
                ${
                  formData.acceptTerms
                    ? "bg-[#708C3E] hover:bg-[#5d7334]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              <Users className="w-5 h-5" />
              Enviar Solicitud de Voluntario
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-2 text-center">
            Nos pondremos en contacto contigo en un plazo de 3-5 días hábiles
          </p>
        </div>
      </div>
    </div>
  )
}
