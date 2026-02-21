import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react"
import { Lightbulb, Award, Briefcase } from "lucide-react"
import { motivacionHabilidadesSchema } from "../schemas/volunteerSchema"
import { Textarea } from "@/components/ui/textarea"

interface MotivacionHabilidadesSectionProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
}

export type MotivacionHabilidadesSectionHandle = {
  validateAndShowErrors: () => boolean
  isValid: () => boolean
  clearErrors: () => void
}

const MAX = 255

export const MotivacionHabilidadesSection = forwardRef<
  MotivacionHabilidadesSectionHandle,
  MotivacionHabilidadesSectionProps
>(function MotivacionHabilidadesSection({ formData, handleInputChange }, ref) {
  const [showErrors, setShowErrors] = useState(false)
  const [errors, setErrors] = useState<{ motivation?: string; volunteeringType?: string }>({})

  const motivationLen = (formData?.motivation || "").length
  const volunteeringLen = (formData?.volunteeringType || "").length
  const experienceLen = (formData?.previousExperience || "").length

  const getErrors = useMemo(
    () =>
      (payload: {
        motivation: string
        volunteeringType: string
        previousExperience?: string
      }) => {
        const res = motivacionHabilidadesSchema.safeParse(payload)
        const base = { motivation: "", volunteeringType: "" }
        if (!res.success) {
          for (const issue of res.error.issues) {
            const key = (issue.path[0] as "motivation" | "volunteeringType") ?? "motivation"
            if (key in base) (base as any)[key] = issue.message
          }
        }
        return base
      },
    []
  )

  const isEmpty = (e: typeof errors) => !e.motivation && !e.volunteeringType

  useImperativeHandle(ref, () => ({
    validateAndShowErrors: () => {
      const merged = getErrors({
        motivation: formData?.motivation || "",
        volunteeringType: formData?.volunteeringType || "",
        previousExperience: formData?.previousExperience || "",
      })
      setErrors(merged)
      setShowErrors(true)
      return isEmpty(merged)
    },
    isValid: () => {
      const merged = getErrors({
        motivation: formData?.motivation || "",
        volunteeringType: formData?.volunteeringType || "",
        previousExperience: formData?.previousExperience || "",
      })
      return isEmpty(merged)
    },
    clearErrors: () => {
      setShowErrors(false)
      setErrors({})
    },
  }))

  useEffect(() => {
    if (!showErrors) return
    const merged = getErrors({
      motivation: formData?.motivation || "",
      volunteeringType: formData?.volunteeringType || "",
      previousExperience: formData?.previousExperience || "",
    })
    setErrors(merged)
  }, [
    formData?.motivation,
    formData?.volunteeringType,
    formData?.previousExperience,
    showErrors,
    getErrors,
  ])

  const textareaBase =
    "border-[#DCD6C9] bg-white shadow-sm resize-none " +
    "focus-visible:ring-2 focus-visible:ring-[#708C3E]/30 focus-visible:ring-offset-0"

  return (
    <div className="space-y-6">
      {/* ========== MOTIVACIÓN ========== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Motivación</h3>
        </div>

        <div className="p-6 space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            ¿Por qué te gustaría ser voluntario/a en nuestra organización?
          </label>

          <Textarea
            value={formData?.motivation || ""}
            onChange={(e) => handleInputChange("motivation", e.target.value)}
            rows={5}
            maxLength={MAX}
            className={[
              textareaBase,
              (showErrors && errors.motivation) || motivationLen >= MAX
                ? "border-[#9c1414]"
                : "border-[#DCD6C9]",
            ].join(" ")}
          />

          {/* Mensajes */}
          {showErrors && errors.motivation && (
            <p className="text-sm text-[#9c1414] mt-1">{errors.motivation}</p>
          )}
          <p className="text-xs text-gray-500">Comparte tus razones para querer ser parte de nuestro equipo de voluntarios...</p>

        </div>
      </div>

      {/* ========== HABILIDADES ========== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Habilidades</h3>
        </div>

        <div className="p-6 space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            ¿Qué habilidades o conocimientos puedes aportar?
          </label>

          <Textarea
            value={formData?.volunteeringType || ""}
            onChange={(e) => handleInputChange("volunteeringType", e.target.value)}
            rows={5}
            maxLength={MAX}
            className={[
              textareaBase,
              (showErrors && errors.volunteeringType) || volunteeringLen >= MAX
                ? "border-[#9c1414]"
                : "border-[#DCD6C9]",
            ].join(" ")}
          />

          {showErrors && errors.volunteeringType && (
            <p className="text-sm text-[#9c1414] mt-1">{errors.volunteeringType}</p>
          )}
          <p className="text-xs text-gray-500">Cuéntanos sobre tus habilidades, experiencias o conocimientos que podrían ser útiles para nuestras actividades de voluntariado...</p>
        </div>
      </div>

      {/* ========== EXPERIENCIA PREVIA (Opcional) ========== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Experiencia Previa</h3>
        </div>

        <div className="p-6 space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            ¿Has participado anteriormente en actividades de voluntariado?{" "}
            <span className="text-gray-500 text-xs">(Opcional)</span>
          </label>

          <Textarea
            value={formData?.previousExperience || ""}
            onChange={(e) => handleInputChange("previousExperience", e.target.value)}
            rows={5}
            maxLength={MAX}
            className={[
              textareaBase,
              experienceLen >= MAX ? "border-[#9c1414]" : "border-[#DCD6C9]",
            ].join(" ")}
          />
          <p className="text-xs text-gray-500">Comparte cualquier experiencia previa que hayas tenido como voluntario/a, ya sea en nuestra organización o en otras...</p>
        </div>
      </div>
    </div>
  )
})
