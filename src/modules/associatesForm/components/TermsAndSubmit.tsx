import { useEffect, useRef } from "react"
import type { FieldLike, FormLike } from "../../../shared/types/form-lite"
import Swal from "sweetalert2"
import { showLoading, stopLoadingWithSuccess } from "../../utils/alerts"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Send, BadgeCheck } from "lucide-react"
import { btn } from "@/shared/ui/buttonStyles"

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
    (form as any).state?.errors?.acceptTerms ||
    (form as any).state?.meta?.errors?.acceptTerms?.[0]?.message

  const accepted = !!(form as any).state?.values?.acceptTerms

  return (
    <div className="bg-white border border-[#DCD6C9] rounded-xl shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
          <BadgeCheck className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Confirmación de Solicitud</h3>
      </div>

      <div className="p-6 space-y-5">
        {/* Callout */}
        <div className="rounded-xl border border-[#DCD6C9] bg-[#F3F1EA] px-4 py-3">
          <div className="flex items-start gap-3">
            <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
              i
            </span>
            <p className="text-sm text-[#4A4A4A]">
              Antes de enviar, confirma tu consentimiento para el uso de datos en el registro de tu
              solicitud.
            </p>
          </div>
        </div>

        {/* Checkbox */}
        <div className="space-y-2 text-[#4A4A4A]">
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
              <label className="flex items-start gap-3 rounded-xl bg-white px-4 py-3">
                <Checkbox
                  checked={!!f.state.value}
                  onCheckedChange={(v) => f.handleChange(Boolean(v))}
                  onBlur={f.handleBlur}
                  className="mt-0.5 border-[#DCD6C9] data-[state=checked]:bg-[#708C3E] data-[state=checked]:border-[#708C3E]"
                />
                <span className="text-sm leading-relaxed">
                  Confirmo mi consentimiento para que mis datos personales sean utilizados para el
                  registro de mi solicitud de asociado.
                </span>
              </label>
            )}
          </form.Field>

          {err && <p className="text-sm text-red-600">{err}</p>}
        </div>

        {/* Botones */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className={`${btn.outlineGray} h-10 px-4 text-sm`}
          >
            <ArrowLeft className="size-4" />
            Volver
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || !accepted}
            className={`${btn.primary} ${btn.disabledSoft} h-10 px-4 text-sm`}
          >
            <Send className="size-4" />
            {isSubmitting ? "Enviando..." : "Enviar solicitud"}
          </Button>
        </div>
      </div>
    </div>
  )
}
