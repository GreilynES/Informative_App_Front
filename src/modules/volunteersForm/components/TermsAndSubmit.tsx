import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { btn } from "@/shared/ui/buttonStyles"
import type { VolunteersFormData } from "../../volunteersInformation/models/VolunteersType"
import { submitSolicitudFlow } from "../../utils/alerts"
import { ArrowLeft, Send, BadgeCheck } from "lucide-react"

interface TermsAndSubmitProps {
  tipoSolicitante: "INDIVIDUAL" | "ORGANIZACION"
  formData: VolunteersFormData
  handleInputChange: (field: keyof VolunteersFormData, value: boolean) => void
  prevStep: () => void
  submitIndividual?: (data: any) => Promise<any>
  submitOrganizacion?: () => Promise<void>
  onAfterSubmit?: () => void
}

export function TermsAndSubmit({
  tipoSolicitante,
  formData,
  handleInputChange,
  prevStep,
  submitIndividual,
  submitOrganizacion,
  onAfterSubmit,
}: TermsAndSubmitProps) {
  const [uiSubmitting, setUiSubmitting] = useState(false)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    return () => {
      if (Swal.isVisible()) Swal.close()
    }
  }, [])

  const err =
    showError && !formData.acceptTerms
      ? "Para continuar, debes aceptar los términos y condiciones."
      : ""

  const canSubmit = !!formData.acceptTerms && !uiSubmitting

  return (
    <div className="bg-white border border-[#DCD6C9] rounded-xl shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
          <BadgeCheck className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-[#708C3E]">Términos y condiciones</h3>
          <p className="text-xs text-gray-500">
            Antes de enviar tu solicitud, confirma tu consentimiento para el tratamiento de tus
              datos personales con fines de registro y gestión del proceso.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Checkbox */}
        <div className="space-y-2">
          <label
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
              err ? "border-[#9c1414] bg-[#fff1f1]" : "border-[#DCD6C9] hover:bg-[#E6EDC8]/20"
            }`}
          >
            <Checkbox
              checked={!!formData.acceptTerms}
              onCheckedChange={(v) => {
                handleInputChange("acceptTerms", Boolean(v))
                if (Boolean(v)) setShowError(false)
              }}
              className="mt-0.5 data-[state=checked]:bg-[#708C3E] data-[state=checked]:border-[#708C3E] data-[state=checked]:text-white border-[#DCD6C9]"
            />

            <div className="space-y-1">
              <span className="text-sm font-medium text-[#4A4A4A]">
                Acepto los términos y condiciones
              </span>
              <p className="text-sm text-gray-600 leading-relaxed">
                Autorizo el uso de mis datos personales para el registro, verificación y seguimiento
                de esta solicitud, de conformidad con la normativa aplicable.
              </p>
            </div>
          </label>

          {err && <p className="text-sm text-[#9c1414]">{err}</p>}
        </div>

        {/* Botones */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={uiSubmitting}
            className={`${btn.outlineGray} h-10 px-4 text-sm`}
          >
            <ArrowLeft className="size-4" />
            Volver
          </Button>

          <Button
            type="button"
            disabled={!canSubmit}
            onClick={async () => {
              if (!formData.acceptTerms) {
                setShowError(true)
                return
              }
              if (uiSubmitting) return

              setUiSubmitting(true)
              try {
                const { ok } = await submitSolicitudFlow(
                  async () => {
                    if (tipoSolicitante === "INDIVIDUAL") {
                      if (!submitIndividual) throw new Error("submitIndividual no disponible")
                      await submitIndividual(formData)
                    } else {
                      if (!submitOrganizacion) throw new Error("submitOrganizacion no disponible")
                      await submitOrganizacion()
                    }
                  },
                  {
                    loadingText: "Enviando solicitud...",
                    successText: "Solicitud enviada con éxito.",
                    errorText:
                      "No fue posible enviar tu solicitud. Por favor, inténtalo nuevamente.",
                  }
                )

                if (ok) onAfterSubmit?.()
              } finally {
                setUiSubmitting(false)
              }
            }}
            className={`${btn.primary} ${btn.disabledSoft} h-10 px-4 text-sm`}
          >
            <Send className="size-4" />
            {uiSubmitting ? "Enviando..." : "Enviar solicitud"}
          </Button>
        </div>
      </div>
    </div>
  )
}