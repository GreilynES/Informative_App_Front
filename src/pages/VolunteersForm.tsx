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



export default function VolunteerForm() {
  const [formData, setFormData] = useState<VolunteerFormData>(initialVolunteerFormData)
  const [openSelect, setOpenSelect] = useState<string | null>(null)

  const handleInputChange = (field: keyof VolunteerFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 flex items-center justify-between"
        onClick={() => setOpenSelect(openSelect === name ? null : name)}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value ? options.find((opt) => opt.value === value)?.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
      {openSelect === name && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-green-700 mb-6">
            ¿Por qué ser voluntario en la Cámara de Ganaderos?
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Porque ser voluntario te permite apoyar al sector ganadero local, contribuir con el desarrollo sostenible de
            la comunidad y adquirir experiencia valiosa relacionada con el agro y el medio ambiente.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-12">Beneficios</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Users className="w-8 h-8 text-green-600" />,
                title: "Experiencia Práctica",
                desc: "Capacitación gratuita en manejo ganadero, sostenibilidad y técnicas legales.",
              },
              {
                icon: <Heart className="w-8 h-8 text-green-600" />,
                title: "Impacto Social",
                desc: "Contribuye al desarrollo de tu comunidad y al sector agropecuario local.",
              },
              {
                icon: <Award className="w-8 h-8 text-green-600" />,
                title: "Certificación",
                desc: "Participación en ferias, programas y proyectos especiales con reconocimiento.",
              },
            ].map((item, i) => (
              <div className="text-center" key={i}>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-green-700 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-green-700 text-center mb-8">Requisitos</h2>
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
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{req}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-green-700 mb-4">¡Únete a Nuestro Equipo!</h2>
            <p className="text-gray-600">
              Completa este formulario y comienza tu aventura como voluntario en la Cámara de Ganaderos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
  {/* Información Personal */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
        <h3 className="text-lg font-semibold text-green-700">Información Personal</h3>
      </div>
    </div>
    <div className="p-6 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            id="nombre"
            type="text"
            placeholder="Tu nombre"
            value={formData.nombre}
            onChange={(e) => handleInputChange("nombre", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
          <input
            id="apellidos"
            type="text"
            placeholder="Tus apellidos"
            value={formData.apellidos}
            onChange={(e) => handleInputChange("apellidos", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-1">Cédula *</label>
          <input
            id="cedula"
            type="text"
            placeholder="Número de cédula"
            value={formData.cedula}
            onChange={(e) => handleInputChange("cedula", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label htmlFor="edad" className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
          <input
            id="edad"
            type="number"
            placeholder="Tu edad"
            value={formData.edad}
            onChange={(e) => handleInputChange("edad", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
    </div>
  </div>

  {/* Información de Contacto */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
        <h3 className="text-lg font-semibold text-green-700">Información de Contacto</h3>
      </div>
    </div>
    <div className="p-6 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
          <input
            id="telefono"
            type="tel"
            placeholder="Número de teléfono"
            value={formData.telefono}
            onChange={(e) => handleInputChange("telefono", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
      <div>
        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">Dirección Completa</label>
        <input
          id="direccion"
          type="text"
          placeholder="Tu dirección completa"
          value={formData.direccion}
          onChange={(e) => handleInputChange("direccion", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label htmlFor="comunidad" className="block text-sm font-medium text-gray-700 mb-1">Comunidad *</label>
        <input
          id="comunidad"
          type="text"
          placeholder="Tu comunidad"
          value={formData.comunidad}
          onChange={(e) => handleInputChange("comunidad", e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
    </div>
  </div>

  {/* Información de Voluntariado */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
        <h3 className="text-lg font-semibold text-green-700">Información de Voluntariado</h3>
      </div>
    </div>
    <div className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Voluntariado *</label>
        <SelectField
          value={formData.tipoVoluntariado}
          onChange={(value) => handleInputChange("tipoVoluntariado", value)}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad de Tiempo</label>
        <SelectField
          value={formData.disponibilidad}
          onChange={(value) => handleInputChange("disponibilidad", value)}
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
        <label htmlFor="experienciaPrevia" className="block text-sm font-medium text-gray-700 mb-1">Experiencia Previa</label>
        <textarea
          id="experienciaPrevia"
          placeholder="Cuéntanos sobre tu experiencia previa..."
          value={formData.experienciaPrevia}
          onChange={(e) => handleInputChange("experienciaPrevia", e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label htmlFor="motivacion" className="block text-sm font-medium text-gray-700 mb-1">Motivación *</label>
        <textarea
          id="motivacion"
          placeholder="¿Por qué quieres ser voluntario?"
          value={formData.motivacion}
          onChange={(e) => handleInputChange("motivacion", e.target.value)}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
    </div>
  </div>

  {/* Documentos */}
   <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <h3 className="text-lg font-semibold text-green-700">Documentos</h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Copia de Cédula *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Haz clic para subir o arrastra el archivo</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG hasta 5MB</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Carta de Recomendación</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Haz clic para subir o arrastra el archivo</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG hasta 5MB</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum Vitae</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer">
                    <FileText className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="text-gray-600 mb-1">Haz clic para subir tu CV o arrastra el archivo</p>
                    <p className="text-sm text-gray-500">PDF, DOC, DOCX hasta 10MB</p>
                  </div>
                </div>
              </div>
            </div>


  {/* Términos y botón */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="p-6 space-y-4">
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          checked={formData.acceptTerms}
          onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
          className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
          Acepto los <a href="#" className="text-green-600 underline">términos y condiciones</a> y autorizo el tratamiento de mis datos.
        </label>
      </div>
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="info"
          checked={formData.receiveInfo}
          onChange={(e) => handleInputChange("receiveInfo", e.target.checked)}
          className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded"
        />
        <label htmlFor="info" className="text-sm text-gray-700">
          Deseo recibir información sobre eventos, capacitaciones y oportunidades.
        </label>
      </div>
      <button
        type="submit"
        disabled={!formData.acceptTerms}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md text-lg font-medium transition-colors flex items-center justify-center"
      >
        <Users className="w-5 h-5 mr-2" />
        Enviar Solicitud de Voluntariado
      </button>
      <p className="text-center text-sm text-gray-500">
        Nos pondremos en contacto contigo en un plazo de 3-5 días hábiles
      </p>
    </div>
  </div>
</form>
</div>

      </div>
    </div>
  )
}