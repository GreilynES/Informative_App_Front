
import { Button } from "@/components/ui/button"
import type { VolunteersFormData } from "@/modules/volunteersInformation/models/VolunteersType"
import { ArrowLeft } from "lucide-react"
import { TermsAndSubmit } from "../../components/TermsAndSubmit"

export function Step5Individual(props: {
  formData: VolunteersFormData
  files: any
  goPrev: () => void
  handleInputChange: (field: string, value: any) => void
  submitIndividual?: (data: any) => Promise<any>
  submitOrganizacion?: () => Promise<void>
  onAfterSubmit?: () => void
}) {
  const { formData, files, goPrev, handleInputChange, submitIndividual, submitOrganizacion, onAfterSubmit } = props

  return (
    <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow-md mb-8">
      <h2 className="text-3xl font-bold text-[#708C3E] text-center mb-6">Confirmación de Solicitud</h2>

      <div className="space-y-6 text-[#4A4A4A]">
        <div>
          <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Datos Personales</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <p><span className="text-sm text-gray-500">Nombre:</span> {formData.name}</p>
            <p><span className="text-sm text-gray-500">Primer Apellido:</span> {formData.lastName1}</p>
            <p><span className="text-sm text-gray-500">Segundo Apellido:</span> {formData.lastName2}</p>
            <p><span className="text-sm text-gray-500">Cédula:</span> {formData.idNumber}</p>
            <p><span className="text-sm text-gray-500">Fecha de Nacimiento:</span> {formData.birthDate}</p>
            <p><span className="text-sm text-gray-500">Nacionalidad:</span> {formData.nacionalidad || "No especificado"}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Contacto</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <p><span className="text-sm text-gray-500">Teléfono:</span> {formData.phone}</p>
            <p><span className="text-sm text-gray-500">Email:</span> {formData.email}</p>
            <p className="md:col-span-2"><span className="text-sm text-gray-500">Dirección:</span> {formData.address || "No especificado"}</p>
          </div>
        </div>

        {!!formData.disponibilidades?.length && (
          <div>
            <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Disponibilidad</h3>
            {formData.disponibilidades.map((disp, idx) => (
              <div key={idx} className="mb-3 bg-white p-3 rounded-lg">
                <p><span className="text-sm text-gray-500">Periodo:</span> {disp.fechaInicio} - {disp.fechaFin}</p>
                <p><span className="text-sm text-gray-500">Días:</span> {disp.dias.join(", ") || "No especificado"}</p>
                <p><span className="text-sm text-gray-500">Horarios:</span> {disp.horarios.join(", ") || "No especificado"}</p>
              </div>
            ))}
          </div>
        )}

        {!!formData.areasInteres?.length && (
          <div>
            <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Áreas de Interés</h3>
            <ul className="list-disc list-inside bg-white p-3 rounded-lg">
              {formData.areasInteres.map((area, idx) => (
                <li key={idx} className="text-sm text-gray-700">{area.nombreArea}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Motivación y Habilidades</h3>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">Motivación:</p>
              <p className="text-sm text-gray-700 mt-1">{formData.motivation || "No especificado"}</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">Habilidades:</p>
              <p className="text-sm text-gray-700 mt-1">{formData.volunteeringType || "No especificado"}</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">Experiencia Previa:</p>
              <p className="text-sm text-gray-700 mt-1">{formData.previousExperience || "No especificado"}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Documentos Adjuntos</h3>
          <div className="space-y-2 bg-white p-3 rounded-lg">
            <p className="text-sm">
              <span className="text-gray-500">CV:</span>{" "}
              {files?.cv ? <span className="text-green-600">✓ {files.cv.name}</span> : <span className="text-red-600">✗ No adjuntado</span>}
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Cédula:</span>{" "}
              {files?.cedula ? <span className="text-green-600">✓ {files.cedula.name}</span> : <span className="text-red-600">✗ No adjuntado</span>}
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Carta de Motivación:</span>{" "}
              {files?.carta ? <span className="text-green-600">✓ {files.carta.name}</span> : <span className="text-gray-500">Opcional - No adjuntado</span>}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-start">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={goPrev}
          className="border-[#708C3E] text-[#708C3E] hover:bg-[#E6EDC8] shadow-none"
        >
          <ArrowLeft className="size-4" />
          Anterior
        </Button>
      </div>

      <div className="mt-6">
        <TermsAndSubmit
          tipoSolicitante="INDIVIDUAL"
          formData={formData}
          handleInputChange={(field, value) => handleInputChange(field, value)}
          prevStep={goPrev}
          submitIndividual={submitIndividual}
          submitOrganizacion={submitOrganizacion}
          onAfterSubmit={onAfterSubmit}
        />
      </div>
    </div>
  )
}
