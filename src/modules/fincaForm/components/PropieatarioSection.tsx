import type { FormLike } from "../../../shared/types/form-lite";

interface PropietarioSectionProps {
  form: FormLike;
}

export function PropietarioSection({ form }: PropietarioSectionProps) {
  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#A3853D] rounded-full flex items-center justify-center text-white font-bold text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Propietario de la Finca</h3>
      </div>

      <div className="p-6 space-y-4">
        <form.Field name="esPropietario">
          {(f: any) => (
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <input
                id="esPropietario"
                type="checkbox"
                checked={!!f.state.value}
                onChange={(e) => f.handleChange(e.target.checked)}
                onBlur={f.handleBlur}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: '#708C3E' }}
              />
              <label htmlFor="esPropietario" className="text-sm font-medium text-[#4A4A4A]">
                Soy el propietario de esta finca
              </label>
            </div>
          )}
        </form.Field>

        <form.Field name="esPropietario">
          {(f: any) => {
            const esPropietario = f.state.value;
            
            if (esPropietario) {
              return (
                <div className="text-sm text-gray-600 italic">
                  Como usted es el propietario, se usarán sus datos personales.
                </div>
              );
            }

            return (
              <div className="space-y-4 border-t pt-4">
                <p className="text-sm font-medium text-[#4A4A4A]">Datos del Propietario:</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <form.Field name="propietarioCedula">
                    {(fprop: any) => (
                      <div>
                        <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Cédula del Propietario *</label>
                        <input
                          type="text"
                          value={fprop.state.value}
                          onChange={(e) => fprop.handleChange(e.target.value)}
                          onBlur={fprop.handleBlur}
                          className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md"
                          placeholder="Número de cédula"
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="propietarioNombre">
                    {(fprop: any) => (
                      <div>
                        <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Nombre *</label>
                        <input
                          type="text"
                          value={fprop.state.value}
                          onChange={(e) => fprop.handleChange(e.target.value)}
                          onBlur={fprop.handleBlur}
                          className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md"
                          placeholder="Nombre del propietario"
                        />
                      </div>
                    )}
                  </form.Field>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <form.Field name="propietarioApellido1">
                    {(fprop: any) => (
                      <div>
                        <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Primer Apellido *</label>
                        <input
                          type="text"
                          value={fprop.state.value}
                          onChange={(e) => fprop.handleChange(e.target.value)}
                          onBlur={fprop.handleBlur}
                          className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md"
                          placeholder="Primer apellido"
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="propietarioApellido2">
                    {(fprop: any) => (
                      <div>
                        <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Segundo Apellido *</label>
                        <input
                          type="text"
                          value={fprop.state.value}
                          onChange={(e) => fprop.handleChange(e.target.value)}
                          onBlur={fprop.handleBlur}
                          className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md"
                          placeholder="Segundo apellido"
                        />
                      </div>
                    )}
                  </form.Field>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <form.Field name="propietarioTelefono">
                    {(fprop: any) => (
                      <div>
                        <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Teléfono *</label>
                        <input
                          type="text"
                          value={fprop.state.value}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            fprop.handleChange(value);
                          }}
                          onBlur={fprop.handleBlur}
                          className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md"
                          placeholder="Teléfono"
                          maxLength={12}
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="propietarioEmail">
                    {(fprop: any) => (
                      <div>
                        <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Email *</label>
                        <input
                          type="email"
                          value={fprop.state.value}
                          onChange={(e) => fprop.handleChange(e.target.value)}
                          onBlur={fprop.handleBlur}
                          className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md"
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>
            );
          }}
        </form.Field>
      </div>
    </div>
  );
}