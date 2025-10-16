import type { FormLike } from "../../../shared/types/form-lite";
import { ZodError } from "zod";
import { associateApplySchema } from "../schemas/associateApply";
import { NavigationButtons } from "../components/NavigationButtons";
import { NucleoFamiliarSection } from "../components/FamilyNucleusSection";
import { useEffect, useState } from "react";

interface Step1Props {
  form: FormLike;
  lookup: (id: string) => Promise<any>;
  onNext: () => void;
  canProceed: boolean;
}

export function Step1({ form, lookup, onNext, canProceed }: Step1Props) {
  const validateField = (name: string, value: any) => {
    try {
      const fieldSchema = (associateApplySchema.shape as any)[name];
      if (fieldSchema) {
        fieldSchema.parse(value);
      }
      return undefined;
    } catch (error) {
      if (error instanceof ZodError) {
        return error.issues[0]?.message || "Error de validación";
      }
      return "Error de validación";
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

const toISO = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const todayDate = new Date();
const adultCutoff = new Date(todayDate);        // hoy - 18 años
adultCutoff.setFullYear(adultCutoff.getFullYear() - 18);
const adultMaxDate = toISO(adultCutoff);        // "YYYY-MM-DD"

  useEffect(() => {
    // Solo lo muestra si no existe el flag en localStorage
    const warned = localStorage.getItem("showModalAviso");
    setShowModal(!warned);
  }, []);

  function handleClose() {
    setIsVisible(false);
    setTimeout(() => {
      setShowModal(false);
      localStorage.setItem("showModalAviso", "true"); // Marca como visto
      setIsVisible(true); // opcional si reusas el modal en otro lado
    }, 250);
  }
  return (
    <>
    {showModal && (
        <div
          className={`
            fixed inset-0 flex items-center justify-center z-50
            bg-white/30 backdrop-blur-sm
            transition-all duration-250
            ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          `}
        >
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg mx-4 transition-all duration-250">
            <h2 className="text-2xl font-semibold mb-3">Aviso importante</h2>
            <p className="mb-6 text-lg">
              Antes de empezar, tenga a mano copia de la cédula, copia del acta de finca o contrato de arriendo de finca. Estos documentos serán necesarios.
            </p>
            <button
              onClick={handleClose}
              className="px-5 py-2 bg-[#708C3E] text-white rounded hover:bg-[#5d7334] text-lg"
            >
              Entendido, continuar
            </button>
          </div>
        </div>
      )}

{!showModal && (
    <div className="space-y-6">
      
      {/* Información Personal */}
      <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Información Personal</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <form.Field 
              name="cedula"
              validators={{ onChange: ({ value }: any) => validateField("cedula", value) }}
            >
              {(f: any) => (
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
                  {f.state.meta.errors?.length > 0 && (
                    <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
                  )}
                  
                </div>
              )}
            </form.Field>

            <form.Field 
              name="nombre"
              validators={{ onChange: ({ value }: any) => validateField("nombre", value) }}
            >
              {(f: any) => (
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
                  {f.state.meta.errors?.length > 0 && (
                    <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <form.Field 
              name="apellido1"
              validators={{ onChange: ({ value }: any) => validateField("apellido1", value) }}
            >
              {(f: any) => (
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
                  {f.state.meta.errors?.length > 0 && (
                    <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field 
              name="apellido2"
              validators={{ onChange: ({ value }: any) => validateField("apellido2", value) }}
            >
              {(f: any) => (
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
                  {f.state.meta.errors?.length > 0 && (
                    <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field 
            name="fechaNacimiento"
            validators={{ onChange: ({ value }: any) => validateField("fechaNacimiento", value) }}
          >
            {(f: any) => {
              
              return (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Nacimiento *
                    </label>
                    <input
                      type="date"
                      required
                      value={f.state.value}
                      onChange={(e) => {
                        const inputDate = e.target.value;
                        if (!inputDate) {
                          // Campo obligatorio
                          f.handleChange("");
                        } else if (inputDate > adultMaxDate) {
                          f.handleChange(adultMaxDate);
                        } else {
                          f.handleChange(inputDate);
                        }
                      }}
                      onBlur={f.handleBlur}
                      // Límite superior: exactamente 18 años atrás desde hoy
                      max={adultMaxDate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    />
                    {f.state.meta.errors?.length > 0 && (
                      <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
                    )}
                  </div>

              );
            }}
          </form.Field>
        </div>
      </div>

      {/* Información de Contacto */}
      <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Información de Contacto</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <form.Field 
              name="telefono"
              validators={{ onChange: ({ value }: any) => validateField("telefono", value) }}
            >
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Teléfono *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      f.handleChange(value);
                    }}
                    onBlur={f.handleBlur}
                    className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    placeholder="Número de teléfono"
                    maxLength={12}
                  />
                  {f.state.meta.errors?.length > 0 && (
                    <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field 
              name="email"
              validators={{ onChange: ({ value }: any) => validateField("email", value) }}
            >
              {(f: any) => (
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
                  {f.state.meta.errors?.length > 0 && (
                    <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field 
            name="direccion"
            validators={{ onChange: ({ value }: any) => validateField("direccion", value) }}
          >
            {(f: any) => (
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
                {f.state.meta.errors?.length > 0 && (
                  <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>
        </div>
      </div>

      {/* Información de la Finca y Ganado */}
      <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Información de la Finca y Ganado</h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            

{/* ✅ Checkbox marcado por defecto (uno solo) */}
<form.Field name="viveEnFinca">
  {(f: any) => (
    <div className="flex items-center gap-3 mt-1">
      <input
        id="viveEnFinca"
        type="checkbox"
        checked={f.state.value ?? true} // default: true
        onChange={(e) => {
          f.handleChange(e.target.checked);
          // si vuelve a marcar, limpia distancia
          if (e.target.checked && f.form?.setFieldValue) {
            f.form.setFieldValue("distanciaFinca", "");
          }
        }}
        onBlur={f.handleBlur}
        className="w-4 h-4 rounded"
        style={{ accentColor: "#708C3E" }}
      />
      <label htmlFor="viveEnFinca" className="text-sm text-[#4A4A4A]">
        ¿Vive en la finca?
      </label>
    </div>
  )}
</form.Field>

{/* ✅ Listener: solo muestra distancia cuando viveEnFinca === false */}
<form.Field name="viveEnFinca">
  {(v: any) => {
    const viveEnFinca = (v.state.value ?? true) as boolean;
    if (viveEnFinca) return null; // solo cuando está DESMARCADO

    return (
      <form.Field
        name="distanciaFinca"
        validators={{
          onChange: ({ value }: any) => validateField("distanciaFinca", value),
        }}
      >
        {(f: any) => (
          <div className="mt-3">
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Distancia de su residencia a la finca (km) *
            </label>
            <input
              type="number"
              min="1"
              value={f.state.value}
              onChange={(e) => {
                // Solo dígitos y punto, sin guion
                let value = e.target.value.replace(/[^\d.]/g, "");
                const parts = value.split(".");
                const filtered =
                  parts.length > 2
                    ? parts[0] + "." + parts.slice(1).join("")
                    : value;

                // Rechaza 0 o vacío (debe ser > 0)
                if (filtered === "" || filtered === "0" || parseFloat(filtered) === 0) {
                  f.handleChange("");
                  return;
                }

                f.handleChange(filtered);
              }}
              onBlur={f.handleBlur}
              placeholder="Ej: 12.50"
              className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md"
              onKeyDown={(e) => {
                // Bloquea '-', 'e' y 0 como primer dígito
                if (e.key === "-" || e.key === "e" || (e.key === "0" && !f.state.value)) {
                  e.preventDefault();
                }
              }}
            />
            {f.state.meta.errors?.length > 0 && (
              <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>
    );
  }}
</form.Field>



          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <form.Field 
              name="marcaGanado"
              validators={{ onChange: ({ value }: any) => validateField("marcaGanado", value) }}
            >
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Marca de Ganado *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                    onBlur={f.handleBlur}
                    placeholder="Ej: MG-2025"
                    className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md"
                  />
                  {f.state.meta.errors?.length > 0 && (
                    <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field 
              name="CVO"
              validators={{ onChange: ({ value }: any) => validateField("CVO", value) }}
            >
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">CVO *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                    placeholder="Ej: CVO-123456"
                    onBlur={f.handleBlur}
                    className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md"
                  />
                  {f.state.meta.errors?.length > 0 && (
                    <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>
        </div>
      </div>

      <NucleoFamiliarSection form={form}/>

      <NavigationButtons 
        showPrev={false} 
        onNext={onNext} 
        disableNext={!canProceed}
      />
    </div>
    )}
    </>
  );
}