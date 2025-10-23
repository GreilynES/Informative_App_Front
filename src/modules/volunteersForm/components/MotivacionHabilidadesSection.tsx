import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Lightbulb, Award, Briefcase } from "lucide-react";
import { motivacionHabilidadesSchema } from "../schemas/volunteerSchema";

interface MotivacionHabilidadesSectionProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

export type MotivacionHabilidadesSectionHandle = {
  validateAndShowErrors: () => boolean;
  isValid: () => boolean;
  clearErrors: () => void;
};

const MAX = 150;

export const MotivacionHabilidadesSection = forwardRef<
  MotivacionHabilidadesSectionHandle,
  MotivacionHabilidadesSectionProps
>(function MotivacionHabilidadesSection({ formData, handleInputChange }, ref) {
  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState<{ motivation?: string; volunteeringType?: string }>({});

  const motivationLen = (formData?.motivation || "").length;
  const volunteeringLen = (formData?.volunteeringType || "").length;
  const experienceLen = (formData?.previousExperience || "").length;

  const getErrors = useMemo(
    () =>
      (payload: {
        motivation: string;
        volunteeringType: string;
        previousExperience?: string;
      }) => {
        const res = motivacionHabilidadesSchema.safeParse(payload);
        const base = { motivation: "", volunteeringType: "" };
        if (!res.success) {
          for (const issue of res.error.issues) {
            const key = (issue.path[0] as "motivation" | "volunteeringType") ?? "motivation";
            if (key in base) (base as any)[key] = issue.message;
          }
        }
        return base;
      },
    []
  );

  const isEmpty = (e: typeof errors) => !e.motivation && !e.volunteeringType;

  useImperativeHandle(ref, () => ({
    validateAndShowErrors: () => {
      const merged = getErrors({
        motivation: formData?.motivation || "",
        volunteeringType: formData?.volunteeringType || "",
        previousExperience: formData?.previousExperience || "",
      });
      setErrors(merged);
      setShowErrors(true);
      return isEmpty(merged);
    },
    isValid: () => {
      const merged = getErrors({
        motivation: formData?.motivation || "",
        volunteeringType: formData?.volunteeringType || "",
        previousExperience: formData?.previousExperience || "",
      });
      return isEmpty(merged);
    },
    clearErrors: () => {
      setShowErrors(false);
      setErrors({});
    },
  }));

  useEffect(() => {
    if (!showErrors) return;
    const merged = getErrors({
      motivation: formData?.motivation || "",
      volunteeringType: formData?.volunteeringType || "",
      previousExperience: formData?.previousExperience || "",
    });
    setErrors(merged);
  }, [
    formData?.motivation,
    formData?.volunteeringType,
    formData?.previousExperience,
    showErrors,
    getErrors,
  ]);

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

        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Por qué te gustaría ser voluntario/a en nuestra organización?
          </label>
          <textarea
            value={formData?.motivation || ""}
            onChange={(e) => handleInputChange("motivation", e.target.value)}
            rows={5}
            maxLength={MAX}
            placeholder="Comparte tus razones para querer ser parte de nuestro equipo de voluntarios..."
            className={`w-full px-3 py-2 border rounded-md shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F] ${
              (showErrors && errors.motivation) || motivationLen >= MAX
                ? "border-red-400"
                : "border-gray-300"
            }`}
          />
          {/* Mensajes */}
          {showErrors && errors.motivation && (
            <p className="text-sm text-red-600 mt-1">{errors.motivation}</p>
          )}
          <div className="mt-1 flex justify-end">
            <span className={`text-xs ${motivationLen >= MAX ? "text-red-600" : "text-gray-400"}`}>
              {motivationLen}/{MAX}
              {motivationLen >= MAX ? " — Llegaste al máximo (150)" : ""}
            </span>
          </div>
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

        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Qué habilidades o conocimientos puedes aportar?
          </label>
          <textarea
            value={formData?.volunteeringType || ""}
            onChange={(e) => handleInputChange("volunteeringType", e.target.value)}
            rows={5}
            maxLength={MAX}
            placeholder="Ej: Trabajo en equipo, comunicación, agricultura sostenible, manejo de redes sociales..."
            className={`w-full px-3 py-2 border rounded-md shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F] ${
              (showErrors && errors.volunteeringType) || volunteeringLen >= MAX
                ? "border-red-400"
                : "border-gray-300"
            }`}
          />
          {/* Mensajes */}
          {showErrors && errors.volunteeringType && (
            <p className="text-sm text-red-600 mt-1">{errors.volunteeringType}</p>
          )}
          <div className="mt-1 flex justify-end">
            <span
              className={`text-xs ${volunteeringLen >= MAX ? "text-red-600" : "text-gray-400"}`}
            >
              {volunteeringLen}/{MAX}
              {volunteeringLen >= MAX ? " — Llegaste al máximo (150)" : ""}
            </span>
          </div>
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

        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Has participado anteriormente en actividades de voluntariado?{" "}
            <span className="text-gray-500 text-xs">(Opcional)</span>
          </label>
          <textarea
            value={formData?.previousExperience || ""}
            onChange={(e) => handleInputChange("previousExperience", e.target.value)}
            rows={5}
            maxLength={MAX}
            placeholder="Si tienes experiencia previa como voluntario/a, cuéntanos sobre ella..."
            className={`w-full px-3 py-2 border rounded-md shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F] ${
              experienceLen >= MAX ? "border-red-400" : "border-gray-300"
            }`}
          />
          <div className="mt-1 flex justify-end">
            <span className={`text-xs ${experienceLen >= MAX ? "text-red-600" : "text-gray-400"}`}>
              {experienceLen}/{MAX}
              {experienceLen >= MAX ? " — Llegaste al máximo (150)" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
