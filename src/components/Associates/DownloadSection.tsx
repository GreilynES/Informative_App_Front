// src/components/Associates/DownloadSection.tsx

import { Download } from "lucide-react"

export function DownloadSection() {
  return (
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
  )
}
