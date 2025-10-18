// src/modules/volunteersForm/components/RepresentanteSection.tsx

export function RepresentanteSection({ form }: { form: any }) {
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
        {/* Nombre completo del representante */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
            <form.Field name="organizacion.representante.persona.nombre">
              {(field: any) => (
                <>
                  <input
                    type="text"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    placeholder="Nombre"
                  />
                  {field.state.meta.errors?.length > 0 && (
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
              Primer Apellido <span className="text-red-500">*</span>
            </label>
            <form.Field name="organizacion.representante.persona.apellido1">
              {(field: any) => (
                <>
                  <input
                    type="text"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    placeholder="Primer apellido"
                  />
                  {field.state.meta.errors?.length > 0 && (
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
              Segundo Apellido <span className="text-red-500">*</span>
            </label>
            <form.Field name="organizacion.representante.persona.apellido2">
              {(field: any) => (
                <>
                  <input
                    type="text"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    placeholder="Segundo apellido"
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </>
              )}
            </form.Field>
          </div>
        </div>

        {/* Cédula */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Cédula <span className="text-red-500">*</span>
          </label>
          <form.Field name="organizacion.representante.persona.cedula">
            {(field: any) => (
              <>
                <input
                  type="text"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Ej: 1-2345-6789"
                />
                {field.state.meta.errors?.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </>
            )}
          </form.Field>
        </div>

        {/* Cargo/Posición */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Cargo/Posición <span className="text-red-500">*</span>
          </label>
          <form.Field name="organizacion.representante.cargo">
            {(field: any) => (
              <>
                <input
                  type="text"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Ej: Director, Coordinador, Presidente, etc."
                />
                {field.state.meta.errors?.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </>
            )}
          </form.Field>
        </div>

        {/* Teléfono del representante */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Teléfono del representante <span className="text-red-500">*</span>
          </label>
          <form.Field name="organizacion.representante.persona.telefono">
            {(field: any) => (
              <>
                <input
                  type="tel"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Ej: 8888-9999"
                />
                {field.state.meta.errors?.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </>
            )}
          </form.Field>
        </div>

        {/* Correo del representante */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Correo del representante <span className="text-red-500">*</span>
          </label>
          <form.Field name="organizacion.representante.persona.email">
            {(field: any) => (
              <>
                <input
                  type="email"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Ej: representante@organizacion.org"
                />
                {field.state.meta.errors?.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </>
            )}
          </form.Field>
        </div>

        {/* Información adicional */}
        <div className="bg-[#F5F7EC] border border-[#DCD6C9] rounded-lg p-4">
          <h4 className="text-sm font-semibold text-[#708C3E] mb-3">
            Información adicional (Opcional)
          </h4>

          <div className="space-y-4">
            {/* Fecha de nacimiento */}
            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1">
                Fecha de nacimiento
              </label>
              <form.Field name="organizacion.representante.persona.fechaNacimiento">
                {(field: any) => (
                  <input
                    type="date"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  />
                )}
              </form.Field>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1">
                Dirección del representante
              </label>
              <form.Field name="organizacion.representante.persona.direccion">
                {(field: any) => (
                  <textarea
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    rows={2}
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