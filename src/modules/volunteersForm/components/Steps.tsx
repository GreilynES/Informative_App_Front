import type { VolunteersFormData } from "../../volunteersInformation/models/VolunteersType";
import { OrganizacionSection } from "../components/OrganizacionSection";
import { RepresentanteSection } from "../components/RepresentanteSection";
import { NavigationButtons } from "../components/NavigationButtons";
import { useMemo } from "react";
import { DisponibilidadAreasSection } from "../components/DisponibilidadAreasSection";
import { MotivacionHabilidadesSection } from "../components/MotivacionHabilidadesSection"; // ✅ NUEVO
import { StepPersonalInformation } from "../steps/stepPersonalInformation";

const SKIP_VALIDATION_ORG = true;

interface StepsProps {
  step: number;
  formData?: VolunteersFormData;
  setFormData?: (data: VolunteersFormData) => void;
  handleInputChange?: (field: string, value: any) => void;
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

        {/* Paso 2: Disponibilidad y Áreas de Interés */}
        {step === 2 && (
          <div className="space-y-6">
            <DisponibilidadAreasSection
              formData={formData}
              handleInputChange={handleInputChange}
              tipoSolicitante="INDIVIDUAL"
            />

            <NavigationButtons
              onPrev={prevStep}
              onNext={nextStep}
              disableNext={false}
            />
          </div>
        )}

        {/* ✅ NUEVO: Paso 3: Motivación, Habilidades y Experiencia */}
        {step === 3 && (
          <div className="space-y-6">
            <MotivacionHabilidadesSection
              formData={formData!}
              handleInputChange={handleInputChange!}
            />

            <NavigationButtons
              onPrev={prevStep}
              onNext={nextStep}
              disableNext={false}
            />
          </div>
        )}

