import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { btn } from "@/shared/ui/buttonStyles"
import type { VolunteersFormData } from "../../volunteersInformation/models/VolunteersType"
import { submitSolicitudFlow } from "../../utils/alerts"
import { ArrowLeft, Send } from "lucide-react"

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
    <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow-md mb-8">
      <h3 className="text-3xl font-bold text-[#708C3E] text-center">
       Terminos y condiciones
      </h3>

      <div className="space-y-6 text-[#4A4A4A] mt-6">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={!!formData.acceptTerms}
            onChange={(e) => {
              handleInputChange("acceptTerms", e.target.checked)
              if (e.target.checked) setShowError(false)
            }}
            className="mt-1"
            style={{ accentColor: "#708C3E" }}
          />
          <span className="text-sm">
            Confirmo mi consentimiento para que mis datos personales sean utilizados para el registro de mi solicitud.
          </span>
        </label>

        {err && <p className="text-sm text-red-600">{err}</p>}

      </div>

      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={prevStep}
          disabled={uiSubmitting}
          className={btn.outlineGray}
        >
          <ArrowLeft className="size-4" />
          Volver
        </Button>

        <Button
          type="button"
          size="sm"
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
          className={`${btn.primary} ${btn.disabledSoft}`}
        >
          <Send className="size-4" />
          {uiSubmitting ? "Enviando..." : "Enviar solicitud"}
        </Button>
      </div>
    </div>
  )
}
