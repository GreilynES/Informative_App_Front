// src/modules/volunteersForm/components/OrganizacionSection.tsx

import { useState } from "react";

interface OrganizacionSectionProps {
  form: any; 
}

const TIPOS_ORGANIZACION = [
  "ONG",
  "Institución educativa",
  "Empresa privada",
  "Grupo comunitario",
  "Otro"
];

export function OrganizacionSection({ form }: OrganizacionSectionProps) {
  const [tipoOrg, setTipoOrg] = useState("");
  const [otroTipo, setOtroTipo] = useState("");

  const handleTipoChange = (valor: string) => {
    setTipoOrg(valor);
    
    if (valor !== "Otro") {
      setOtroTipo("");
      form.setFieldValue("organizacion.tipoOrganizacion", valor);
    }
  };

  const handleOtroTipoChange = (valor: string) => {
    setOtroTipo(valor);
    form.setFieldValue("organizacion.tipoOrganizacion", valor);
  };

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
        {/* Nombre de la organización */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Nombre de la organización <span className="text-red-500">*</span>
          </label>
          <form.Field name="organizacion.nombre">
            {(field: any) => (
              <>
                <input
                  type="text"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Ej: Fundación Amigos del Ambiente"
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

        {/* Número estimado de voluntarios */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Número estimado de voluntarios <span className="text-red-500">*</span>
          </label>
          <form.Field name="organizacion.numeroVoluntarios">
            {(field: any) => (
              <>
                <input
                  type="number"
                  min="1"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(parseInt(e.target.value) || 1)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Mínimo 1"
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

        {/* Cédula jurídica/RUC */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Cédula jurídica/RUC <span className="text-red-500">*</span>
          </label>
          <form.Field name="organizacion.cedulaJuridica">
            {(field: any) => (
              <>
                <input
                  type="text"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Ej: 3-101-123456"
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

        {/* Tipo de organización */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Tipo de organización <span className="text-red-500">*</span>
          </label>
          <select
            value={tipoOrg}
            onChange={(e) => handleTipoChange(e.target.value)}
            className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
          >
            <option value="">Seleccione...</option>
            {TIPOS_ORGANIZACION.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Campo "Otro" */}
        {tipoOrg === "Otro" && (
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
              Especifique el tipo de organización <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={otroTipo}
              onChange={(e) => handleOtroTipoChange(e.target.value)}
              className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              placeholder="Ej: Cooperativa agrícola"
              maxLength={100}
            />
          </div>
        )}

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Dirección de la organización <span className="text-red-500">*</span>
          </label>
          <form.Field name="organizacion.direccion">
            {(field: any) => (
              <>
                <textarea
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Dirección completa de la sede principal"
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

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Teléfono de la organización <span className="text-red-500">*</span>
          </label>
          <form.Field name="organizacion.telefono">
            {(field: any) => (
              <>
                <input
                  type="tel"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Ej: 2222-3333"
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

        {/* Email institucional */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Correo electrónico institucional <span className="text-red-500">*</span>
          </label>
          <form.Field name="organizacion.email">
            {(field: any) => (
              <>
                <input
                  type="email"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Ej: contacto@organizacion.org"
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
    </div>
  );
}