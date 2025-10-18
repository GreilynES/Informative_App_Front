import type { VolunteersFormData } from "../../volunteersInformation/models/VolunteersType";
import { OrganizacionSection } from "../components/OrganizacionSection";
import { RepresentanteSection } from "../components/RepresentanteSection";
import { NavigationButtons } from "../components/NavigationButtons";
import { useMemo } from "react";

interface StepsProps {
  step: number;
  formData?: VolunteersFormData;
  setFormData?: (data: VolunteersFormData) => void;
  handleInputChange?: (field: keyof VolunteersFormData, value: string | boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  isStepValid?: () => boolean;
  lookup?: (id: string) => Promise<any>;
  
  tipoSolicitante?: 'INDIVIDUAL' | 'ORGANIZACION';
  form?: any;
  isSubmitting?: boolean;
}

export function Steps({
  step,
  nextStep,
  prevStep,
  tipoSolicitante = 'INDIVIDUAL',
  form,
  isSubmitting,
}: StepsProps) {
  
  // ========== FLUJO INDIVIDUAL ==========
  if (tipoSolicitante === 'INDIVIDUAL') {
    // ... (código de Individual sin cambios)
  }

  // ========== FLUJO ORGANIZACIÓN ==========
  if (tipoSolicitante === 'ORGANIZACION') {
    if (!form) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Error: Formulario no inicializado</p>
        </div>
      );
    }

    const getValues = () => {
      const anyForm = form as any;
      if (anyForm?.state?.values) return anyForm.state.values;
      if (anyForm?.values) return anyForm.values;
      return {};
    };

    const values = getValues();

    
const checkStepValidity = (currentStep: number, values: any) => {
  switch (currentStep) {
    case 1: {
      const org = values.organizacion || {};
      const rep = org.representante?.persona || {};

      // ✅ Verificar si el usuario está llenando organización o representante
      const hasAnyOrgData = 
        (org.cedulaJuridica?.length ?? 0) > 0 ||
        (org.nombre?.length ?? 0) > 0 ||
        (org.numeroVoluntarios ?? 0) > 0 ||
        (org.direccion?.length ?? 0) > 0 ||
        (org.telefono?.length ?? 0) > 0 ||
        (org.email?.length ?? 0) > 0 ||
        (org.tipoOrganizacion?.length ?? 0) > 0;

      const hasAnyRepData = 
        (rep.cedula?.length ?? 0) > 0 ||
        (rep.nombre?.length ?? 0) > 0 ||
        (rep.apellido1?.length ?? 0) > 0 ||
        (rep.apellido2?.length ?? 0) > 0 ||
        (rep.telefono?.length ?? 0) > 0 ||
        (rep.email?.length ?? 0) > 0 ||
        (org.representante?.cargo?.length ?? 0) > 0;

      // ✅ Si no hay datos en ninguna sección, no permitir avanzar
      if (!hasAnyOrgData && !hasAnyRepData) {
        return false;
      }

      // ✅ Si está llenando Organización, validar que esté completa
      if (hasAnyOrgData) {
        const isOrgComplete = 
          (org.cedulaJuridica?.length ?? 0) > 0 &&
          (org.nombre?.length ?? 0) > 0 &&
          (org.numeroVoluntarios ?? 0) >= 1 &&
          (org.direccion?.length ?? 0) > 0 &&
          (org.telefono?.length ?? 0) >= 8 &&
          (org.email?.length ?? 0) > 0 &&
          (org.tipoOrganizacion?.length ?? 0) > 0;

        // Si no está completa, no permitir avanzar
        if (!isOrgComplete) return false;
      }

      // ✅ Si está llenando Representante, validar que esté completo
      if (hasAnyRepData) {
        const isRepComplete = 
          (rep.cedula?.length ?? 0) >= 8 &&
          (rep.nombre?.length ?? 0) > 0 &&
          (rep.apellido1?.length ?? 0) > 0 &&
          (rep.apellido2?.length ?? 0) > 0 &&
          (rep.telefono?.length ?? 0) >= 8 &&
          (rep.email?.length ?? 0) > 0 &&
          (org.representante?.cargo?.length ?? 0) > 0;

        // Si no está completo, no permitir avanzar
        if (!isRepComplete) return false;
      }

      // ✅ Si llegó aquí, al menos una sección está completa
      return true;
    }

    case 2:
      return true;

    case 3:
      return true;

    default:
      return false;
  }
};

