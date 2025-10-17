import { CheckCircle } from "lucide-react";

interface RequirementsSectionProps {
  requirements: string[];
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

export function RequirementsSection({ requirements, showForm, setShowForm }: RequirementsSectionProps) {
  return (
    <div className="bg-white/80 rounded-xl p-8 shadow-md border border-[#DCD6C9] max-w-6xl mx-auto mb-16">
      <h2 className="text-3xl font-bold text-[#708C3E] text-center mb-8">Requisitos</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {requirements.map((req, i) => (
          <div key={i} className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-[#708C3E] mt-1 flex-shrink-0" />
            <p className="text-gray-700">{req}</p>
          </div>
        ))}
      </div>

      {!showForm && (
        <div className="text-center mt-10">
          <div className="inline-flex gap-20">
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-[#6F8C1F] to-[#475C1D] hover:from-[#5d741c] hover:to-[#384c17] text-white rounded-md font-medium px-6 py-3 text-lg transition"
            >
              Desplegar Formulario Para Organización
            </button>

            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-[#6F8C1F] to-[#475C1D] hover:from-[#5d741c] hover:to-[#384c17] text-white rounded-md font-medium px-6 py-3 text-lg transition"
            >
              Desplegar Formulario Para Individual
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
