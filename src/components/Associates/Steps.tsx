import { ClipboardList, Files, IdCard, Upload } from "lucide-react"
import { NavigationButtons } from "./NavigationButtons"
import type { AssociatesFormData } from "../../models/AssociatesType"

interface StepsProps {
  step: number
  formData: AssociatesFormData
  setFormData: (data: AssociatesFormData) => void
  handleInputChange: (field: keyof AssociatesFormData, value: string | boolean) => void
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

      {/* ⬇️ Pegar la parte 3 aquí: Paso 3 - Información de Asociado */}
            {/* Paso 3: Información de Asociado */}
      {step === 3 && (
        <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
          <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
            <h3 className="text-lg font-semibold text-[#708C3E]">Información de Asociado</h3>
          </div>
          <div className="p-6">
            <label htmlFor="needs" className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Necesidades (opcional)
            </label>
            <textarea
              placeholder="¿Cuáles son tus principales necesidades o retos actuales como productor ganadero?"
              value={formData.needs}
              onChange={(e) => handleInputChange("needs", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
            />
          </div>
          <NavigationButtons
            onPrev={prevStep}
            onNext={nextStep}
          />
        </div>
      )}

      {/* ⬇️ Pegar la parte 4 aquí: Paso 4 - Documentos */}
      {/* Paso 4: Documentos */}
      {step === 4 && (
        <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
          <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
            <h3 className="text-lg font-semibold text-[#708C3E]">Documentos</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: "Copia de Cédula", icon: <IdCard className="w-8 h-8 text-[#708C3E] mx-auto mb-2" /> },
                { label: "Formulario Diagnóstico de Finca", icon: <ClipboardList className="w-8 h-8 text-[#708C3E] mx-auto mb-2" /> },
                { label: "Copia del Plano de la Finca o Contrato de Arrendamiento", icon: <Files className="w-8 h-8 text-[#708C3E] mx-auto mb-2" /> },
                { label: "Otros Documentos que Considere Necesarios", icon: <Upload className="w-8 h-8 text-[#708C3E] mx-auto mb-2" /> },
              ].map(({ label, icon }, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-2">{label} *</label>
                  <div className="border-2 border-dashed border-[#B0B09C] rounded-lg p-6 text-center hover:border-[#A3853D] transition-colors cursor-pointer bg-white">
                    {icon}
                    <p className="text-sm text-gray-600 mb-1">Haz clic para subir o arrastra el archivo</p>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG hasta 5MB</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <NavigationButtons
            onPrev={prevStep}
            onNext={nextStep}
          />
        </div>
      )}

      {/* ⬇️ Pegar la parte 5 aquí: Paso 5 - Confirmación */}
           {/* Paso 5: Confirmación */}
      {step === 5 && (
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
              <p><span className="text-sm text-gray-500">Dirección:</span> {formData.address}</p>
              <p><span className="text-sm text-gray-500">Comunidad:</span> {formData.community}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#708C3E]">Información Adicional</h3>
              <p><span className="text-sm text-gray-500">Necesidades:</span> {formData.needs || "No especificado"}</p>
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
