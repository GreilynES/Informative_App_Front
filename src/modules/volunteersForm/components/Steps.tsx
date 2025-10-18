// src/modules/volunteersForm/steps/Steps.tsx

import type { VolunteersFormData } from "../../volunteersInformation/models/VolunteersType";
import { OrganizacionSection } from "../components/OrganizacionSection";
import { RepresentanteSection } from "../components/RepresentanteSection";
import { NavigationButtons } from "../components/NavigationButtons";
import { useMemo } from "react";
import { StepPersonalInformation } from "../steps/stepPersonalInformation";


// ✅ CONSTANTE PARA DESARROLLO
const SKIP_VALIDATION_ORG = true; // Cambiar a false cuando quieras validación real

interface StepsProps {
  step: number;
  formData?: VolunteersFormData;
  setFormData?: (data: VolunteersFormData) => void;
  handleInputChange?: (field: keyof VolunteersFormData, value: string | boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  isStepValid?: () => boolean;
  lookup?: (id: string) => Promise<any>;
  submitIndividual?: (data: any) => Promise<any>;
  tipoSolicitante?: 'INDIVIDUAL' | 'ORGANIZACION';
  form?: any;
  isSubmitting?: boolean;
}

export function Steps({
  step,
  formData,
  handleInputChange,
  nextStep,
  prevStep,
  isStepValid,
  lookup,
  tipoSolicitante = 'INDIVIDUAL',
  form,
  isSubmitting,
  submitIndividual,
}: StepsProps) {
  
  // ========== FLUJO INDIVIDUAL ==========
  if (tipoSolicitante === 'INDIVIDUAL') {
    const goFromCombinedToVolunteering = () => {
      nextStep();
      nextStep();
    };

    return (
      <>
        {/* Paso 1: Información Personal + Contacto */}
        {step === 1 && (
          <StepPersonalInformation
            formData={formData!}
            handleInputChange={handleInputChange!}
            onNextCombined={goFromCombinedToVolunteering}
            isStepValid={isStepValid!}
            lookup={lookup!}
          />
        )}

        {/* Paso 2: Información de Voluntariado */}
        {step === 2 && (
          <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
            <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
              <h3 className="text-lg font-semibold text-[#708C3E]">Información de Voluntariado</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Tipo de Voluntariado *</label>
                  <input
                    type="text"
                    placeholder="Ej: Eventos, Logística, Campo..."
                    value={formData!.volunteeringType}
                    onChange={(e) => handleInputChange!("volunteeringType", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Disponibilidad *</label>
                  <input
                    type="text"
                    placeholder="Días/Horas disponibles"
                    value={formData!.availability}
                    onChange={(e) => handleInputChange!("availability", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Experiencia Previa</label>
                <textarea
                  placeholder="Describe brevemente tu experiencia como voluntario/a (opcional)"
                  value={formData!.previousExperience}
                  onChange={(e) => handleInputChange!("previousExperience", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Motivación</label>
                <textarea
                  placeholder="¿Por qué te gustaría ser voluntario/a?"
                  value={formData!.motivation}
                  onChange={(e) => handleInputChange!("motivation", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                />
              </div>

              <div className="space-y-2">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData!.acceptTerms}
                    onChange={(e) => handleInputChange!("acceptTerms", e.target.checked)}
                    className="rounded border-[#CFCFCF] text-[#708C3E] focus:ring-[#6F8C1F]"
                  />
                  <span className="text-sm text-[#4A4A4A]">Acepto términos y condiciones *</span>
                </label>
                <label className="inline-flex items-center gap-2 block">
                  <input
                    type="checkbox"
                    checked={formData!.receiveInfo}
                    onChange={(e) => handleInputChange!("receiveInfo", e.target.checked)}
                    className="rounded border-[#CFCFCF] text-[#708C3E] focus:ring-[#6F8C1F]"
                  />
                  <span className="text-sm text-[#4A4A4A]">Deseo recibir información y noticias</span>
                </label>
              </div>
            </div>
            <NavigationButtons
              onPrev={prevStep}
              onNext={nextStep}
              disableNext={!isStepValid!()}
            />
          </div>
        )}

        {/* Paso 3: Confirmación */}
        {step === 3 && (
          <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow-md mb-8">
            <h2 className="text-3xl font-bold text-[#708C3E] text-center">Confirmación de Solicitud</h2>

            <div className="space-y-6 text-[#4A4A4A] mt-6">
              <div>
                <h3 className="text-lg font-semibold text-[#708C3E]">Datos Personales</h3>
                <p><span className="text-sm text-gray-500">Nombre:</span> {formData!.name}</p>
                <p><span className="text-sm text-gray-500">Primer Apellido:</span> {formData!.lastName1}</p>
                <p><span className="text-sm text-gray-500">Segundo Apellido:</span> {formData!.lastName2}</p>
                <p><span className="text-sm text-gray-500">Cédula:</span> {formData!.idNumber}</p>
                <p><span className="text-sm text-gray-500">Fecha de Nacimiento:</span> {formData!.birthDate}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#708C3E]">Contacto</h3>
                <p><span className="text-sm text-gray-500">Teléfono:</span> {formData!.phone}</p>
                <p><span className="text-sm text-gray-500">Email:</span> {formData!.email}</p>
                <p><span className="text-sm text-gray-500">Dirección:</span> {formData!.address || "No especificado"}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#708C3E]">Voluntariado</h3>
                <p><span className="text-sm text-gray-500">Tipo de Voluntariado:</span> {formData!.volunteeringType}</p>
                <p><span className="text-sm text-gray-500">Disponibilidad:</span> {formData!.availability}</p>
                <p><span className="text-sm text-gray-500">Experiencia Previa:</span> {formData!.previousExperience || "No especificado"}</p>
                <p><span className="text-sm text-gray-500">Motivación:</span> {formData!.motivation || "No especificado"}</p>
                <p><span className="text-sm text-gray-500">Acepta Términos:</span> {formData!.acceptTerms ? "Sí" : "No"}</p>
                <p><span className="text-sm text-gray-500">Recibir Información:</span> {formData!.receiveInfo ? "Sí" : "No"}</p>
              </div>
            </div>

            <div className="text-center mt-6">
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
                  onClick={async () => {
                    if (submitIndividual && formData) {
                      try {
                        await submitIndividual(formData);
                        nextStep();
                      } catch (error) {
                        console.error("Error al enviar:", error);
                      }
                    }
                  }}
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
          </div>
        )}

        {/* Paso 4: Enviado */}
        {step === 4 && (
          <div className="bg-white/80 rounded-xl p-8 shadow-md border border-[#DCD6C9] text-center">
            <h2 className="text-3xl font-bold text-[#708C3E] mb-4">¡Solicitud enviada!</h2>
            <p className="text-[#4A4A4A] max-w-2xl mx-auto">
              Gracias por aplicar al voluntariado. Hemos recibido tu información y nos pondremos en contacto contigo por correo o teléfono.
            </p>
            <div className="mt-8">
              <NavigationButtons onPrev={prevStep} showNext={false} />
            </div>
          </div>
        )}
      </>
    );
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
      // ✅ MODO DESARROLLO: Permitir siempre avanzar
      if (SKIP_VALIDATION_ORG) return true;

      // ✅ VALIDACIÓN REAL (se activa cuando SKIP_VALIDATION_ORG = false)
      switch (currentStep) {
        case 1: {
          const org = values.organizacion || {};
          const rep = org.representante?.persona || {};

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

          if (!hasAnyOrgData && !hasAnyRepData) {
            return false;
          }

          if (hasAnyOrgData) {
            const isOrgComplete = 
              (org.cedulaJuridica?.length ?? 0) > 0 &&
              (org.nombre?.length ?? 0) > 0 &&
              (org.numeroVoluntarios ?? 0) >= 1 &&
              (org.direccion?.length ?? 0) > 0 &&
              (org.telefono?.length ?? 0) >= 8 &&
              (org.email?.length ?? 0) > 0 &&
              (org.tipoOrganizacion?.length ?? 0) > 0;

            if (!isOrgComplete) return false;
          }

          if (hasAnyRepData) {
            const isRepComplete = 
              (rep.cedula?.length ?? 0) >= 8 &&
              (rep.nombre?.length ?? 0) > 0 &&
              (rep.apellido1?.length ?? 0) > 0 &&
              (rep.apellido2?.length ?? 0) > 0 &&
              (rep.telefono?.length ?? 0) >= 8 &&
              (rep.email?.length ?? 0) > 0 &&
              (org.representante?.cargo?.length ?? 0) > 0;

            if (!isRepComplete) return false;
          }

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