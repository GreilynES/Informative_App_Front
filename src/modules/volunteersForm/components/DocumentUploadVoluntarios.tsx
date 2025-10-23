// src/modules/volunteersForm/components/DocumentUploadVoluntarios.tsx

interface DocumentUploadVoluntariosProps {
  files: {
    cv?: File | null;
    cedula?: File | null;
    carta?: File | null;
  };
  setFiles: (files: any) => void;
}

export function DocumentUploadVoluntarios({ files, setFiles }: DocumentUploadVoluntariosProps) {
  const handleFileChange = (field: 'cv' | 'cedula' | 'carta', file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      alert("El archivo debe ser menor a 5MB");
      return;
    }
    setFiles((prev: any) => ({ ...prev, [field]: file }));
  };

  const renderFileInput = (
    id: string,
    label: string,
    field: 'cv' | 'cedula' | 'carta',
    required: boolean = false
  ) => {
    const file = files[field];

    return (
      <div>
        <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] || null;
              handleFileChange(field, selectedFile);
            }}
            className="hidden"
            id={id}
          />
          <label
            htmlFor={id}
            className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              file
                ? 'border-[#708C3E] bg-[#f0f4e8]'
                : 'border-[#CFCFCF] bg-white hover:bg-gray-50'
            }`}
          >
            {file ? (
              <div className="text-center p-4">
                <svg className="w-12 h-12 mx-auto text-[#708C3E] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm font-medium text-[#708C3E] mb-1">Archivo cargado</p>
                <p className="text-xs text-gray-600 break-all px-2">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(0)} KB
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleFileChange(field, null);
                  }}
                  className="mt-2 text-xs text-red-600 hover:text-red-800"
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
                <p className="text-xs text-gray-500">PDF, JPG, PNG hasta 5MB</p>
              </div>
            )}
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Grid para los documentos */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* CV */}
        {renderFileInput('cv', 'Currículum Vitae (CV)', 'cv', true)}

        {/* Cédula */}
        {renderFileInput('cedula', 'Copia de Cédula', 'cedula', true)}
      </div>

      {/* Carta de Motivación - Ocupa todo el ancho */}
      <div className="grid grid-cols-1">
        {renderFileInput('carta', 'Carta de Motivación', 'carta', false)}
      </div>

      {/* Nota informativa */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Los archivos marcados con asterisco (*) son obligatorios. 
          La carta de motivación es opcional pero recomendada.
        </p>
      </div>
    </div>
  );
}