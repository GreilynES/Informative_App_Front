import type React from "react"
import { useState } from "react"
import { Award, CheckCircle, FileText, Heart, Upload, Users } from "lucide-react"
import { initialAssociatesFormData, type AssociatesFormData } from "../models/AssociatesForm"

export default function AssociatesForm() {
  const [formData, setFormData] = useState<AssociatesFormData>(initialAssociatesFormData)
  const [] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleInputChange = (field: keyof AssociatesFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7EC] via-[#EEF4D8] to-[#E7EDC8]">
      {/* Header Section */}
      <div className="bg-[#F5F7EC] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#708C3E] mb-6">¿Por qué ser asociado en la Cámara de Ganaderos?</h1>
          <p className="text-lg text-[#7A7A6A] max-w-3xl mx-auto">
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
                icon: <Users className="w-8 h-8 text-[#708C3E]" />,
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
                className="bg-[#708C3E] hover:bg-[#5d7334] text-white px-6 py-3 rounded-md text-lg font-medium transition"
              >
                Desplegar formulario
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="py-16 px-4 bg-[#F5F7EC]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-[#708C3E] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#708C3E] mb-4">¡Únete como asociado!</h2>
              <p className="text-[#6B705C]">
                Completa este formulario y forma parte activa de nuestra comunidad ganadera.
              </p>
            </div>

            {/* Documento para descargar */}
            <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow-md mb-8 text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <FileText className="w-6 h-6 text-[#708C3E]" />
                <h4 className="text-lg font-semibold text-[#708C3E]">Formulario Diagnóstico de Finca</h4>
              </div>
              <p className="text-[#7A7A6A] text-sm mb-4 max-w-xl mx-auto">
                Descarga el formulario oficial, complétalo y súbelo firmado en la sección de documentos.
              </p>
              <div className="flex justify-center">
                <a
                  href="/docs/Diagnóstico_de_Finca.docx"
                  download
                  className="inline-block bg-[#708C3E] hover:bg-[#5d7334] text-white px-6 py-2 rounded-md text-sm font-medium transition"
                >
                  Descargar Formulario Diagnóstico de Finca
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Información Personal */}
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
                      <label htmlFor="nombre" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                        Nombre *
                      </label>
                      <input
                        id="nombre"
                        type="text"
                        placeholder="Tu nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A3853D] focus:border-[#A3853D]"
                      />
                    </div>
                    <div>
                      <label htmlFor="apellidos" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                        Apellidos *
                      </label>
                      <input
                        id="apellidos"
                        type="text"
                        placeholder="Tus apellidos"
                        value={formData.apellidos}
                        onChange={(e) => handleInputChange("apellidos", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A3853D] focus:border-[#A3853D]"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cedula" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                        Cédula *
                      </label>
                      <input
                        id="cedula"
                        type="text"
                        placeholder="Número de cédula"
                        value={formData.cedula}
                        onChange={(e) => handleInputChange("cedula", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A3853D] focus:border-[#A3853D]"
                      />
                    </div>
                    <div>
                      <label htmlFor="edad" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                        Edad
                      </label>
                      <input
                        id="edad"
                        type="number"
                        placeholder="Tu edad"
                        value={formData.edad}
                        onChange={(e) => handleInputChange("edad", e.target.value)}
                        className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A3853D] focus:border-[#A3853D]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
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
                        id="telefono"
                        type="tel"
                        placeholder="Número de teléfono"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A3853D] focus:border-[#A3853D]"
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
                        className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A3853D] focus:border-[#A3853D]"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="direccion" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      Dirección Completa
                    </label>
                    <input
                      id="direccion"
                      type="text"
                      placeholder="Tu dirección completa"
                      value={formData.direccion}
                      onChange={(e) => handleInputChange("direccion", e.target.value)}
                      className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A3853D] focus:border-[#A3853D]"
                    />
                  </div>
                  <div>
                    <label htmlFor="comunidad" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      Comunidad *
                    </label>
                    <input
                      id="comunidad"
                      type="text"
                      placeholder="Tu comunidad"
                      value={formData.comunidad}
                      onChange={(e) => handleInputChange("comunidad", e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A3853D] focus:border-[#A3853D]"
                    />
                  </div>
                </div>
              </div>

              {/* Información de Asociado */}
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
                      id="necesidades"
                      placeholder="¿Cuáles son tus principales necesidades o retos actuales como productor ganadero?"
                      value={formData.necesidades}
                      onChange={(e) => handleInputChange("necesidades", e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#A3853D] focus:border-[#A3853D]"
                    />
                  </div>
                </div>
              </div>

              {/* Documentos */}
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
                  </div>
                  <button
                    type="submit"
                    disabled={!formData.acceptTerms}
                    className="w-full bg-[#708C3E] hover:bg-[#5d7334] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md text-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Enviar Solicitud de Asociado
                  </button>
                  <p className="text-center text-sm text-gray-500">
                    Nos pondremos en contacto contigo en un plazo de 3-5 días hábiles
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
