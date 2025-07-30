import { useState } from "react"
import {
  Users,
  Heart,
  Award,
  CheckCircle,
  Upload,
  FileText,
  ChevronDown,
} from "lucide-react"
import { initialVolunteerFormData, type VolunteerFormData } from "../models/VolunteersType"
import { useCedulaLookup } from "../hooks/IdApiHook"



export default function VolunteerForm() {
  const [formData, setFormData] = useState<VolunteerFormData>(initialVolunteerFormData)
  const [openSelect, setOpenSelect] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
   const { lookup, isLoading, error } = useCedulaLookup()

   const [step, setStep] = useState(1)
   
     const isStepValid = () => {
       if (step === 1) {
         return (
           formData.idNumber.trim() !== "" &&
           formData.name.trim() !== "" &&
           formData.lastName1.trim() !== "" &&
           formData.lastName1.trim() !== "" &&
           formData.birthDate.trim() !== ""
         )
       }
       if (step === 2) {
         return (
           formData.phone.trim() !== "" &&
           formData.email.trim() !== "" &&
           formData.community.trim() !== ""
         )
       }
       return true // El paso 3 y 4 no son obligatorios para avanzar
     }
   
     const nextStep = () => setStep((prev) => prev + 1)
     const prevStep = () => setStep((prev) => Math.max(1, prev - 1))

const handleInputChange = (field: keyof VolunteerFormData, value: string | boolean) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const SelectField = ({
    value,
    onChange,
    placeholder,
    options,
    name,
  }: {
    value: string
    onChange: (value: string) => void
    placeholder: string
    options: { value: string; label: string }[]
    name: string
  }) => (
      <div className="relative">
    <button
      type="button"
      className="w-full px-3 py-2 text-left bg-[#FAF9F5] border border-[#DAD6C2] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#708C3E] focus:border-[#708C3E] flex items-center justify-between transition-colors"
      onClick={() => setOpenSelect(openSelect === name ? null : name)}
    >
      <span className={value ? "text-[#404040]" : "text-[#A3853D]"}>
        {value ? options.find((opt) => opt.value === value)?.label : placeholder}
      </span>
      <ChevronDown className="w-4 h-4 text-[#A3853D]" />
    </button>

    {openSelect === name && (
      <div className="absolute z-10 w-full mt-1 bg-white border border-[#DAD6C2] rounded-md shadow-lg">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="w-full px-3 py-2 text-left hover:bg-[#F5F2E9] focus:bg-[#F0EDDD] text-[#404040] focus:outline-none transition-colors"
            onClick={() => {
              onChange(option.value)
              setOpenSelect(null)
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    )}
  </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7EC] via-[#EEF4D8] to-[#E7EDC8]">
      {/* Header Section */}
      <div className="bg-[#F5F7EC] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#708C3E] mb-6">
            ¿Por qué ser voluntario en la Cámara de Ganaderos?
          </h1>
          <p className="text-lg text-[#7A7A6A] max-w-3xl mx-auto">
            Ser voluntario te permite apoyar al sector ganadero local, contribuir con el desarrollo sostenible de
            la comunidad y adquirir experiencia valiosa relacionada con el agro y el medio ambiente.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16 px-4 bg-[#FAF9F5]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#708C3E] text-center mb-12">Beneficios</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Users className="w-8 h-8 text-[#708C3E]" />,
                title: "Experiencia Práctica",
                desc: "Capacitación gratuita en manejo ganadero, sostenibilidad y técnicas legales.",
              },
              {
                icon: <Heart className="w-8 h-8 text-[#A3853D]" />,
                title: "Impacto Social",
                desc: "Contribuye al desarrollo de tu comunidad y al sector agropecuario local.",
              },
              {
                icon: <Award className="w-8 h-8 text-[#A3853D]" />,
                title: "Certificación",
                desc: "Participación en ferias, programas y proyectos especiales con reconocimiento.",
              },
            ].map((item, i) => (
              <div className="text-center" key={i}>
                <div className="w-16 h-16 bg-[#EEF4D8] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#708C3E] mb-3">{item.title}</h3>
                <p className="text-[#7A7A6A]">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div className="bg-white/80 rounded-xl p-8 shadow-md border border-[#DCD6C9]">
            <h2 className="text-3xl font-bold text-[#708C3E] text-center mb-8">Requisitos</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Tener interés en colaborar con la comunidad y el sector ganadero",
                "Presentar referencias personales o comerciales",
                "Disponibilidad de tiempo para participar en actividades",
                "Copia del documento de identidad vigente",
                "Compromiso con los valores de sostenibilidad y desarrollo rural",
                "Participar en la orientación inicial del programa",
              ].map((req, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#708C3E] mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{req}</p>
                </div>
              ))}
            </div>
          </div>

           {!showForm && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#708C3E] hover:bg-[#5d7334] text-white px-6 py-3 rounded-md text-lg font-medium transition"
              >
                Desplegar formulario
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        
      <div className="py-16 px-4 bg-[#F5F7EC]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[#708C3E] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#708C3E] mb-4">¡Únete a Nuestro Equipo!</h2>
          <p className="text-[#6B705C]">
            Completa este formulario y comienza tu aventura como voluntario en la Cámara de Ganaderos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
  
  {/* Información Personal */}
  {step === 1 && (
    <>
      <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
            <h3 className="text-lg font-semibold text-[#708C3E]">Información Personal</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-1">
                          Cédula *
                        </label>
                        <input
                          id="cedula"
                          type="text"
                          placeholder="Número de cédula"
                          value={formData.idNumber}
                         onChange={async (e) => {
                            const value = e.target.value
                            handleInputChange("idNumber", value)

                            if (value.length >= 9) {
                              const result = await lookup(value)
                              if (result) {
                                setFormData(prev => ({
                                  ...prev,
                                  name: result.firstname || "",
                                  lastName1: result.lastname1 || "",
                                  lastName2: result.lastname2 || "",
                                }))
                              }
                            }
                          }}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label>
                      <input
                        id="lastname1id"
                        type="text"
                        placeholder="Tu primer apellido"
                        value={formData.lastName1}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido *</label>
                      <input
                        id="lastname2id"
                        type="text"
                        placeholder="Tu segundo apellido"
                        value={formData.lastName2}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                  </div>
                  <div>
                       <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Nacimiento *
                      </label>
                      <input
                        id="birdthdateid"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange("birthDate", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                </div>
      </div>
      <div className="text-right">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="bg-[#708C3E] text-white px-6 py-2 rounded-md"
                >
                  Siguiente
                </button>
              </div>
      </>
  )}

  {/* Información de Contacto */}
    {step === 2 && (
                <>
      <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
  <div className="px-6 py-4 border-b border-[#DCD6C9]">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
      <h3 className="text-lg font-semibold text-[#708C3E]">Información de Contacto</h3>
    </div>
  </div>
  <div className="p-6 space-y-4">
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="telefono" className="block text-sm font-medium text-[#4A4A4A] mb-1">Teléfono *</label>
        <input
          id="telefono"
          type="tel"
          placeholder="Número de teléfono"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          required
          className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A3853D] focus:border-[#A3853D]"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#4A4A4A] mb-1">Email *</label>
        <input
          id="email"
          type="email"
          placeholder="correo@ejemplo.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
          className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A3853D] focus:border-[#A3853D]"
        />
      </div>
    </div>
    <div>
      <label htmlFor="direccion" className="block text-sm font-medium text-[#4A4A4A] mb-1">Dirección Completa</label>
      <input
        id="direccion"
        type="text"
        placeholder="Tu dirección completa"
        value={formData.address}
        onChange={(e) => handleInputChange("address", e.target.value)}
        className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A3853D] focus:border-[#A3853D]"
      />
    </div>
    <div>
      <label htmlFor="comunidad" className="block text-sm font-medium text-[#4A4A4A] mb-1">Comunidad *</label>
      <input
        id="comunidad"
        type="text"
        placeholder="Tu comunidad"
        value={formData.community}
        onChange={(e) => handleInputChange("community", e.target.value)}
        required
        className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A3853D] focus:border-[#A3853D]"
      />
    </div>
  </div>
</div>
<div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                   className="bg-[#708C3E] text-white px-6 py-2 rounded-md"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                    disabled={!isStepValid()}
                  className="bg-[#708C3E] text-white px-6 py-2 rounded-md"
                >
                  Siguiente
                </button>
              </div>
</>
)}


  {/* Información de Voluntariado */}
  {step === 3 && (
    <>
<div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
  <div className="px-6 py-4 border-b border-[#DCD6C9]">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
      <h3 className="text-lg font-semibold text-[#708C3E]">Información de Voluntariado</h3>
    </div>
  </div>
  <div className="p-6 space-y-4">
    <div>
      <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Tipo de Voluntariado *</label>
      <SelectField
        value={formData.volunteeringType}
        onChange={(value) => handleInputChange("volunteeringType", value)}
        placeholder="Selecciona el tipo de voluntariado que te interesa"
        name="tipoVoluntariado"
        options={[
          { value: "capacitacion", label: "Capacitación y Educación" },
          { value: "campo", label: "Trabajo de Campo" },
          { value: "eventos", label: "Organización de Eventos" },
          { value: "administrativo", label: "Apoyo Administrativo" },
          { value: "investigacion", label: "Investigación" },
        ]}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Disponibilidad de Tiempo</label>
      <SelectField
        value={formData.availability}
        onChange={(value) => handleInputChange("availability", value)}
        placeholder="¿Cuánto tiempo puedes dedicar?"
        name="disponibilidad"
        options={[
          { value: "pocas-horas", label: "Pocas horas por semana" },
          { value: "medio-tiempo", label: "Medio tiempo" },
          { value: "tiempo-completo", label: "Tiempo completo" },
          { value: "fines-semana", label: "Solo fines de semana" },
          { value: "flexible", label: "Horario flexible" },
        ]}
      />
    </div>
    <div>
      <label htmlFor="experienciaPrevia" className="block text-sm font-medium text-[#4A4A4A] mb-1">Experiencia Previa</label>
      <textarea
        id="experienciaPrevia"
        placeholder="Cuéntanos sobre tu experiencia previa..."
        value={formData.previousExperience}
        onChange={(e) => handleInputChange("previousExperience", e.target.value)}
        rows={4}
        className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#A3853D] focus:border-[#A3853D]"
      />
    </div>
    <div>
      <label htmlFor="motivacion" className="block text-sm font-medium text-[#4A4A4A] mb-1">Motivación *</label>
      <textarea
        id="motivacion"
        placeholder="¿Por qué quieres ser voluntario?"
        value={formData.motivation}
        onChange={(e) => handleInputChange("motivation", e.target.value)}
        required
        rows={4}
        className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#A3853D] focus:border-[#A3853D]"
      />
    </div>
  </div>
</div>
<div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                   className="bg-[#708C3E] text-white px-6 py-2 rounded-md"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                    disabled={!isStepValid()}
                  className="bg-[#708C3E] text-white px-6 py-2 rounded-md"
                >
                  Siguiente
                </button>
              </div>
</>
  )}


  {/* Documentos */}
   {step === 4 && (
                <>
<div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
  <div className="px-6 py-4 border-b border-[#DCD6C9]">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
        4
      </div>
      <h3 className="text-lg font-semibold text-[#708C3E]">Documentos</h3>
    </div>
  </div>
  <div className="p-6 space-y-6">
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Copia de Cédula *</label>
        <div className="border-2 border-dashed border-[#B0B09C] rounded-lg p-6 text-center hover:border-[#A3853D] transition-colors cursor-pointer bg-white">
          <Upload className="w-8 h-8 text-[#708C3E] mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Haz clic para subir o arrastra el archivo</p>
          <p className="text-xs text-gray-500">PDF, JPG, PNG hasta 5MB</p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Carta de Recomendación</label>
        <div className="border-2 border-dashed border-[#B0B09C] rounded-lg p-6 text-center hover:border-[#A3853D] transition-colors cursor-pointer bg-white">
          <Upload className="w-8 h-8 text-[#708C3E] mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Haz clic para subir o arrastra el archivo</p>
          <p className="text-xs text-gray-500">PDF, JPG, PNG hasta 5MB</p>
        </div>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Curriculum Vitae</label>
      <div className="border-2 border-dashed border-[#B0B09C] rounded-lg p-8 text-center hover:border-[#A3853D] transition-colors cursor-pointer bg-white">
        <FileText className="w-12 h-12 text-[#708C3E] mx-auto mb-3" />
        <p className="text-gray-600 mb-1">Haz clic para subir tu CV o arrastra el archivo</p>
        <p className="text-sm text-gray-500">PDF, DOC, DOCX hasta 10MB</p>
      </div>
    </div>
  </div>
</div>
<div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                   className="bg-[#708C3E] text-white px-6 py-2 rounded-md"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                    disabled={!isStepValid()}
                  className="bg-[#708C3E] text-white px-6 py-2 rounded-md"
                >
                  Siguiente
                </button>
              </div>
</>
  )}



 {/* Términos y botón */}
{step === 5 && (
  <>
    <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow-md mb-8">
      <h2 className="text-3xl font-bold text-[#708C3E] text-center">Confirmación de Solicitud</h2>

      <div className="space-y-6 text-[#4A4A4A] mt-6">
        {/* Datos Personales */}
        <div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Datos Personales</h3>
          <p><span className="text-sm text-gray-500">Nombre:</span> {formData.name}</p>
          <p><span className="text-sm text-gray-500">Primer Apellido:</span> {formData.lastName1}</p>
          <p><span className="text-sm text-gray-500">Segundo Apellido:</span> {formData.lastName2}</p>
          <p><span className="text-sm text-gray-500">Cédula:</span> {formData.idNumber}</p>
          <p><span className="text-sm text-gray-500">Fecha de Nacimiento:</span> {formData.birthDate}</p>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Contacto</h3>
          <p><span className="text-sm text-gray-500">Teléfono:</span> {formData.phone}</p>
          <p><span className="text-sm text-gray-500">Email:</span> {formData.email}</p>
          <p><span className="text-sm text-gray-500">Dirección:</span> {formData.address || "No especificado"}</p>
          <p><span className="text-sm text-gray-500">Comunidad:</span> {formData.community}</p>
        </div>

        {/* Voluntariado */}
        <div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Información de Voluntariado</h3>
          <p><span className="text-sm text-gray-500">Tipo:</span> {formData.volunteeringType || "No especificado"}</p>
          <p><span className="text-sm text-gray-500">Disponibilidad:</span> {formData.availability || "No especificado"}</p>
          <p><span className="text-sm text-gray-500">Experiencia Previa:</span> {formData.previousExperience || "No especificado"}</p>
          <p><span className="text-sm text-gray-500">Motivación:</span> {formData.motivation}</p>
        </div>

        {/* Términos */}
        <div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Términos</h3>
          <p><span className="text-sm text-gray-500">Acepta Términos:</span> {formData.acceptTerms ? "Sí" : "No"}</p>
          <p><span className="text-sm text-gray-500">Recibir Información:</span> {formData.receiveInfo ? "Sí" : "No"}</p>
        </div>
      </div>
    </div>

    {/* Términos y botón */}
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="p-6 space-y-4">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={formData.acceptTerms}
            onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
            className="mt-1 h-4 w-4 text-[#708C3E] border-gray-300 rounded focus:ring-[#A3853D]"
          />
          <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
            Acepto los <a href="#" className="text-[#A3853D] underline">términos y condiciones</a> y autorizo el tratamiento de mis datos.
          </label>
        </div>
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="info"
            checked={formData.receiveInfo}
            onChange={(e) => handleInputChange("receiveInfo", e.target.checked)}
            className="mt-1 h-4 w-4 text-[#708C3E] border-gray-300 rounded focus:ring-[#A3853D]"
          />
          <label htmlFor="info" className="text-sm text-gray-700">
            Deseo recibir información sobre eventos, capacitaciones y oportunidades.
          </label>
        </div>
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={prevStep}
            className="bg-red-600 text-white px-6 py-2 rounded-md"
          >
            Volver al formulario
          </button>
          <div>
            <button
              type="submit"
              disabled={!formData.acceptTerms}
              className="w-full bg-[#708C3E] hover:bg-[#5d7334] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md text-lg font-medium transition-colors flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Enviar Solicitud de Voluntariado
            </button>
            <p className="text-center text-sm text-gray-500 mt-2">
              Nos pondremos en contacto contigo en un plazo de 3-5 días hábiles
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
)}
</form>
</div>

      </div>
        )}
    </div>
  )
}