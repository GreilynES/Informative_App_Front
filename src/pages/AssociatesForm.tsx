import React from "react"
import { useState } from "react"
import { Award, CheckCircle, Download, FileText, Heart, Upload, Users } from "lucide-react"
import { initialAssociatesFormData, type AssociatesFormData } from "../models/AssociatesType"
import { useCedulaLookup } from "../hooks/IdApiHook"

export default function AssociatesForm() {
  const [formData, setFormData] = useState<AssociatesFormData>(initialAssociatesFormData)
  const [] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { lookup } = useCedulaLookup()

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


  const handleInputChange = (field: keyof AssociatesFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7EC] via-[#EEF4D8] to-[#E7EDC8]">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#F5F7EC] via-[#EEF4D8] to-[#E7EDC8] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#475C1D]/80 mb-6">¿Por qué ser asociado en la Cámara de Ganaderos?</h1>
          <p className="text-lg text-[#2E321B] max-w-3xl mx-auto">
            Ser asociado te permite impulsar el crecimiento del sector ganadero local, fortalecer el desarrollo
            sostenible de la comunidad y formar parte activa de iniciativas que promueven el bienestar del agro y el
            medio ambiente.
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
                icon: <Users className="w-8 h-8 text-[#A3853D]" />,
                title: "Red de Contactos",
                desc: "Forma parte de una comunidad ganadera sólida que promueve la cooperación y el crecimiento conjunto.",
              },
              {
                icon: <Heart className="w-8 h-8 text-[#A3853D]" />,
                title: "Apoyo Técnico y Legal",
                desc: "Accede a orientación especializada en temas agropecuarios, legales y administrativos.",
              },
              {
                icon: <Award className="w-8 h-8 text-[#A3853D]" />,
                title: "Oportunidades Exclusivas",
                desc: "Participa en programas, proyectos y ferias organizadas por la Cámara de Ganaderos.",
              },
            ].map((item, i) => (
              <div className="text-center" key={i}>
                <div className="w-16 h-16 bg-[#E7EDC8]/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#708C3E] mb-3">{item.title}</h3>
                <p className="text-[#475C1D]/90">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div className="bg-white/80 rounded-xl p-8 shadow-md border border-[#DCD6C9]">
            <h2 className="text-3xl font-bold text-[#708C3E] text-center mb-8">Requisitos</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Autorizar el uso de datos y participación en actividades de la Cámara",
                "Contar con una finca registrada con información técnica básica",
                "Llenar y entregar el formulario de Diagnóstico de Finca",
                "Disposición para participar en programas de capacitación",
                "Compromiso con prácticas sostenibles y el desarrollo rural",
                "Ser productor ganadero activo",
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
                className="bg-gradient-to-r from-[#6F8C1F] to-[#475C1D] hover:from-[#5d741c] hover:to-[#384c17] text-white rounded-md font-medium px-6 py-3 text-lg transition"
              >
                Desplegar formulario
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Form */}
      {showForm && (
        <div className="py-16 px-4 bg-gradient-to-br from-[#F5F7EC] via-[#EEF4D8] to-[#E7EDC8]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-[#708C3E] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#475C1D]/80 mb-4">¡Únete como asociado!</h2>
              <p className="text-[#2E321B]">
                Completa este formulario y forma parte activa de nuestra comunidad ganadera.
              </p>
            </div>

            {/* Documento para descargar */}
            <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow-md mb-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <h2 className="text-xl font-semibold text-[#708C3E]">
                Formulario Diagnóstico de Finca
              </h2>
            </div>

            <p className="text-[#2E321B] text-md mb-4 mx-auto">
              Descarga el formulario oficial, complétalo y súbelo firmado en la sección de documentos.
            </p>

            <div className="flex justify-center">
              <a
                href="/Docs/Diagnóstico_de_Finca.docx"
                download
                className="inline-flex items-center gap-2 bg-[#708C3E] hover:bg-[#5d7334] text-white px-6 py-2 rounded-md text-md font-semibold transition"
              >
                <Download className="w-4 h-4" />
                Descargar 
              </a>
            </div>
          </div>
{/* Stepper visual superior */}
<div className="flex justify-center items-center gap-4 mb-10">
  {[1, 2, 3, 4, 5].map((s, index) => (
    < >
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full border-2 text-sm font-bold flex items-center justify-center transition duration-200 ${
            step === s
              ? "bg-[#708C3E] text-white border-[#708C3E]"
              : step > s
              ? "bg-[#A3853D] text-white border-[#A3853D]"
              : "bg-white text-[#708C3E] border-[#DCD6C9]"
          }`}
        >
          {s}
        </div>
        <span
          className={`text-xs mt-1 ${
            step === s
              ? "text-[#708C3E] font-medium"
              : step > s
              ? "text-[#A3853D]"
              : "text-gray-400"
          }`}
        >
          Paso {s}
        </span>
      </div>

      {/* Línea entre pasos */}
      {index < 4 && (
        <div className="w-8 h-px bg-[#DCD6C9]"></div>
      )}
    </>
  ))}
</div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Información Personal */}
                {step === 1 && (
                  <>
              <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
                <div className="px-6 py-4 border-b border-[#DCD6C9]">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <h3 className="text-lg font-semibold text-[#708C3E]">Información Personal</h3>
                  </div>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none 
                          focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
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
                        id="lastname1id"
                        type="text"
                        placeholder="Tu primer apellido"
                        value={formData.lastName1}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido *</label>
                      <input
                        id="lastname2id"
                        type="text"
                        placeholder="Tu segundo apellido"
                        value={formData.lastName2}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
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
                    <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <h3 className="text-lg font-semibold text-[#708C3E]">Información de Contacto</h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="telefono" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                        Teléfono *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="Número de teléfono"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none 
                        focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                        Email *
                      </label>
                      <input
                        id="email"
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
                    <label htmlFor="direccion" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      Dirección Completa
                    </label>
                    <input
                      id="addressid"
                      type="text"
                      placeholder="Tu dirección completa"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="comunidad" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      Comunidad *
                    </label>
                    <input
                      id="communityid"
                      type="text"
                      placeholder="Tu comunidad"
                      value={formData.community}
                      onChange={(e) => handleInputChange("community", e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
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

              {/* Información de la Finca */}
               

              {/* Información de Asociado */}
              {step === 3 && (
              <>
              <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
                <div className="px-6 py-4 border-b border-[#DCD6C9]">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <h3 className="text-lg font-semibold text-[#708C3E]">Información de Asociado</h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label htmlFor="necesidades" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      Necesidades (opcional)
                    </label>
                    <textarea
                      id="needsid"
                      placeholder="¿Cuáles son tus principales necesidades o retos actuales como productor ganadero?"
                      value={formData.needs}
                      onChange={(e) => handleInputChange("needs", e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
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
                    {/* Copia de Cédula */}
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Copia de Cédula *</label>
                      <div className="border-2 border-dashed border-[#B0B09C] rounded-lg p-6 text-center hover:border-[#A3853D] transition-colors cursor-pointer bg-white">
                        <Upload className="w-8 h-8 text-[#708C3E] mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Haz clic para subir o arrastra el archivo</p>
                        <p className="text-xs text-gray-500">PDF, JPG, PNG hasta 5MB</p>
                      </div>
                    </div>
                    {/* Diagnóstico de Finca */}
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                        Formulario Diagnóstico de Finca *
                      </label>
                      <div className="border-2 border-dashed border-[#B0B09C] rounded-lg p-6 text-center hover:border-[#A3853D] transition-colors cursor-pointer bg-white">
                        <Upload className="w-8 h-8 text-[#708C3E] mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Haz clic para subir o arrastra el archivo</p>
                        <p className="text-xs text-gray-500">PDF, JPG, PNG hasta 5MB</p>
                      </div>
                    </div>
                    {/* Comprobante de Pago */}
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Comprobante de Pago *</label>
                      <div className="border-2 border-dashed border-[#B0B09C] rounded-lg p-6 text-center hover:border-[#A3853D] transition-colors cursor-pointer bg-white">
                        <Upload className="w-8 h-8 text-[#708C3E] mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Haz clic para subir o arrastra el archivo</p>
                        <p className="text-xs text-gray-500">PDF, JPG, PNG hasta 5MB</p>
                      </div>
                    </div>
                    {/* Copia del Plano de la Finca */}
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                        Copia del Plano de la Finca *
                      </label>
                      <div className="border-2 border-dashed border-[#B0B09C] rounded-lg p-6 text-center hover:border-[#A3853D] transition-colors cursor-pointer bg-white">
                        <Upload className="w-8 h-8 text-[#708C3E] mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Haz clic para subir o arrastra el archivo</p>
                        <p className="text-xs text-gray-500">PDF, JPG, PNG hasta 5MB</p>
                      </div>
                    </div>
                  </div>
                  {/* Otros Documentos */}
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                      Otros Documentos que Considere Necesarios (opcional)
                    </label>
                    <div className="border-2 border-dashed border-[#B0B09C] rounded-lg p-8 text-center hover:border-[#A3853D] transition-colors cursor-pointer bg-white">
                      <FileText className="w-12 h-12 text-[#708C3E] mx-auto mb-3" />
                      <p className="text-gray-600 mb-1">Haz clic para subir o arrastra el archivo</p>
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
                  className="bg-[#708C3E] text-white px-6 py-2 rounded-md"
                >
                  Siguiente
                </button>
              </div>
              </>
                )}

            {step === 5 && (
              <>
              <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow-md mb-8">
                <h2 className="text-3xl font-bold text-[#708C3E] text-center">Confirmación de Solicitud</h2>

                <div className="space-y-6 text-[#4A4A4A]">
                  <div>
                    <h3 className="text-lg font-semibold text-[#708C3E]">Datos Personales</h3>
                    <p><span className="text-center text-sm text-gray-500">Nombre:</span> {formData.name}</p>
                    <p><span className="text-center text-sm text-gray-500">Primer Apellido:</span> {formData.lastName1}</p>
                    <p><span className="text-center text-sm text-gray-500">Segundo Apellido:</span> {formData.lastName2}</p>
                    <p><span className="text-center text-sm text-gray-500">Cédula:</span> {formData.idNumber}</p>
                    <p><span className="text-center text-sm text-gray-500">Fecha de Nacimiento:</span> {formData.birthDate}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#708C3E]">Contacto</h3>
                    <p><span className="text-center text-sm text-gray-500">Teléfono:</span> {formData.phone}</p>
                    <p><span className="text-center text-sm text-gray-500">Email:</span> {formData.email}</p>
                    <p><span className="text-center text-sm text-gray-500">Dirección:</span> {formData.address}</p>
                    <p><span className="text-center text-sm text-gray-500">Comunidad:</span> {formData.community}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#708C3E]">Información Adicional</h3>
                    <p><span className="text-center text-sm text-gray-500">Necesidades:</span> {formData.needs || "No especificado"}</p>
                    <p><span className="text-center text-sm text-gray-500">Acepta Términos:</span> {formData.acceptTerms ? "Sí" : "No"}</p>
                    <p><span className="text-center text-sm text-gray-500">Recibir Información:</span> {formData.receiveInfo ? "Sí" : "No"}</p>
                  </div>
                </div>
                <div className="flex justify-center gap-6 mt-6">
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
                      Acepto los{" "}
                      <a href="#" className="text-[#A3853D] underline">
                        términos y condiciones
                      </a>{" "}
                      y autorizo el tratamiento de mis datos.
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
                  </div >
              <div className="flex flex-col items-center gap-4 pt-6">
          {/* Contenedor horizontal para los botones */}
          <div className="flex flex-col md:flex-row gap-5">
            {/* Botón Volver */}
            <button
              type="button"
            onClick={prevStep}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg shadow transition-all duration-200 w-full md:w-auto"
          >
            ← Volver al formulario
          </button>

          {/* Botón Enviar */}
          <button
            type="submit"
            disabled={!formData.acceptTerms}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white text-lg shadow transition-colors duration-200
              ${
                formData.acceptTerms
                  ? "bg-[#708C3E] hover:bg-[#5d7334]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            <Users className="w-5 h-5" />
            Enviar Solicitud de Asociado
          </button>
        </div>

        {/* Texto debajo */}
        <p className="text-sm text-gray-500 mt-2 text-center">
          Nos pondremos en contacto contigo en un plazo de 3-5 días hábiles
        </p>
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
