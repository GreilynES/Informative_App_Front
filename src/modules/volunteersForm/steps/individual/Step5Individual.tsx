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
  const {
    formData,
    files,
    goPrev,
    handleInputChange,
    submitIndividual,
    submitOrganizacion,
    onAfterSubmit,
  } = props

  return (
    <div className="bg-white border border-[#DCD6C9] rounded-xl shadow-md">
      <div className="px-6 py-4 border-b border-[#DCD6C9]">
        <h2 className="text-lg font-semibold text-[#708C3E]">
          Confirmación de Solicitud - Individual
        </h2>
        <p className="text-sm text-[#4A4A4A] mt-1">
          Revisa la información antes de enviar.
        </p>
      </div>

      <div className="p-6 space-y-6 text-[#4A4A4A]">
        {/* Datos personales */}
        <section className="rounded-xl border border-[#DCD6C9] bg-white p-4">
          <h3 className="text-base font-semibold text-[#708C3E] mb-3">Datos Personales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <p><span className="text-gray-500">Nombre:</span> {formData.name || "N/A"}</p>
            <p><span className="text-gray-500">Primer Apellido:</span> {formData.lastName1 || "N/A"}</p>
            <p><span className="text-gray-500">Segundo Apellido:</span> {formData.lastName2 || "N/A"}</p>
            <p><span className="text-gray-500">Cédula:</span> {formData.idNumber || "N/A"}</p>
            <p><span className="text-gray-500">Fecha de Nacimiento:</span> {formData.birthDate || "N/A"}</p>
            <p><span className="text-gray-500">Nacionalidad:</span> {formData.nacionalidad || "No especificado"}</p>
          </div>
        </section>

        {/* Contacto */}
        <section className="rounded-xl border border-[#DCD6C9] bg-white p-4">
          <h3 className="text-base font-semibold text-[#708C3E] mb-3">Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <p><span className="text-gray-500">Teléfono:</span> {formData.phone || "N/A"}</p>
            <p><span className="text-gray-500">Email:</span> {formData.email || "N/A"}</p>
            <p className="md:col-span-2">
              <span className="text-gray-500">Dirección:</span> {formData.address || "No especificado"}
            </p>
          </div>
        </section>

        {/* Disponibilidad */}
        {!!formData.disponibilidades?.length && (
          <section className="rounded-xl border border-[#DCD6C9] bg-white p-4">
            <h3 className="text-base font-semibold text-[#708C3E] mb-3">Disponibilidad</h3>
            <div className="space-y-3">
              {formData.disponibilidades.map((disp: any, idx: number) => (
                <div key={idx} className="rounded-lg border border-[#DCD6C9] bg-[#FAF9F5] p-3 text-sm">
                  <p><span className="text-gray-500">Periodo:</span> {disp.fechaInicio} - {disp.fechaFin}</p>
                  <p><span className="text-gray-500">Días:</span> {disp.dias?.join(", ") || "No especificado"}</p>
                  <p><span className="text-gray-500">Horarios:</span> {disp.horarios?.join(", ") || "No especificado"}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Áreas de interés */}
        {!!formData.areasInteres?.length && (
          <section className="rounded-xl border border-[#DCD6C9] bg-white p-4">
            <h3 className="text-base font-semibold text-[#708C3E] mb-3">Áreas de Interés</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {formData.areasInteres.map((area: any, idx: number) => (
                <li key={idx} className="text-gray-700">
                  {typeof area === "string" ? area : area.nombreArea}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Experiencia / Motivación / Habilidades */}
        <section className="rounded-xl border border-[#DCD6C9] bg-white p-4">
          <h3 className="text-base font-semibold text-[#708C3E] mb-3">
            Experiencia, Motivación y Habilidades
          </h3>

          <div className="space-y-3">
            <div className="rounded-lg border border-[#DCD6C9] bg-[#FAF9F5] p-3 text-sm">
              <p className="text-gray-500 font-medium">Experiencia Previa:</p>
              <p className="text-gray-700 mt-1">{formData.previousExperience || "No especificado"}</p>
            </div>

            <div className="rounded-lg border border-[#DCD6C9] bg-[#FAF9F5] p-3 text-sm">
              <p className="text-gray-500 font-medium">Motivación:</p>
              <p className="text-gray-700 mt-1">{formData.motivation || "No especificado"}</p>
            </div>

            <div className="rounded-lg border border-[#DCD6C9] bg-[#FAF9F5] p-3 text-sm">
              <p className="text-gray-500 font-medium">Habilidades:</p>
              <p className="text-gray-700 mt-1">{formData.volunteeringType || "No especificado"}</p>
            </div>
          </div>
        </section>

        {/* Documentos */}
      <section className="rounded-xl border border-[#DCD6C9] bg-white p-4">
        <h3 className="text-base font-semibold text-[#708C3E] mb-3">Documentos Adjuntos</h3>

        <div className="space-y-2 text-sm">
          <p>
            <span className="text-gray-500">Cédula:</span>{" "}
            {files?.cedula ? (
              <span className="text-green-700">✓ {files.cedula.name}</span>
            ) : (
              <span className="text-red-600">✗ No adjuntado</span>
            )}
          </p>

          <p>
            <span className="text-gray-500">Currículum Vitae (CV):</span>{" "}
            {files?.cv ? (
              <span className="text-green-700">✓ {files.cv.name}</span>
            ) : (
              <span className="text-red-600">✗ No adjuntado</span>
            )}
          </p>

          <p>
            <span className="text-gray-500">Carta de recomendación:</span>{" "}
            {files?.carta ? (
              <span className="text-green-700">✓ {files.carta.name}</span>
            ) : (
              <span className="text-red-600">✗ No adjuntado</span>
            )}
          </p>
        </div>
      </section>

        {/* Términos + submit */}
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