    const canProceed = useMemo(
      () => checkStepValidity(step, values), 
      [step, values]
    );

    return (
      <>
        {/* Paso 1: Organización + Representante */}
        {step === 1 && (
          <div className="space-y-6">
            <OrganizacionSection form={form} />
            <RepresentanteSection form={form} />

            <NavigationButtons 
              onNext={nextStep}
              showPrev={false}
              disableNext={!canProceed}
            />
          </div>
        )}

        {/* Paso 2: Disponibilidad */}
        {step === 2 && (
          <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
            <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <h3 className="text-lg font-semibold text-[#708C3E]">
                Disponibilidad y Áreas de Interés
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-gray-600">
                Esta sección se completará próximamente con:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Razones sociales / Objetivos</li>
                <li>Horarios de disponibilidad</li>
                <li>Áreas de interés</li>
              </ul>
            </div>

            <NavigationButtons
              onPrev={prevStep}
              onNext={nextStep}
              disableNext={!canProceed}
            />
          </div>
        )}

        {/* Paso 3: Confirmación */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow-md">
              <h2 className="text-3xl font-bold text-[#708C3E] text-center mb-6">
                Confirmación de Solicitud
              </h2>

              <div className="space-y-6 text-[#4A4A4A]">
                {/* Datos de la Organización */}
                <div>
                  <h3 className="text-lg font-semibold text-[#708C3E] mb-3">
                    Datos de la Organización
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <p>
                      <span className="text-sm text-gray-500">Nombre:</span>{" "}
                      {values.organizacion?.nombre || "N/A"}
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">Cédula Jurídica:</span>{" "}
                      {values.organizacion?.cedulaJuridica || "N/A"}
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">Tipo:</span>{" "}
                      {values.organizacion?.tipoOrganizacion || "N/A"}
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">N° Voluntarios:</span>{" "}
                      {values.organizacion?.numeroVoluntarios || "N/A"}
                    </p>
                    <p className="md:col-span-2">
                      <span className="text-sm text-gray-500">Dirección:</span>{" "}
                      {values.organizacion?.direccion || "N/A"}
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">Teléfono:</span>{" "}
                      {values.organizacion?.telefono || "N/A"}
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">Email:</span>{" "}
                      {values.organizacion?.email || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Datos del Representante */}
                <div>
                  <h3 className="text-lg font-semibold text-[#708C3E] mb-3">
                    Representante / Persona de Contacto
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <p>
                      <span className="text-sm text-gray-500">Nombre Completo:</span>{" "}
                      {`${values.organizacion?.representante?.persona?.nombre || ""} ${
                        values.organizacion?.representante?.persona?.apellido1 || ""
                      } ${values.organizacion?.representante?.persona?.apellido2 || ""}`}
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">Cédula:</span>{" "}
                      {values.organizacion?.representante?.persona?.cedula || "N/A"}
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">Cargo:</span>{" "}
                      {values.organizacion?.representante?.cargo || "N/A"}
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">Teléfono:</span>{" "}
                      {values.organizacion?.representante?.persona?.telefono || "N/A"}
                    </p>
                    <p className="md:col-span-2">
                      <span className="text-sm text-gray-500">Email:</span>{" "}
                      {values.organizacion?.representante?.persona?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de navegación */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 border border-[#708C3E] text-[#708C3E] rounded-md hover:bg-[#F5F7EC] transition-colors"
              >
                Anterior
              </button>

              <button
                type="button"
                onClick={() => form.handleSubmit()}
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-md font-medium transition-colors ${
                  isSubmitting
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#6F8C1F] to-[#475C1D] hover:from-[#5d741c] hover:to-[#384c17] text-white"
                }`}
              >
                {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}