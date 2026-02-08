import type { VolunteersFormData } from "@/modules/volunteersInformation/models/VolunteersType"
import { TermsAndSubmit } from "../../components/TermsAndSubmit"

export function Step4Organization(props: {
  form: any
  formData: VolunteersFormData
  files: any
  goPrev: () => void
  handleInputChange: (field: string, value: any) => void
  submitIndividual?: (data: any) => Promise<any>
  submitOrganizacion?: () => Promise<void>
  onAfterSubmit?: () => void
}) {
  const {
    form,
    formData,
    files,
    goPrev,
    handleInputChange,
    submitIndividual,
    submitOrganizacion,
    onAfterSubmit,
  } = props

  const org = form.state.values.organizacion

  return (
    <div className="bg-white border border-[#DCD6C9] rounded-xl shadow-md">
      <div className="px-6 py-4 border-b border-[#DCD6C9]">
        <h2 className="text-lg font-semibold text-[#708C3E]">
          Confirmación de Solicitud - Organización
        </h2>
        <p className="text-sm text-[#4A4A4A] mt-1">
          Revisa la información antes de enviar.
        </p>
      </div>

      <div className="p-6 space-y-6 text-[#4A4A4A]">
        {/* Datos organización */}
        <section className="rounded-xl border border-[#DCD6C9] bg-white p-4">
          <h3 className="text-base font-semibold text-[#708C3E] mb-3">Datos de la Organización</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <p><span className="text-gray-500">Nombre:</span> {org?.nombre || "N/A"}</p>
            <p><span className="text-gray-500">Cédula Jurídica:</span> {org?.cedulaJuridica || "N/A"}</p>
            <p><span className="text-gray-500">Tipo:</span> {org?.tipoOrganizacion || "N/A"}</p>
            <p><span className="text-gray-500">Email:</span> {org?.email || "N/A"}</p>
            <p><span className="text-gray-500">Teléfono:</span> {org?.telefono || "N/A"}</p>
            <p className="md:col-span-2">
              <span className="text-gray-500">Dirección:</span> {org?.direccion || "N/A"}
            </p>
            <p><span className="text-gray-500">Número de Voluntarios:</span> {org?.numeroVoluntarios || "N/A"}</p>
          </div>
        </section>

        {/* Representante */}
        {org?.representante?.persona?.nombre && (
          <section className="rounded-xl border border-[#DCD6C9] bg-white p-4">
            <h3 className="text-base font-semibold text-[#708C3E] mb-3">Representante</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <p className="md:col-span-2">
                <span className="text-gray-500">Nombre:</span>{" "}
                {org.representante.persona.nombre}{" "}
                {org.representante.persona.apellido1}{" "}
                {org.representante.persona.apellido2}
              </p>
              <p><span className="text-gray-500">Cédula:</span> {org.representante.persona.cedula || "N/A"}</p>
              <p><span className="text-gray-500">Cargo:</span> {org.representante.cargo || "N/A"}</p>
              <p><span className="text-gray-500">Email:</span> {org.representante.persona.email || "N/A"}</p>
              <p><span className="text-gray-500">Teléfono:</span> {org.representante.persona.telefono || "N/A"}</p>
            </div>
          </section>
        )}

        {/* Disponibilidad */}
        {!!org?.disponibilidades?.length && (
          <section className="rounded-xl border border-[#DCD6C9] bg-white p-4">
            <h3 className="text-base font-semibold text-[#708C3E] mb-3">Disponibilidad</h3>
            <div className="space-y-3">
              {org.disponibilidades.map((disp: any, idx: number) => (
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
        {!!org?.areasInteres?.length && (
          <section className="rounded-xl border border-[#DCD6C9] bg-white p-4">
            <h3 className="text-base font-semibold text-[#708C3E] mb-3">Áreas de Interés</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {org.areasInteres.map((area: any, idx: number) => (
                <li key={idx} className="text-gray-700">
                  {typeof area === "string" ? area : area.nombreArea}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Razones sociales */}
        {!!org?.razonesSociales?.length && (
          <section className="rounded-xl border border-[#DCD6C9] bg-white p-4">
            <h3 className="text-base font-semibold text-[#708C3E] mb-3">Razones Sociales</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {org.razonesSociales.map((razon: any, idx: number) => (
                <li key={idx} className="text-gray-700">
                  {typeof razon === "string" ? razon : razon.razonSocial}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Documentos */}
        {/* Documentos */}
        <section className="rounded-xl border border-[#DCD6C9] bg-white p-4">
          <h3 className="text-base font-semibold text-[#708C3E] mb-3">Documentos Adjuntos</h3>

          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-500">Documento legal:</span>{" "}
              {files?.cedula ? (
                <span className="text-green-700">✓ {files.cedula.name}</span>
              ) : (
                <span className="text-red-600">✗ No adjuntado</span>
              )}
            </p>

            <p>
              <span className="text-gray-500">Carta de motivación:</span>{" "}
              {files?.carta ? (
                <span className="text-green-700">✓ {files.carta.name}</span>
              ) : (
                <span className="text-red-600">✗ No adjuntado</span>
              )}
            </p>

            <p>
              <span className="text-gray-500">Documento adicional:</span>{" "}
              {files?.cv ? (
                <span className="text-green-700">✓ {files.cv.name}</span>
              ) : (
                <span className="text-gray-500">✗ No adjuntado</span>
              )}
            </p>
          </div>
        </section>

        {/* Términos + submit */}
        <TermsAndSubmit
          tipoSolicitante="ORGANIZACION"
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
