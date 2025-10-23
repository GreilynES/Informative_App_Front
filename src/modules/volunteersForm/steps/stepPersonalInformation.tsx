import type { VolunteersFormData } from "../../volunteersInformation/models/VolunteersType";
import { UserRound, Mail } from "lucide-react";
import { NavigationButtons } from "../components/NavigationButtons";

import { useMemo, useState } from "react";
import { volunteerOrganizacionSchema } from "../schemas/volunteerSchema";

interface StepPersonalInformationProps {
  formData: VolunteersFormData;
  handleInputChange: (field: keyof VolunteersFormData, value: string | boolean) => void;
  onNextCombined: () => void;
  isStepValid: () => boolean;
  lookup: (id: string) => Promise<any>;
}

export function StepPersonalInformation({
  formData,
  handleInputChange,
  onNextCombined,
  isStepValid,
  lookup,
}: StepPersonalInformationProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [limitReached, setLimitReached] = useState<Record<string, boolean>>({});

  const personaSchema =
    volunteerOrganizacionSchema.shape.organizacion.shape.representante.shape.persona;

  const maxBirthDate = useMemo(() => {
    const t = new Date();
    t.setFullYear(t.getFullYear() - 16);
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    return `${t.getFullYear()}-${mm}-${dd}`;
  }, []);

  const updateLimitFlag = (
    field: keyof VolunteersFormData,
    value: string,
    maxLen?: number
  ) => {
    if (!maxLen) return;
    setLimitReached((prev) => ({
      ...prev,
      [field as string]: value.length >= maxLen,
    }));
  };

  const validateField = (field: keyof VolunteersFormData, value: any) => {
    const mapped = mapFormToPersona({ ...formData, [field]: value });
    const single = personaSchema.pick({ [mapField(field)]: true } as any);
    const key = mapField(field);
    const result = single.safeParse({ [key]: (mapped as Record<string, any>)[key] });
    setErrors((prev) => ({
      ...prev,
      [field]: result.success ? "" : result.error.issues[0]?.message || "",
    }));
  };

  const validateAll = () => {
    const persona = mapFormToPersona(formData);
    const result = personaSchema.safeParse(persona);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = reverseMapField(issue.path[0] as string);
        if (field) newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateAll() && isStepValid()) {
      onNextCombined();
    }
  };

  return (
    <div className="space-y-8">
      {/* ───────── Tarjeta 1: Información Personal ───────── */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <UserRound className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Información Personal</h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Cédula */}
            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Cédula *
              </label>
              <input
                id="idNumber"
                type="text"
                placeholder="Número de cédula"
                value={formData.idNumber}
                onChange={async (e) => {
                  const value = e.target.value;
                  handleInputChange("idNumber", value);
                  validateField("idNumber", value);
                  updateLimitFlag("idNumber", value, 60);

                  if (value.length >= 9) {
                    const result = await lookup(value);
                    if (result) {
                      const nameVal = result.firstname || "";
                      const last1Val = result.lastname1 || "";
                      const last2Val = result.lastname2 || "";

                      // actualizar campos
                      handleInputChange("name", nameVal);
                      handleInputChange("lastName1", last1Val);
                      handleInputChange("lastName2", last2Val);

                      // ✅ validar inmediatamente para limpiar los mensajes en rojo
                      validateField("name", nameVal);
                      validateField("lastName1", last1Val);
                      validateField("lastName2", last2Val);

                      // mantener el indicador de límite coherente
                      updateLimitFlag("name", nameVal, 60);
                      updateLimitFlag("lastName1", last1Val, 60);
                      updateLimitFlag("lastName2", last2Val, 60);
                    }
                  }
                }}
                required
                maxLength={60}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
              {errors.idNumber && <p className="text-sm text-red-600 mt-1">{errors.idNumber}</p>}
              {limitReached["idNumber"] && (
                <p className="text-sm text-orange-600 mt-1">
                  Has alcanzado el límite de 60 caracteres.
                </p>
              )}
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="nameId" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                id="nameId"
                type="text"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={(e) => {
                  handleInputChange("name", e.target.value);
                  validateField("name", e.target.value);
                  updateLimitFlag("name", e.target.value, 60);
                }}
                required
                maxLength={60}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              {limitReached["name"] && (
                <p className="text-sm text-orange-600 mt-1">
                  Has alcanzado el límite de 60 caracteres.
                </p>
              )}
            </div>
          </div>

          {/* Apellidos */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primer Apellido *
              </label>
              <input
                type="text"
                placeholder="Tu primer apellido"
                value={formData.lastName1}
                onChange={(e) => {
                  handleInputChange("lastName1", e.target.value);
                  validateField("lastName1", e.target.value);
                  updateLimitFlag("lastName1", e.target.value, 60);
                }}
                required
                maxLength={60}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
              {errors.lastName1 && <p className="text-sm text-red-600 mt-1">{errors.lastName1}</p>}
              {limitReached["lastName1"] && (
                <p className="text-sm text-orange-600 mt-1">
                  Has alcanzado el límite de 60 caracteres.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Segundo Apellido *
              </label>
              <input
                type="text"
                placeholder="Tu segundo apellido"
                value={formData.lastName2}
                onChange={(e) => {
                  handleInputChange("lastName2", e.target.value);
                  validateField("lastName2", e.target.value);
                  updateLimitFlag("lastName2", e.target.value, 60);
                }}
                required
                maxLength={60}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
              {errors.lastName2 && <p className="text-sm text-red-600 mt-1">{errors.lastName2}</p>}
              {limitReached["lastName2"] && (
                <p className="text-sm text-orange-600 mt-1">
                  Has alcanzado el límite de 60 caracteres.
                </p>
              )}
            </div>
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento *
            </label>
            <input
              type="date"
              value={formData.birthDate}
              max={maxBirthDate} //  NO permite seleccionar menores de 16
              onChange={(e) => {
                handleInputChange("birthDate", e.target.value);
                validateField("birthDate", e.target.value);
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
            />
            {errors.birthDate && <p className="text-sm text-red-600 mt-1">{errors.birthDate}</p>}
          </div>

          {/* Nacionalidad */}
          <div>
            <label htmlFor="nacionalidad" className="block text-sm font-medium text-gray-700 mb-1">
              Nacionalidad
            </label>
            <input
              type="text"
              value={formData.nacionalidad || ""}
              onChange={(e) => {
                handleInputChange("nacionalidad" as any, e.target.value);
                validateField("nacionalidad" as any, e.target.value);
                updateLimitFlag("nacionalidad" as any, e.target.value, 60);
              }}
              placeholder="Ej: Costarricense"
              maxLength={60}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
            />
            {errors.nacionalidad && (
              <p className="text-sm text-red-600 mt-1">{errors.nacionalidad}</p>
            )}
            {limitReached["nacionalidad"] && (
              <p className="text-sm text-orange-600 mt-1">
                Has alcanzado el límite de 60 caracteres.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ───────── Tarjeta 2: Información de Contacto ───────── */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Información de Contacto</h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Teléfono */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                placeholder="Número de teléfono"
                value={formData.phone}
                onChange={(e) => {
                  handleInputChange("phone", e.target.value);
                  validateField("phone", e.target.value);
                  updateLimitFlag("phone", e.target.value, 20);
                }}
                required
                minLength={8}
                maxLength={20}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
              {limitReached["phone"] && (
                <p className="text-sm text-orange-600 mt-1">
                  Has alcanzado el límite de 20 caracteres.
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                Email *
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => {
                  handleInputChange("email", e.target.value);
                  validateField("email", e.target.value);
                  updateLimitFlag("email", e.target.value, 60);
                }}
                required
                maxLength={60}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              {limitReached["email"] && (
                <p className="text-sm text-orange-600 mt-1">
                  Has alcanzado el límite de 60 caracteres.
                </p>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Dirección Completa
            </label>
            <input
              type="text"
              placeholder="Tu dirección completa"
              value={formData.address}
              onChange={(e) => {
                handleInputChange("address", e.target.value);
                validateField("address", e.target.value);
                updateLimitFlag("address", e.target.value, 200);
              }}
              maxLength={200}
              className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
            />
            {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
            {limitReached["address"] && (
              <p className="text-sm text-orange-600 mt-1">
                Has alcanzado el límite de 200 caracteres.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ───────── Botón siguiente ───────── */}
      <div className="text-right">
        <NavigationButtons
          showPrev={false}
          onNext={handleNext}
          disableNext={!isStepValid()}
        />
      </div>
    </div>
  );
}

function mapFormToPersona(data: VolunteersFormData) {
  return {
    cedula: data.idNumber,
    nombre: data.name,
    apellido1: data.lastName1,
    apellido2: data.lastName2,
    telefono: data.phone,
    email: data.email,
    fechaNacimiento: data.birthDate,
    direccion: data.address || "",
    nacionalidad: data.nacionalidad || "",
  };
}

function mapField(field: keyof VolunteersFormData): string {
  const map: Record<string, string> = {
    idNumber: "cedula",
    name: "nombre",
    lastName1: "apellido1",
    lastName2: "apellido2",
    phone: "telefono",
    email: "email",
    birthDate: "fechaNacimiento",
    address: "direccion",
    nacionalidad: "nacionalidad",
  };
  return map[field] || field;
}

function reverseMapField(field: string): keyof VolunteersFormData | null {
  const reverse: Record<string, keyof VolunteersFormData> = {
    cedula: "idNumber",
    nombre: "name",
    apellido1: "lastName1",
    apellido2: "lastName2",
    telefono: "phone",
    email: "email",
    fechaNacimiento: "birthDate",
    direccion: "address",
    nacionalidad: "nacionalidad" as any,
  };
  return reverse[field] || null;
}
