import { useMemo, useState } from "react";
import { volunteerOrganizacionSchema } from "../schemas/volunteerSchema";
import { existsCedula, existsEmail } from "../services/volunteerFormService";

export function RepresentanteSection({
  form,
  lookup,
  showErrors = false,
}: {
  form: any;
  lookup?: (id: string) => Promise<any>;
  showErrors?: boolean;
}) {
  const personaSchema = useMemo(
    () =>
      volunteerOrganizacionSchema.shape.organizacion.shape.representante.shape
        .persona,
    []
  );
  const representanteSchema = useMemo(
    () => volunteerOrganizacionSchema.shape.organizacion.shape.representante,
    []
  );

  // 🔒 Máxima fecha permitida: hoy - 18 años
  const maxBirthDate = useMemo(() => {
    const t = new Date();
    t.setFullYear(t.getFullYear() - 18);
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    return `${t.getFullYear()}-${mm}-${dd}`;
  }, []);

  
  const [verificandoCedula, setVerificandoCedula] = useState(false);
  const [cedulaDupError, setCedulaDupError] = useState<string>("");

  const [verificandoEmail, setVerificandoEmail] = useState(false);
  const [emailDupError, setEmailDupError] = useState<string>("");

  // Helpers de validación para onSubmit
  const validatePersonaField =
    (key: keyof typeof personaSchema.shape) => (arg: any) => {
      const schema = (personaSchema.shape as any)[key];
      if (!schema) return undefined;
      const value = arg && typeof arg === "object" && "value" in arg ? arg.value : arg;
      const r = schema.safeParse(value);
      return r.success ? undefined : r.error.issues?.[0]?.message || "Campo inválido";
    };

  const validateCargo = (arg: any) => {
    const schema = (representanteSchema.shape as any).cargo;
    const value = arg && typeof arg === "object" && "value" in arg ? arg.value : arg;
    const r = schema.safeParse(value);
    return r.success ? undefined : r.error.issues?.[0]?.message || "Campo inválido";
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          2
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Persona de Contacto (Representante)
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Cédula */}
        <div className="relative">
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Cédula o Pasaporte*
          </label>
          <form.Field
            name="organizacion.representante.persona.cedula"
            validators={{ onSubmit: validatePersonaField("cedula") }}
          >
            {(field: any) => (
              <>
                <input
                  type="text"
                  value={field.state.value || ""}
                  maxLength={60}
                  onChange={async (e) => {
                    const raw = e.target.value;
                    field.handleChange(raw);

                    //  limpiar error de duplicado al escribir
                    if (cedulaDupError) setCedulaDupError("");

                    const onlyDigits = String(raw).replace(/\D/g, "");
                    if (onlyDigits.length >= 9) {
                      try {
                        const result = lookup ? await lookup(onlyDigits) : null;
                        if (result) {
                          const nameVal =
                            result.firstname || result.nombre || result.name || "";
                          const last1Val =
                            result.lastname1 ||
                            result.apellido1 ||
                            result.primerApellido ||
                            "";
                          const last2Val =
                            result.lastname2 ||
                            result.apellido2 ||
                            result.segundoApellido ||
                            "";

                          form?.setFieldValue?.(
                            "organizacion.representante.persona.nombre",
                            nameVal
                          );
                          form?.setFieldValue?.(
                            "organizacion.representante.persona.apellido1",
                            last1Val
                          );
                          form?.setFieldValue?.(
                            "organizacion.representante.persona.apellido2",
                            last2Val
                          );
                        }
                      } catch {}
                    }
                  }}
                  onBlur={async (e) => {
                    const ced = e.target.value.trim();
                    if (!ced) return;
                    // Reglas mínimas para no spamear el backend
                    const digits = ced.replace(/\D/g, "");
                    if (digits.length < 9) return;

                    setVerificandoCedula(true);
                    try {
                      const existe = await existsCedula(ced);
                      if (existe) {
                        setCedulaDupError("Esta cédula ya está registrada en el sistema");
                      } else {
                        setCedulaDupError("");
                      }
                    } finally {
                      setVerificandoCedula(false);
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                    cedulaDupError
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  }`}
                  placeholder="Número de cédula"
                />
                {/* spinner cedula */}
                {verificandoCedula && (
                  <div className="absolute right-3 top-11">
                    <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
                    </svg>
                  </div>
                )}
                {/* error zod */}
                {showErrors && field.state.meta.errors?.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
                {/* error duplicado backend */}
                {cedulaDupError && (
                  <p className="mt-1 text-sm text-red-600">{cedulaDupError}</p>
                )}
              </>
            )}
          </form.Field>
        </div>

        {/* Nombre y Apellidos */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
              Nombre *
            </label>
            <form.Field
              name="organizacion.representante.persona.nombre"
              validators={{ onSubmit: validatePersonaField("nombre") }}
            >
              {(field: any) => (
                <>
                  <input
                    type="text"
                    value={field.state.value || ""}
                    maxLength={60}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    placeholder="Tu nombre"
                  />
                  {showErrors && field.state.meta.errors?.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </>
              )}
            </form.Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
              Primer Apellido *
            </label>
            <form.Field
              name="organizacion.representante.persona.apellido1"
              validators={{ onSubmit: validatePersonaField("apellido1") }}
            >
              {(field: any) => (
                <>
                  <input
                    type="text"
                    value={field.state.value || ""}
                    maxLength={60}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    placeholder="Tu primer apellido"
                  />
                  {showErrors && field.state.meta.errors?.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </>
              )}
            </form.Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
              Segundo Apellido *
            </label>
            <form.Field
              name="organizacion.representante.persona.apellido2"
              validators={{ onSubmit: validatePersonaField("apellido2") }}
            >
              {(field: any) => (
                <>
                  <input
                    type="text"
                    value={field.state.value || ""}
                    maxLength={60}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    placeholder="Tu segundo apellido"
                  />
                  {showErrors && field.state.meta.errors?.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </>
              )}
            </form.Field>
          </div>
        </div>

        {/* Cargo */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Cargo/Posición *
          </label>
          <form.Field
            name="organizacion.representante.cargo"
            validators={{ onSubmit: validateCargo }}
          >
            {(field: any) => (
              <>
                <input
                  type="text"
                  value={field.state.value || ""}
                  maxLength={100}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Ej: Director, Coordinador, Presidente, etc."
                />
                {showErrors && field.state.meta.errors?.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </>
            )}
          </form.Field>
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Teléfono del representante *
          </label>
          <form.Field
            name="organizacion.representante.persona.telefono"
            validators={{ onSubmit: validatePersonaField("telefono") }}
          >
            {(field: any) => (
              <>
                <input
                  type="tel"
                  value={field.state.value || ""}
                  maxLength={12}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Número de teléfono"
                />
                {showErrors && field.state.meta.errors?.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </>
            )}
          </form.Field>
        </div>

        {/* Email */}
        <div className="relative">
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Correo del representante *
          </label>
          <form.Field
            name="organizacion.representante.persona.email"
            validators={{ onSubmit: validatePersonaField("email") }}
          >
            {(field: any) => (
              <>
                <input
                  type="email"
                  value={field.state.value || ""}
                  maxLength={60}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    if (emailDupError) setEmailDupError("");
                  }}
                  onBlur={async (e) => {
                    const email = e.target.value.trim();
                    if (!email) return;

                    
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) return;

                    setVerificandoEmail(true);
                    try {
                      const existe = await existsEmail(email);
                      if (existe) {
                        setEmailDupError("Este email ya está registrado en el sistema");
                      } else {
                        setEmailDupError("");
                      }
                    } finally {
                      setVerificandoEmail(false);
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                    emailDupError
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  }`}
                  placeholder="correo@ejemplo.com"
                />
                {/* spinner email */}
                {verificandoEmail && (
                  <div className="absolute right-3 top-11">
                    <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
                    </svg>
                  </div>
                )}
                {/* error zod */}
                {showErrors && field.state.meta.errors?.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
                {/* error duplicado backend */}
                {emailDupError && (
                  <p className="mt-1 text-sm text-red-600">{emailDupError}</p>
                )}
              </>
            )}
          </form.Field>
        </div>

        <div className="bg-[#F5F7EC] border border-[#DCD6C9] rounded-lg p-4">
          <h4 className="text-sm font-semibold text-[#708C3E] mb-3">
            Información adicional *
          </h4>

          <div className="space-y-4">
            {/* Fecha de nacimiento: no menores de 18 */}
            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1">
                Fecha de nacimiento
              </label>
              <form.Field
                name="organizacion.representante.persona.fechaNacimiento"
                validators={{ onSubmit: validatePersonaField("fechaNacimiento") }}
              >
                {(field: any) => (
                  <>
                    <input
                      type="date"
                      value={field.state.value || ""}
                      max={maxBirthDate}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    />
                    {showErrors && field.state.meta.errors?.length > 0 && (
                      <p className="mt-1 text-sm text-red-600">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </>
                )}
              </form.Field>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1">
                Dirección del representante
              </label>
              <form.Field name="organizacion.representante.persona.direccion">
                {(field: any) => (
                  <textarea
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={2}
                    maxLength={200}
                    className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    placeholder="Dirección de residencia (opcional)"
                  />
                )}
              </form.Field>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