        {/* Paso 4: Confirmación */}
        {step === 4 && (
          <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow-md mb-8">
            <h2 className="text-3xl font-bold text-[#708C3E] text-center mb-6">
              Confirmación de Solicitud
            </h2>

            <div className="space-y-6 text-[#4A4A4A]">
              {/* Datos Personales */}
              <div>
                <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Datos Personales</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <p><span className="text-sm text-gray-500">Nombre:</span> {formData!.name}</p>
                  <p><span className="text-sm text-gray-500">Primer Apellido:</span> {formData!.lastName1}</p>
                  <p><span className="text-sm text-gray-500">Segundo Apellido:</span> {formData!.lastName2}</p>
                  <p><span className="text-sm text-gray-500">Cédula:</span> {formData!.idNumber}</p>
                  <p><span className="text-sm text-gray-500">Fecha de Nacimiento:</span> {formData!.birthDate}</p>
                  <p><span className="text-sm text-gray-500">Nacionalidad:</span> {formData!.nacionalidad || "No especificado"}</p>
                </div>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Contacto</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <p><span className="text-sm text-gray-500">Teléfono:</span> {formData!.phone}</p>
                  <p><span className="text-sm text-gray-500">Email:</span> {formData!.email}</p>
                  <p className="md:col-span-2"><span className="text-sm text-gray-500">Dirección:</span> {formData!.address || "No especificado"}</p>
                </div>
              </div>

              {/* Disponibilidad */}
              {formData!.disponibilidades && formData!.disponibilidades.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Disponibilidad</h3>
                  {formData!.disponibilidades.map((disp, idx) => (
                    <div key={idx} className="mb-3">
                      <p><span className="text-sm text-gray-500">Periodo:</span> {disp.fechaInicio} - {disp.fechaFin}</p>
                      <p><span className="text-sm text-gray-500">Días:</span> {disp.dias.join(', ') || "No especificado"}</p>
                      <p><span className="text-sm text-gray-500">Horarios:</span> {disp.horarios.join(', ') || "No especificado"}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Áreas de Interés */}
              {formData!.areasInteres && formData!.areasInteres.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Áreas de Interés</h3>
                  <ul className="list-disc list-inside">
                    {formData!.areasInteres.map((area, idx) => (
                      <li key={idx} className="text-sm text-gray-700">{area.nombreArea}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ✅ NUEVO: Motivación, Habilidades y Experiencia */}
              <div>
                <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Motivación y Habilidades</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Motivación:</p>
                    <p className="text-sm text-gray-700">{formData!.motivation || "No especificado"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Habilidades:</p>
                    <p className="text-sm text-gray-700">{formData!.volunteeringType || "No especificado"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Experiencia Previa:</p>
                    <p className="text-sm text-gray-700">{formData!.previousExperience || "No especificado"}</p>
                  </div>
                </div>
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

        {/* Paso 5: Enviado */}
        {step === 5 && (
          <div className="bg-white/80 rounded-xl p-8 shadow-md border border-[#DCD6C9] text-center">
            <h2 className="text-3xl font-bold text-[#708C3E] mb-4">¡Solicitud enviada!</h2>
            <p className="text-[#4A4A4A] max-w-2xl mx-auto">
              Gracias por aplicar al voluntariado. Hemos recibido tu información y nos pondremos en contacto contigo por correo o teléfono.
            </p>
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
      if (SKIP_VALIDATION_ORG) return true;

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

        {/* Paso 2: Disponibilidad y Áreas de Interés */}
        {step === 2 && (
          <div className="space-y-6">
            <DisponibilidadAreasSection
              form={form}
              tipoSolicitante="ORGANIZACION"
            />

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
                    <p><span className="text-sm text-gray-500">Nombre:</span> {values.organizacion?.nombre || "N/A"}</p>
                    <p><span className="text-sm text-gray-500">Cédula Jurídica:</span> {values.organizacion?.cedulaJuridica || "N/A"}</p>
                    <p><span className="text-sm text-gray-500">Tipo:</span> {values.organizacion?.tipoOrganizacion || "N/A"}</p>
                    <p><span className="text-sm text-gray-500">N° Voluntarios:</span> {values.organizacion?.numeroVoluntarios || "N/A"}</p>
                    <p className="md:col-span-2"><span className="text-sm text-gray-500">Dirección:</span> {values.organizacion?.direccion || "N/A"}</p>
                    <p><span className="text-sm text-gray-500">Teléfono:</span> {values.organizacion?.telefono || "N/A"}</p>
                    <p><span className="text-sm text-gray-500">Email:</span> {values.organizacion?.email || "N/A"}</p>
                  </div>
                </div>

                {/* Representante */}
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
                    <p><span className="text-sm text-gray-500">Cédula:</span> {values.organizacion?.representante?.persona?.cedula || "N/A"}</p>
                    <p><span className="text-sm text-gray-500">Cargo:</span> {values.organizacion?.representante?.cargo || "N/A"}</p>
                    <p><span className="text-sm text-gray-500">Teléfono:</span> {values.organizacion?.representante?.persona?.telefono || "N/A"}</p>
                    <p className="md:col-span-2"><span className="text-sm text-gray-500">Email:</span> {values.organizacion?.representante?.persona?.email || "N/A"}</p>
                  </div>
                </div>

                {/* Razón Social */}
                {values.organizacion?.razonesSociales && values.organizacion.razonesSociales.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Razón Social</h3>
                    <p className="text-sm text-gray-700">
                      {values.organizacion.razonesSociales[0]?.razonSocial || "No especificado"}
                    </p>
                  </div>
                )}

                {/* Disponibilidad */}
                {values.organizacion?.disponibilidades && values.organizacion.disponibilidades.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Disponibilidad</h3>
                    {values.organizacion.disponibilidades.map((disp: any, idx: number) => (
                      <div key={idx} className="mb-3">
                        <p><span className="text-sm text-gray-500">Periodo:</span> {disp.fechaInicio} - {disp.fechaFin}</p>
                        <p><span className="text-sm text-gray-500">Días:</span> {disp.dias?.join(', ') || "No especificado"}</p>
                        <p><span className="text-sm text-gray-500">Horarios:</span> {disp.horarios?.join(', ') || "No especificado"}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Áreas de Interés */}
                {values.organizacion?.areasInteres && values.organizacion.areasInteres.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Áreas de Interés</h3>
                    <ul className="list-disc list-inside">
                      {values.organizacion.areasInteres.map((area: any, idx: number) => (
                        <li key={idx} className="text-sm text-gray-700">{area.nombreArea}</li>
                      ))}
                    </ul>
                  </div>
                )}
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