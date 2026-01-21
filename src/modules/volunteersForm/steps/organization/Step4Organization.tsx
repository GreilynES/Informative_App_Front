
import { Button } from "@/components/ui/button"
import type { VolunteersFormData } from "@/modules/volunteersInformation/models/VolunteersType"
import { ArrowLeft } from "lucide-react"
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
  const { form, formData, files, goPrev, handleInputChange, submitIndividual, submitOrganizacion, onAfterSubmit } = props

  return (
    <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow-md mb-8">
      <h2 className="text-3xl font-bold text-[#708C3E] text-center mb-6">
        Confirmación de Solicitud - Organización
      </h2>

      <div className="space-y-6 text-[#4A4A4A]">
        <div>
          <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Datos de la Organización</h3>
          <div className="bg-white p-4 rounded-lg space-y-2">
            <p><span className="text-sm text-gray-500">Nombre:</span> {form.state.values.organizacion?.nombre || "N/A"}</p>
            <p><span className="text-sm text-gray-500">Cédula Jurídica:</span> {form.state.values.organizacion?.cedulaJuridica || "N/A"}</p>
            <p><span className="text-sm text-gray-500">Tipo:</span> {form.state.values.organizacion?.tipoOrganizacion || "N/A"}</p>
            <p><span className="text-sm text-gray-500">Email:</span> {form.state.values.organizacion?.email || "N/A"}</p>
            <p><span className="text-sm text-gray-500">Teléfono:</span> {form.state.values.organizacion?.telefono || "N/A"}</p>
            <p><span className="text-sm text-gray-500">Dirección:</span> {form.state.values.organizacion?.direccion || "N/A"}</p>
            <p><span className="text-sm text-gray-500">Número de Voluntarios:</span> {form.state.values.organizacion?.numeroVoluntarios || "N/A"}</p>
          </div>
        </div>

        {form.state.values.organizacion?.representante?.persona?.nombre && (
          <div>
            <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Representante</h3>
            <div className="bg-white p-4 rounded-lg space-y-2">
              <p>
                <span className="text-sm text-gray-500">Nombre:</span>{" "}
                {form.state.values.organizacion.representante.persona.nombre}{" "}
                {form.state.values.organizacion.representante.persona.apellido1}{" "}
                {form.state.values.organizacion.representante.persona.apellido2}
              </p>
              <p><span className="text-sm text-gray-500">Cédula:</span> {form.state.values.organizacion.representante.persona.cedula || "N/A"}</p>
              <p><span className="text-sm text-gray-500">Cargo:</span> {form.state.values.organizacion.representante.cargo || "N/A"}</p>
              <p><span className="text-sm text-gray-500">Email:</span> {form.state.values.organizacion.representante.persona.email || "N/A"}</p>
              <p><span className="text-sm text-gray-500">Teléfono:</span> {form.state.values.organizacion.representante.persona.telefono || "N/A"}</p>
            </div>
          </div>
        )}

        {!!form.state.values.organizacion?.disponibilidades?.length && (
          <div>
            <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Disponibilidad</h3>
            {form.state.values.organizacion.disponibilidades.map((disp: any, idx: number) => (
              <div key={idx} className="mb-3 bg-white p-3 rounded-lg">
                <p><span className="text-sm text-gray-500">Periodo:</span> {disp.fechaInicio} - {disp.fechaFin}</p>
                <p><span className="text-sm text-gray-500">Días:</span> {disp.dias?.join(", ") || "No especificado"}</p>
                <p><span className="text-sm text-gray-500">Horarios:</span> {disp.horarios?.join(", ") || "No especificado"}</p>
              </div>
            ))}
          </div>
        )}

        {!!form.state.values.organizacion?.areasInteres?.length && (
          <div>
            <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Áreas de Interés</h3>
            <ul className="list-disc list-inside bg-white p-3 rounded-lg">
              {form.state.values.organizacion.areasInteres.map((area: any, idx: number) => (
                <li key={idx} className="text-sm text-gray-700">
                  {typeof area === "string" ? area : area.nombreArea}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!!form.state.values.organizacion?.razonesSociales?.length && (
          <div>
            <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Razones Sociales</h3>
            <ul className="list-disc list-inside bg-white p-3 rounded-lg">
              {form.state.values.organizacion.razonesSociales.map((razon: any, idx: number) => (
                <li key={idx} className="text-sm text-gray-700">
                  {typeof razon === "string" ? razon : razon.razonSocial}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Documentos Adjuntos</h3>
          <div className="space-y-2 bg-white p-3 rounded-lg">
            <p className="text-sm">
              <span className="text-gray-500">Documento Legal:</span>{" "}
              {files?.cedula ? <span className="text-green-600">✓ {files.cedula.name}</span> : <span className="text-red-600">✗ No adjuntado</span>}
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Carta de Presentación:</span>{" "}
              {files?.carta ? <span className="text-green-600">✓ {files.carta.name}</span> : <span className="text-gray-500">Opcional - No adjuntado</span>}
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Documento Adicional:</span>{" "}
              {files?.carta ? <span className="text-green-600">✓ {files.carta.name}</span> : <span className="text-gray-500">Opcional - No adjuntado</span>}
            </p>
          </div>
        </div>
      </div>


      <div className="mt-6">
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
