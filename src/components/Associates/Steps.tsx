import { NavigationButtons } from "./NavigationButtons";
import type { FormLike, FieldLike } from "../../types/form-lite";
import { TermsAndSubmit } from "./TermsAndSubmit";

interface StepsProps {
  step: number;
  form: FormLike; // tipo ligero
  lookup: (id: string) => Promise<any>;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting?: boolean;
}

export function Steps({ step, form, lookup, nextStep, prevStep, isSubmitting }: StepsProps) {
  const errorFor = (name: string) =>
    form.state?.meta?.errors?.[name]?.[0]?.message || form.state?.errors?.[name];

  return (
    <>
      {/* Paso 1 */}
      {step === 1 && (
        <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
          <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
            <h3 className="text-lg font-semibold text-[#708C3E]">Información Personal</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* cédula */}
              <form.Field name="cedula">
                {(f: FieldLike<string>) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cédula *</label>
                    <input
                      type="text"
                      value={f.state.value}
                      onChange={async (e) => {
                        const v = e.target.value;
                        f.handleChange(v);
                        if (/^\d{9,12}$/.test(v)) {
                          const r = await lookup(v);
                          if (r) {
                            form.setFieldValue("nombre", r.firstname || "");
                            form.setFieldValue("apellido1", r.lastname1 || "");
                            form.setFieldValue("apellido2", r.lastname2 || "");
                          }
                        }
                      }}
                      onBlur={f.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                      placeholder="Número de cédula"
                    />
                    {errorFor("cedula") && <p className="text-sm text-red-600 mt-1">{errorFor("cedula")}</p>}
                  </div>
                )}
              </form.Field>

              {/* nombre */}
              <form.Field name="nombre">
                {(f: FieldLike<string>) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                    <input
                      type="text"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      onBlur={f.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                      placeholder="Tu nombre"
                    />
                    {errorFor("nombre") && <p className="text-sm text-red-600 mt-1">{errorFor("nombre")}</p>}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* apellido1 */}
              <form.Field name="apellido1">
                {(f: FieldLike<string>) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label>
                    <input
                      type="text"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      onBlur={f.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                      placeholder="Tu primer apellido"
                    />
                    {errorFor("apellido1") && <p className="text-sm text-red-600 mt-1">{errorFor("apellido1")}</p>}
                  </div>
                )}
              </form.Field>

              {/* apellido2 */}
              <form.Field name="apellido2">
                {(f: FieldLike<string>) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido *</label>
                    <input
                      type="text"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      onBlur={f.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                      placeholder="Tu segundo apellido"
                    />
                    {errorFor("apellido2") && <p className="text-sm text-red-600 mt-1">{errorFor("apellido2")}</p>}
                  </div>
                )}
              </form.Field>
            </div>

            {/* fechaNacimiento */}
            <form.Field name="fechaNacimiento">
              {(f: FieldLike<string>) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
                  <input
                    type="date"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                    onBlur={f.handleBlur}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  />
                  {errorFor("fechaNacimiento") && <p className="text-sm text-red-600 mt-1">{errorFor("fechaNacimiento")}</p>}
                </div>
              )}
            </form.Field>
          </div>

          <NavigationButtons
            showPrev={false}
            onNext={nextStep}
            disableNext={Boolean(
              errorFor("cedula") || errorFor("nombre") || errorFor("apellido1") || errorFor("apellido2") || errorFor("fechaNacimiento")
            )}
          />
        </div>
      )}

      {/* Paso 2: Contacto */}
      {step === 2 && (
        <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
          <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
            <h3 className="text-lg font-semibold text-[#708C3E]">Información de Contacto</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <form.Field name="telefono">
                {(f: FieldLike<string>) => (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Teléfono *</label>
                    <input
                      type="tel"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      onBlur={f.handleBlur}
                      className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                      placeholder="Número de teléfono"
                    />
                    {errorFor("telefono") && <p className="text-sm text-red-600 mt-1">{errorFor("telefono")}</p>}
                  </div>
                )}
              </form.Field>

              <form.Field name="email">
                {(f: FieldLike<string>) => (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Email *</label>
                    <input
                      type="email"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      onBlur={f.handleBlur}
                      className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                      placeholder="correo@ejemplo.com"
                    />
                    {errorFor("email") && <p className="text-sm text-red-600 mt-1">{errorFor("email")}</p>}
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="direccion">
              {(f: FieldLike<string>) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Dirección Completa</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                    onBlur={f.handleBlur}
                    className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    placeholder="Tu dirección completa"
                  />
                  {errorFor("direccion") && <p className="text-sm text-red-600 mt-1">{errorFor("direccion")}</p>}
                </div>
              )}
            </form.Field>
          </div>

          <NavigationButtons onPrev={prevStep} onNext={nextStep} />
        </div>
      )}

      {/* Paso 3: Finca y Ganado (se envía al back si los llenas) */}
{step === 3 && (
  <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
    <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
      <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
      <h3 className="text-lg font-semibold text-[#708C3E]">Información de la Finca y Ganado</h3>
    </div>

    <div className="p-6 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <form.Field name="distanciaFinca">
          {(f: any) => (
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Distancia a la finca (km)</label>
              <input
                type="text"
                value={f.state.value}
                onChange={(e) => f.handleChange(e.target.value)}
                onBlur={f.handleBlur}
                placeholder="Ej: 12.50"
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="viveEnFinca">
          {(f: any) => (
            <div className="flex items-center gap-3 mt-1">
              <input
                id="viveEnFinca"
                type="checkbox"
                checked={!!f.state.value}
                onChange={(e) => f.handleChange(e.target.checked)}
                onBlur={f.handleBlur}
              />
              <label htmlFor="viveEnFinca" className="text-sm text-[#4A4A4A]">
                ¿Vive en la finca?
              </label>
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <form.Field name="marcaGanado">
          {(f: any) => (
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Marca de Ganado</label>
              <input
                type="text"
                value={f.state.value}
                onChange={(e) => f.handleChange(e.target.value)}
                onBlur={f.handleBlur}
                placeholder="Ej: MG-2025"
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="CVO">
          {(f: any) => (
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">CVO</label>
              <input
                type="text"
                value={f.state.value}
                onChange={(e) => f.handleChange(e.target.value)}
                onBlur={f.handleBlur}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md"
              />
            </div>
          )}
        </form.Field>
      </div>
    </div>

    <NavigationButtons onPrev={prevStep} onNext={nextStep} />
  </div>
)}

{/* Paso 4: Documentos (solo UI; no se envían aún) */}
{step === 4 && (
  <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
    <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
      <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
      <h3 className="text-lg font-semibold text-[#708C3E]">Documentos</h3>
    </div>

    <div className="p-6 space-y-6">
      <p className="text-sm text-[#666]">
        Sube tus documentos para revisión. <strong>Nota:</strong> por ahora no se envían al servidor en este paso; quedarán cargados en el formulario.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Cédula */}
        <form.Field name="idCopy">
          {(f: any) => (
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Copia de Cédula</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file && file.size > 5 * 1024 * 1024) return alert("Máx 5MB");
                  f.handleChange(file);
                }}
              />
              {f.state.value && (
                <p className="text-xs text-[#666] mt-1">Archivo: {(f.state.value as File).name}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Diagnóstico de finca */}
        <form.Field name="farmDiagnosis">
          {(f: any) => (
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Formulario Diagnóstico de Finca</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file && file.size > 5 * 1024 * 1024) return alert("Máx 5MB");
                  f.handleChange(file);
                }}
              />
              {f.state.value && (
                <p className="text-xs text-[#666] mt-1">Archivo: {(f.state.value as File).name}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Plano/Contrato */}
        <form.Field name="farmMap">
          {(f: any) => (
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Plano de la Finca / Contrato</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file && file.size > 5 * 1024 * 1024) return alert("Máx 5MB");
                  f.handleChange(file);
                }}
              />
              {f.state.value && (
                <p className="text-xs text-[#666] mt-1">Archivo: {(f.state.value as File).name}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Otros */}
        <form.Field name="otherDocuments">
          {(f: any) => (
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">Otros Documentos</label>
              <input
                type="file"
                multiple={false}
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file && file.size > 5 * 1024 * 1024) return alert("Máx 5MB");
                  f.handleChange(file);
                }}
              />
              {f.state.value && (
                <p className="text-xs text-[#666] mt-1">Archivo: {(f.state.value as File).name}</p>
              )}
            </div>
          )}
        </form.Field>


      </div>
    </div>

    <NavigationButtons onPrev={prevStep} onNext={nextStep} />
  </div>
)}
{/* Paso 5: submit/terms */}
{step === 5 && (
        <TermsAndSubmit
          form={form as any}
          isSubmitting={isSubmitting}
          prevStep={prevStep}
        />
      )}
    </>
  );
}
