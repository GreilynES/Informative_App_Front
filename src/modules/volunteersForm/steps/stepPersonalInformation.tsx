import type { VolunteersFormData } from "../../volunteersInformation/models/VolunteersType"
import { UserRound, Mail } from "lucide-react" 
import { NavigationButtons } from "../components/NavigationButtons"

interface StepPersonalInformationProps {
  formData: VolunteersFormData
  handleInputChange: (field: keyof VolunteersFormData, value: string | boolean) => void
  onNextCombined: () => void
  isStepValid: () => boolean
  lookup: (id: string) => Promise<any>
}

export function StepPersonalInformation({
  formData,
  handleInputChange,
  onNextCombined,
  isStepValid,
  lookup,
}: StepPersonalInformationProps) {
  return (
    <div className="space-y-8">{/* separa visualmente las tarjetas */}
      {/* ───────── Tarjeta 1: Información Personal ───────── */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <UserRound className="w-5 h-5 text-white" />
          </div>
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
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento *
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
            />
          </div>
        </div>
      </div>

      {/* ───────── Tarjeta 2: Información de Contacto ───────── */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
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
        </div>
      </div>

      <div className="text-right">
        <NavigationButtons
          showPrev={false}
          onNext={onNextCombined}
          disableNext={!isStepValid()}
        />
      </div>
    </div>
  )
}
