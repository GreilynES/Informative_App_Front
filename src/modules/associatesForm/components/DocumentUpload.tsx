// src/components/Associates/DocumentUpload.tsx

import type { FormLike } from "../../../shared/types/form-lite";

interface DocumentUploadProps {
  form: FormLike;
}

function UploadBox({
  id,
  label,
  field,
}: {
  id: string;
  label: string;
  field: any;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
        {label}
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
            field.handleChange(file);
          }}
          className="hidden"
          id={id}
        />

        <label
          htmlFor={id}
          className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            field.state.value
              ? "border-[#708C3E] bg-[#f0f4e8]"
              : "border-[#CFCFCF] bg-white hover:bg-gray-50"
          }`}
        >
          {field.state.value ? (
            <div className="text-center p-4">
              <svg
                className="w-12 h-12 mx-auto text-[#708C3E] mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-sm font-medium text-[#708C3E] mb-1">
                Archivo cargado
              </p>
              <p className="text-xs text-gray-600 break-all px-2">
                {(field.state.value as File).name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {(((field.state.value as File).size || 0) / 1024).toFixed(0)} KB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm text-gray-600 mb-1">
                Haz clic para subir o arrastra el archivo
              </p>
              <p className="text-xs text-gray-500">PDF, JPG, PNG hasta 5MB</p>
            </div>
          )}
        </label>
      </div>

      {field.state.meta.errors?.length > 0 && (
        <p className="text-sm text-red-600 mt-1">{field.state.meta.errors[0]}</p>
      )}
    </div>
  );
}

export function DocumentUpload({ form }: DocumentUploadProps) {
  return (
    <div className="p-6 space-y-6">
      {/* ✅ FILA ARRIBA: Comentario a lo ancho */}
      <div className="flex items-start gap-3 p-4 bg-[#eef7df] border border-[#efefef] rounded-xl">
        <span className="mt-0.5 inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
          i
        </span>

        <div>
          <p className="text-sm font-medium text-[#4A4A4A] leading-relaxed">
            Por favor, no olvide adjuntar una copia de su cédula o 
            pasaporte y una copia del Plano de la Finca o Contrato.
          </p>
          <p className="mt-2 text-xs text-[#4A4A4A]/70">
            Formatos permitidos: PDF, JPG, PNG (máximo 5MB por archivo).
          </p>
        </div>
      </div>

      {/* ✅ FILA ABAJO: Grid SOLO para los uploads */}
      <div className="grid md:grid-cols-2 gap-6">
        <form.Field name="idCopy">
          {(f: any) => (
            <UploadBox id="idCopy" label="Copia de Cédula o Pasaporte" field={f} />
          )}
        </form.Field>

        <form.Field name="farmMap">
          {(f: any) => (
            <UploadBox
              id="farmMap"
              label="Copia del Plano de la Finca o Contrato"
              field={f}
            />
          )}
        </form.Field>
      </div>
    </div>
  );
}
