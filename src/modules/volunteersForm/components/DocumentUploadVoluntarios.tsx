// src/modules/volunteersForm/components/DocumentUploadVoluntarios.tsx

type TipoSolicitante = "INDIVIDUAL" | "ORGANIZACION"
type Field = "cedula" | "cv" | "carta"

interface DocumentUploadVoluntariosProps {
  tipo: TipoSolicitante
  files: {
    cedula?: File | null
    cv?: File | null
    carta?: File | null
  }
  setFiles: (updater: any) => void
}

export function DocumentUploadVoluntarios({ tipo, files, setFiles }: DocumentUploadVoluntariosProps) {
  const handleFileChange = (field: Field, file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      alert("El archivo debe ser menor a 5MB")
      return
    }
    setFiles((prev: any) => ({ ...prev, [field]: file }))
  }

  const renderFileInput = (id: string, label: string, field: Field, required = false) => {
    const file = files[field]

    return (
      <div>
        <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
          {label} {required && <span className="text-black-500">*</span>}
        </label>

        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
            className="hidden"
            id={id}
          />

          <label
            htmlFor={id}
            className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              file ? "border-[#708C3E] bg-[#f0f4e8]" : "border-[#CFCFCF] bg-white hover:bg-gray-50"
            }`}
          >
            {file ? (
              <div className="text-center p-4">
                <svg className="w-12 h-12 mx-auto text-[#708C3E] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>

                <p className="text-sm font-medium text-[#708C3E] mb-1">Archivo cargado</p>
                <p className="text-xs text-gray-600 break-all px-2">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(0)} KB</p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    handleFileChange(field, null)
                  }}
                  className="mt-2 text-xs text-[#B85C4C] hover:text-[#8C3A33]"
                >
                  Eliminar
                </button>
              </div>
            ) : (
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-600 mb-1">Haz clic para subir o arrastra el archivo</p>
                <p className="text-xs text-gray-500">PDF hasta 5MB</p>
              </div>
            )}
          </label>
        </div>
      </div>
    )
  }

  const infoText =
    tipo === "INDIVIDUAL"
      ? "Por favor recuerda adjuntar tu Cédula, Currículum Vitae y carta de recomendación."
      : "Por favor recuerda adjuntar el documento legal, la carta de motivación y un documento adicional (si aplica)."

  const labels =
    tipo === "INDIVIDUAL"
      ? {
          cedula: "Copia de Cédula/Pasaporte",
          cv: "Currículum Vitae (CV)",
          carta: "Carta de recomendación",
        }
      : {
          cedula: "Documento legal de la organización",
          carta: "Carta de motivación",
          cv: "Documento adicional",
        }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start gap-3 p-4 bg-[#eef7df] border border-[#efefef] rounded-xl">
        <span className="mt-0.5 inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
          i
        </span>
        <div>
          <p className="text-sm font-medium text-[#4A4A4A] leading-relaxed">{infoText}</p>
          <li className="mt-2 text-xs text-[#4A4A4A]/70">
            Formato permitido: PDF (máximo 5MB por archivo).
          </li>
          <li className="mt-2 text-xs text-[#4A4A4A]/70">
            Campos marcados con asterisco son obligatorios. Asegúrate de que los archivos estén correctamente nombrados para facilitar su revisión.
          </li>
        </div>
      </div>

      {tipo === "INDIVIDUAL" ? (
        <>
        <div className="grid md:grid-cols-2 gap-6">
          {renderFileInput("ind-cedula", labels.cedula, "cedula", true)}
          {renderFileInput("ind-cv", labels.cv, "cv", true)}
        </div>
        
          <div className="grid grid-cols-1">
          {renderFileInput("ind-carta", labels.carta, "carta", true)}
          </div>
        </>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            {renderFileInput("org-doc-legal", labels.cedula, "cedula", true)}
            {renderFileInput("org-carta", labels.carta, "carta", true)}
          </div>

          <div className="grid grid-cols-1">
            {renderFileInput("org-adicional", labels.cv, "cv", false) }
          </div>
        </>
      )}
    </div>
  )
}
