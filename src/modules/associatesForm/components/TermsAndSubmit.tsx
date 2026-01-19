import { useEffect, useRef } from "react"
import type { FieldLike, FormLike } from "../../../shared/types/form-lite"
import Swal from "sweetalert2"
import { showLoading, stopLoadingWithSuccess } from "../../utils/alerts"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send } from "lucide-react"

export function TermsAndSubmit({
  form,
  isSubmitting,
  prevStep,
}: {
  form: FormLike
  isSubmitting?: boolean
  prevStep: () => void
}) {
  const wasSubmittingRef = useRef(false)

  useEffect(() => {
    if (isSubmitting && !wasSubmittingRef.current) {
      wasSubmittingRef.current = true
      showLoading("Enviando solicitud...")
    }

    if (!isSubmitting && wasSubmittingRef.current) {
      wasSubmittingRef.current = false
      stopLoadingWithSuccess("Solicitud enviada correctamente.")
    }
  }, [isSubmitting])

  useEffect(() => {
    return () => {
      if (Swal.isVisible()) Swal.close()
    }
  }, [])

  const err =
    form.state?.errors?.acceptTerms || form.state?.meta?.errors?.acceptTerms?.[0]?.message

  return (
    <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow-md mb-8">
      <h2 className="text-3xl font-bold text-[#708C3E] text-center">Confirmación de Solicitud</h2>

      <div className="space-y-6 text-[#4A4A4A] mt-6">
        <form.Field
          name="acceptTerms"
          validators={{
            onChange: ({ value }: any) => {
              if (!value) return "Debes aceptar los términos y condiciones para continuar"
              return undefined
            },
          }}
        >
          {(f: FieldLike<boolean>) => (
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={!!f.state.value}
                onChange={(e) => f.handleChange(e.target.checked)}
                onBlur={f.handleBlur}
                className="mt-1"
                style={{ accentColor: "#708C3E" }}
              />
              <span className="text-sm">
                Confirmo mi consentimiento para que mis datos personales sean utilizados para el
                registro de mi solicitud de asociado.
              </span>
            </label>
          )}
        </form.Field>

        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>

      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={prevStep}
          className="border-[#DCD6C9] text-[#4A4A4A] hover:bg-[#ECECEC] shadow-none"
        >
          <ArrowLeft className="size-4" />
          Volver
        </Button>

        {/* ✅ sin onClick; el submit lo controla el form */}
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || !form.state.values.acceptTerms}
          className="bg-[#708C3E] text-white hover:bg-[#5d7334] disabled:bg-[#ECECEC] disabled:text-[#6B6B6B] shadow-sm"
        >
          <Send className="size-4" />
          {isSubmitting ? "Enviando..." : "Enviar solicitud"}
        </Button>
      </div>
    </div>
  )
}
