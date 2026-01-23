
import type { VolunteersFormData } from "@/modules/volunteersInformation/models/VolunteersType"
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
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9] p-6 space-y-6">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          5
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Confirmación de Solicitud</h3>
      </div>

      <div className="space-y-6 text-[#4A4A4A]">
        <div>
          <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Datos Personales</h3>
          <div className="grid md:grid-cols-2 gap-3 bg-[#f3f1eae7] p-3 rounded-lg">
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
          <div className="grid md:grid-cols-2 gap-3 bg-[#f3f1eae7] p-3 rounded-lg">
            <p><span className="text-sm text-gray-500">Teléfono:</span> {formData.phone}</p>
            <p><span className="text-sm text-gray-500">Email:</span> {formData.email}</p>
            <p className="md:col-span-2"><span className="text-sm text-gray-500">Dirección:</span> {formData.address || "No especificado"}</p>
          </div>
        </div>

        {!!formData.disponibilidades?.length && (
          <div>
            <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Disponibilidad</h3>
            {formData.disponibilidades.map((disp, idx) => (
              <div key={idx} className="mb-3 bg-[#f3f1eae7] p-3 rounded-lg">
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
            <ul className="list-disc list-inside bg-[#f3f1eae7] p-3 rounded-lg">
              {formData.areasInteres.map((area, idx) => (
                <li key={idx} className="text-sm text-gray-700">{area.nombreArea}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Experiencia, Motivación y Habilidades</h3>
          <div className="space-y-3">
            <div className="bg-[#f3f1eae7] p-3 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">Experiencia Previa:</p>
              <p className="text-sm text-gray-700 mt-1">{formData.previousExperience || "No especificado"}</p>
            </div>
            <div className="bg-[#f3f1eae7] p-3 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">Motivación:</p>
              <p className="text-sm text-gray-700 mt-1">{formData.motivation || "No especificado"}</p>
            </div>
            <div className="bg-[#f3f1eae7] p-3 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">Habilidades:</p>
              <p className="text-sm text-gray-700 mt-1">{formData.volunteeringType || "No especificado"}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Documentos Adjuntos</h3>
          <div className="space-y-2 bg-[#f3f1eae7] p-3 rounded-lg">
            <p className="text-sm">
              <span className="text-gray-500">CV:</span>{" "}
              {files?.cv ? <span className="text-green-600">✓ {files.cv.name}</span> : <span className="text-[#9e2d2d]">✗ No adjuntado</span>}
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Cédula:</span>{" "}
              {files?.cedula ? <span className="text-green-600">✓ {files.cedula.name}</span> : <span className="text-[#9e2d2d]">✗ No adjuntado</span>}
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Carta de Motivación:</span>{" "}
              {files?.carta ? <span className="text-green-600">✓ {files.carta.name}</span> : <span className="text-gray-500">Opcional - No adjuntado</span>}
            </p>
          </div>
        </div>
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
