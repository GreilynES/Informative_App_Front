import { useState } from "react";
import { organizacionSchema } from "../schemas/volunteerSchema";

interface OrganizacionSectionProps {
  form: any;
  showErrors?: boolean;
}

const TIPOS_ORGANIZACION = [
  "ONG",
  "Institución educativa",
  "Empresa privada",
  "Grupo comunitario",
  "Otro",
];

function validateOrgField(key: keyof typeof organizacionSchema.shape) {
  const shape = (organizacionSchema.shape as any)[key];
  if (!shape) return () => undefined;

  return (arg: any) => {
    const value = arg && typeof arg === "object" && "value" in arg ? arg.value : arg;
    const single = shape.safeParse(value);
    return single.success ? undefined : single.error.issues?.[0]?.message || "Campo inválido";
  };
}

export function OrganizacionSection({ form, showErrors }: OrganizacionSectionProps) {
  const [tipoOrg, setTipoOrg] = useState(
    (form.getFieldValue?.("organizacion.tipoOrganizacion") as string) || ""
  );
  const [otroTipo, setOtroTipo] = useState("");

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          1
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Información de la Organización
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Nombre de la organización <span className="text-red-500">*</span>
          </label>
          <form.Field
            name="organizacion.nombre"
            validators={{
              onBlur: validateOrgField("nombre"),
              onChange: validateOrgField("nombre"),
              onSubmit: validateOrgField("nombre"),
            }}
          >
            {(field: any) => (
              <>
                <input
                  type="text"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Ej: Fundación Amigos del Ambiente"
                  aria-invalid={showErrors && field.state.meta.errors?.length > 0}
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

        {/* Número de voluntarios */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Número estimado de voluntarios <span className="text-red-500">*</span>
          </label>
          <form.Field
            name="organizacion.numeroVoluntarios"
            validators={{
              onBlur: validateOrgField("numeroVoluntarios"),
              onChange: validateOrgField("numeroVoluntarios"),
              onSubmit: validateOrgField("numeroVoluntarios"),
            }}
          >
            {(field: any) => (
              <>
                <input
                  type="number"
                  min={1}
                  value={field.state.value ?? ""}
                  onChange={(e) =>
                    field.handleChange(
                      Number.isNaN(parseInt(e.target.value, 10))
                        ? undefined
                        : parseInt(e.target.value, 10)
                    )
                  }
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Mínimo 1"
                  aria-invalid={showErrors && field.state.meta.errors?.length > 0}
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

        {/* Cédula jurídica */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Cédula jurídica/RUC <span className="text-red-500">*</span>
          </label>
          <form.Field
            name="organizacion.cedulaJuridica"
            validators={{
              onBlur: validateOrgField("cedulaJuridica"),
              onChange: validateOrgField("cedulaJuridica"),
              onSubmit: validateOrgField("cedulaJuridica"),
            }}
          >
            {(field: any) => (
              <>
                <input
                  type="text"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Ej: 3-101-123456"
                  aria-invalid={showErrors && field.state.meta.errors?.length > 0}
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

        {/* Tipo de organización (cambio mínimo: value = field.state.value) */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Tipo de organización <span className="text-red-500">*</span>
          </label>

          <form.Field
            name="organizacion.tipoOrganizacion"
            validators={{
              onBlur: validateOrgField("tipoOrganizacion"),
              onChange: validateOrgField("tipoOrganizacion"),
              onSubmit: validateOrgField("tipoOrganizacion"),
            }}
          >
            {(field: any) => (
              <>
                <select
                  value={field.state.value ?? ""}  
                  onChange={(e) => {
                    const valor = e.target.value;
                    setTipoOrg(valor);                     
                    if (valor !== "Otro") {
                      setOtroTipo("");
                      field.handleChange(valor);
                    } else {
                      field.handleChange("");
                    }
                  }}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                >
                  <option value="">Seleccione...</option>
                  {TIPOS_ORGANIZACION.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>

                {showErrors && field.state.meta.errors?.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}

                {tipoOrg === "Otro" && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                      Especifique el tipo de organización <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={otroTipo}
                      onChange={(e) => {
                        setOtroTipo(e.target.value);
                        field.handleChange(e.target.value); // ✅ el mismo Field recibe el texto
                      }}
                      className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                      placeholder="Ej: Cooperativa agrícola"
                      maxLength={100}
                    />
                  </div>
                )}
              </>
            )}
          </form.Field>
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Dirección de la organización <span className="text-red-500">*</span>
          </label>
          <form.Field
            name="organizacion.direccion"
            validators={{
              onBlur: validateOrgField("direccion"),
              onChange: validateOrgField("direccion"),
              onSubmit: validateOrgField("direccion"),
            }}
          >
            {(field: any) => (
              <>
                <textarea
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Dirección completa de la sede principal"
                  aria-invalid={showErrors && field.state.meta.errors?.length > 0}
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
            Teléfono de la organización <span className="text-red-500">*</span>
          </label>
          <form.Field
            name="organizacion.telefono"
            validators={{
              onBlur: validateOrgField("telefono"),
              onChange: validateOrgField("telefono"),
              onSubmit: validateOrgField("telefono"),
            }}
          >
            {(field: any) => (
              <>
                <input
                  type="tel"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Ej: 2222-3333"
                  aria-invalid={showErrors && field.state.meta.errors?.length > 0}
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
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Correo electrónico institucional <span className="text-red-500">*</span>
          </label>
          <form.Field
            name="organizacion.email"
            validators={{
              onBlur: validateOrgField("email"),
              onChange: validateOrgField("email"),
              onSubmit: validateOrgField("email"),
            }}
          >
            {(field: any) => (
              <>
                <input
                  type="email"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Ej: contacto@organizacion.org"
                  aria-invalid={showErrors && field.state.meta.errors?.length > 0}
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
    </div>
  );
}
