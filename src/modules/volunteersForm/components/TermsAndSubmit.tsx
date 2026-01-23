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
      ? "Debes aceptar los términos y condiciones para continuar"
      : ""

  const canSubmit = !!formData.acceptTerms && !uiSubmitting

  return (
    <div className="bg-white border border-[#DCD6C9] rounded-xl shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
          <BadgeCheck className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Términos y condiciones</h3>
      </div>

      <div className="p-6 space-y-5">
        {/* Callout */}
        <div className="rounded-xl border border-[#DCD6C9] bg-[#F3F1EA] px-4 py-3">
          <div className="flex items-start gap-3">
            <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
              i
            </span>
            <p className="text-sm text-[#4A4A4A]">
              Para enviar tu solicitud, confirma tu consentimiento para el uso de datos en el
              registro.
            </p>
          </div>
        </div>

        {/* Checkbox */}
        <div className="space-y-2">
          <label className="flex items-start gap-3 rounded-xl bg-white px-4 py-3">
            <Checkbox
              checked={!!formData.acceptTerms}
              onCheckedChange={(v) => {
                handleInputChange("acceptTerms", Boolean(v))
                if (Boolean(v)) setShowError(false)
              }}
              className="mt-0.5 border-[#DCD6C9] data-[state=checked]:bg-[#708C3E] data-[state=checked]:border-[#708C3E]"
            />
            <span className="text-sm text-[#4A4A4A] leading-relaxed">
              Confirmo mi consentimiento para que mis datos personales sean utilizados para el
              registro de mi solicitud.
            </span>
          </label>

          {err && <p className="text-sm text-red-600">{err}</p>}
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
                    successText: "¡Solicitud enviada correctamente!",
                    errorText: "No se pudo enviar tu solicitud. Inténtalo de nuevo.",
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
