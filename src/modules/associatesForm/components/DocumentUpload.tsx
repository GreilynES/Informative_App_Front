// src/components/Associates/DocumentUpload.tsx

import type { FormLike } from "../../../shared/types/form-lite";

interface DocumentUploadProps {
  form: FormLike;
}

export function DocumentUpload({ form }: DocumentUploadProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Grid para los dos documentos obligatorios */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Copia de Cédula */}
        <form.Field name="idCopy">
          {(f: any) => (
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Copia de Cédula 
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file && file.size > 5 * 1024 * 1024) {
                      alert("Máx 5MB");
                      return;
                    }
                    f.handleChange(file);
                  }}
                  className="hidden"
                  id="idCopy"
                />
                <label
                  htmlFor="idCopy"
                  className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    f.state.value 
                      ? 'border-[#708C3E] bg-[#f0f4e8]' 
                      : 'border-[#CFCFCF] bg-white hover:bg-gray-50'
                  }`}
                >
                  {f.state.value ? (
                    <div className="text-center p-4">
                      <svg className="w-12 h-12 mx-auto text-[#708C3E] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm font-medium text-[#708C3E] mb-1">Archivo cargado</p>
                      <p className="text-xs text-gray-600 break-all px-2">{(f.state.value as File).name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {((f.state.value as File).size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600 mb-1">Haz clic para subir o arrastra el archivo</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG hasta 5MB</p>
                    </div>
                  )}
                </label>
              </div>
              {f.state.meta.errors?.length > 0 && (
                <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Plano de la Finca / Contrato */}
        <form.Field name="farmMap">
          {(f: any) => (
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Copia del Plano de la Finca 
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file && file.size > 5 * 1024 * 1024) {
                      alert("Máx 5MB");
                      return;
                    }
                    f.handleChange(file);
                  }}
                  className="hidden"
                  id="farmMap"
                />
                <label
                  htmlFor="farmMap"
                  className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    f.state.value 
                      ? 'border-[#708C3E] bg-[#f0f4e8]' 
                      : 'border-[#CFCFCF] bg-white hover:bg-gray-50'
                  }`}
                >
                  {f.state.value ? (
                    <div className="text-center p-4">
                      <svg className="w-12 h-12 mx-auto text-[#708C3E] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm font-medium text-[#708C3E] mb-1">Archivo cargado</p>
                      <p className="text-xs text-gray-600 break-all px-2">{(f.state.value as File).name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {((f.state.value as File).size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600 mb-1">Haz clic para subir o arrastra el archivo</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG hasta 5MB</p>
                    </div>
                  )}
                </label>
              </div>
              {f.state.meta.errors?.length > 0 && (
                <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>
    </div>
  );
}