import { NavigationButtons } from "./NavigationButtons"
import type { VolunteersFormData } from "../../models/VolunteersType"

interface StepsProps {
  step: number
  formData: VolunteersFormData
  setFormData: (data: VolunteersFormData) => void
  handleInputChange: (field: keyof VolunteersFormData, value: string | boolean) => void
  nextStep: () => void
  prevStep: () => void
  isStepValid: () => boolean
  lookup: (id: string) => Promise<any>
}

export function Steps({
  step,
  formData,
  handleInputChange,
  nextStep,
  prevStep,
  isStepValid,
  lookup,
}: StepsProps) {
  return (
    <>
      {/* Paso 1: Información Personal */}
      {step === 1 && (
        <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
          <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
            <h3 className="text-lg font-semibold text-[#708C3E]">Información Personal</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Cédula *
                </label>
                <input
                  id="idNumber"
                  type="text"
                  placeholder="Número de cédula"
                  value={formData.idNumber}
                  onChange={async (e) => {
                    const value = e.target.value
                    handleInputChange("idNumber", value)
                    if (value.length >= 9) {
                      const result = await lookup(value)
                      if (result) {
                        handleInputChange("name", result.firstname || "")
                        handleInputChange("lastName1", result.lastname1 || "")
                        handleInputChange("lastName2", result.lastname2 || "")
                      }
                    }
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                />
              </div>
              <div>
                <label htmlFor="nameId" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  id="nameId"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label>
                <input
                  type="text"
                  placeholder="Tu primer apellido"
                  value={formData.lastName1}
                  onChange={(e) => handleInputChange("lastName1", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido *</label>
                <input
                  type="text"
                  placeholder="Tu segundo apellido"
                  value={formData.lastName2}
                  onChange={(e) => handleInputChange("lastName2", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                />
              </div>
            </div>
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>
          </div>
          <NavigationButtons
            showPrev={false}
            onNext={nextStep}
            disableNext={!isStepValid()}
          />
        </div>
      )}

      {/* Paso 2: Información de Contacto */}
      {step === 2 && (
        <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
          <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
            <h3 className="text-lg font-semibold text-[#708C3E]">Información de Contacto</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#4A4A4A] mb-1">Teléfono *</label>
                <input
                  type="tel"
                  placeholder="Número de teléfono"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4A4A4A] mb-1">Email *</label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                />
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-[#4A4A4A] mb-1">Dirección Completa</label>
              <input
                type="text"
                placeholder="Tu dirección completa"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>
            <div>
              <label htmlFor="community" className="block text-sm font-medium text-[#4A4A4A] mb-1">Comunidad *</label>
              <input
                type="text"
                placeholder="Tu comunidad"
                value={formData.community}
                onChange={(e) => handleInputChange("community", e.target.value)}
                required
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>
          </div>
          <NavigationButtons
            onPrev={prevStep}
            onNext={nextStep}
            disableNext={!isStepValid()}
          />
        </div>
      )}

      {/* Paso 3: Información de Voluntariado */}
      {step === 3 && (
        <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
          <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
            <h3 className="text-lg font-semibold text-[#708C3E]">Información de Voluntariado</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Tipo de Voluntariado *</label>
                <input
                  type="text"
                  placeholder="Ej: Eventos, Logística, Campo..."
                  value={formData.volunteeringType}
                  onChange={(e) => handleInputChange("volunteeringType", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Disponibilidad *</label>
                <input
                  type="text"
                  placeholder="Días/Horas disponibles"
                  value={formData.availability}
                  onChange={(e) => handleInputChange("availability", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Experiencia Previa</label>
              <textarea
                placeholder="Describe brevemente tu experiencia como voluntario/a (opcional)"
                value={formData.previousExperience}
                onChange={(e) => handleInputChange("previousExperience", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Motivación</label>
              <textarea
                placeholder="¿Por qué te gustaría ser voluntario/a?"
                value={formData.motivation}
                onChange={(e) => handleInputChange("motivation", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>

            <div className="space-y-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
                  className="rounded border-[#CFCFCF] text-[#708C3E] focus:ring-[#6F8C1F]"
                />
                <span className="text-sm text-[#4A4A4A]">Acepto términos y condiciones *</span>
              </label>
              <label className="inline-flex items-center gap-2 block">
                <input
                  type="checkbox"
                  checked={formData.receiveInfo}
                  onChange={(e) => handleInputChange("receiveInfo", e.target.checked)}
                  className="rounded border-[#CFCFCF] text-[#708C3E] focus:ring-[#6F8C1F]"
                />
                <span className="text-sm text-[#4A4A4A]">Deseo recibir información y noticias</span>
              </label>
            </div>
          </div>
          <NavigationButtons
            onPrev={prevStep}
            onNext={nextStep}
            disableNext={!isStepValid()}
          />
        </div>
      )}

      {/* Paso 4: Confirmación */}
      {step === 4 && (
        <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow-md mb-8">
          <h2 className="text-3xl font-bold text-[#708C3E] text-center">Confirmación de Solicitud</h2>

          <div className="space-y-6 text-[#4A4A4A] mt-6">
            <div>
              <h3 className="text-lg font-semibold text-[#708C3E]">Datos Personales</h3>
              <p><span className="text-sm text-gray-500">Nombre:</span> {formData.name}</p>
              <p><span className="text-sm text-gray-500">Primer Apellido:</span> {formData.lastName1}</p>
              <p><span className="text-sm text-gray-500">Segundo Apellido:</span> {formData.lastName2}</p>
              <p><span className="text-sm text-gray-500">Cédula:</span> {formData.idNumber}</p>
              <p><span className="text-sm text-gray-500">Fecha de Nacimiento:</span> {formData.birthDate}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#708C3E]">Contacto</h3>
              <p><span className="text-sm text-gray-500">Teléfono:</span> {formData.phone}</p>
              <p><span className="text-sm text-gray-500">Email:</span> {formData.email}</p>
              <p><span className="text-sm text-gray-500">Dirección:</span> {formData.address || "No especificado"}</p>
              <p><span className="text-sm text-gray-500">Comunidad:</span> {formData.community}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#708C3E]">Voluntariado</h3>
              <p><span className="text-sm text-gray-500">Tipo de Voluntariado:</span> {formData.volunteeringType}</p>
              <p><span className="text-sm text-gray-500">Disponibilidad:</span> {formData.availability}</p>
              <p><span className="text-sm text-gray-500">Experiencia Previa:</span> {formData.previousExperience || "No especificado"}</p>
              <p><span className="text-sm text-gray-500">Motivación:</span> {formData.motivation || "No especificado"}</p>
              <p><span className="text-sm text-gray-500">Acepta Términos:</span> {formData.acceptTerms ? "Sí" : "No"}</p>
              <p><span className="text-sm text-gray-500">Recibir Información:</span> {formData.receiveInfo ? "Sí" : "No"}</p>
            </div>
          </div>

          <div className="text-center mt-6">
            <NavigationButtons
              onPrev={prevStep}
              showNext={false}
            />
          </div>
        </div>
      )}
    </>
  )
}
