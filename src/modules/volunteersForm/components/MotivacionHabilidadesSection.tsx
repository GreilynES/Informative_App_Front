// src/modules/volunteersForm/components/MotivacionHabilidadesSection.tsx

import { Lightbulb, Award, Briefcase } from "lucide-react";

interface MotivacionHabilidadesSectionProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

export function MotivacionHabilidadesSection({
  formData,
  handleInputChange,
}: MotivacionHabilidadesSectionProps) {
  
  return (
    <div className="space-y-6">
      {/* ========== MOTIVACIÓN ========== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">
            Motivación
          </h3>
        </div>

        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Por qué te gustaría ser voluntario/a en nuestra organización?
          </label>
          <textarea
            value={formData.motivation || ""}
            onChange={(e) => handleInputChange("motivation", e.target.value)}
            rows={5}
            placeholder="Comparte tus razones para querer ser parte de nuestro equipo de voluntarios..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
          />
        </div>
      </div>

      {/* ========== HABILIDADES ========== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">
            Habilidades
          </h3>
        </div>

        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Qué habilidades o conocimientos puedes aportar?
          </label>
          <textarea
            value={formData.volunteeringType || ""}
            onChange={(e) => handleInputChange("volunteeringType", e.target.value)}
            rows={5}
            placeholder="Ej: Trabajo en equipo, comunicación, conocimientos en agricultura sostenible, manejo de redes sociales..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
          />
        </div>
      </div>

      {/* ========== EXPERIENCIA PREVIA ========== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">
            Experiencia Previa
          </h3>
        </div>

        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Has participado anteriormente en actividades de voluntariado?{" "}
            <span className="text-gray-500 text-xs">(Opcional)</span>
          </label>
          <textarea
            value={formData.previousExperience || ""}
            onChange={(e) => handleInputChange("previousExperience", e.target.value)}
            rows={5}
            placeholder="Si tienes experiencia previa como voluntario/a, cuéntanos sobre ella..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
          />
        </div>
      </div>
    </div>
  );
}