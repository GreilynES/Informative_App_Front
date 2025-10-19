import type { VolunteersFormData } from "../../volunteersInformation/models/VolunteersType";
import { OrganizacionSection } from "../components/OrganizacionSection";
import { RepresentanteSection } from "../components/RepresentanteSection";
import { NavigationButtons } from "../components/NavigationButtons";
import {
  DisponibilidadAreasSection,
  type DisponibilidadAreasSectionHandle,
} from "../components/DisponibilidadAreasSection";
import {
  MotivacionHabilidadesSection,
  type MotivacionHabilidadesSectionHandle, 
} from "../components/MotivacionHabilidadesSection";
import { DocumentUploadVoluntarios } from "../components/DocumentUploadVoluntarios";
import { StepPersonalInformation } from "../steps/stepPersonalInformation";

import { useRef, useState } from "react";

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
  submitOrganizacion?: () => Promise<void>;
  tipoSolicitante?: "INDIVIDUAL" | "ORGANIZACION";
  form?: any;
  isSubmitting?: boolean;
  files?: any;
  setFiles?: (files: any) => void;
}

export function Steps({
  step,
  formData,
  handleInputChange,
  nextStep,
  prevStep,
  isStepValid,
  lookup,
  tipoSolicitante = "INDIVIDUAL",
  form,
  isSubmitting,
  submitIndividual,
  submitOrganizacion,
  files,
  setFiles,
}: StepsProps) {
  
  const dispRefIndividual = useRef<DisponibilidadAreasSectionHandle>(null);
  const dispRefOrg = useRef<DisponibilidadAreasSectionHandle>(null);
  const motivRef = useRef<MotivacionHabilidadesSectionHandle>(null);

  // Flag para mostrar errores en Paso 1 (ORGANIZACIÓN)
  const [showOrgStep1Errors, setShowOrgStep1Errors] = useState(false);

  // ========== FLUJO INDIVIDUAL ==========
  if (tipoSolicitante === "INDIVIDUAL") {
    const goFromCombinedToVolunteering = () => {
      nextStep();
    };

    const handleNextFromDisponibilidad = () => {
      const ok = dispRefIndividual.current?.validateAndShowErrors() ?? false;
      if (!ok) return; 
      nextStep();
    };

    const handleNextFromMotivacion = () => { 
      const ok = motivRef.current?.validateAndShowErrors() ?? false;
      if (!ok) return;
      nextStep();
    };

    return (
      <>
        {step === 1 && (
          <StepPersonalInformation
            formData={formData!}
            handleInputChange={handleInputChange!}
            onNextCombined={goFromCombinedToVolunteering}
            isStepValid={isStepValid!}
            lookup={lookup!}
          />
        )}

        {step === 2 && (
          <div className="space-y-6">
            <DisponibilidadAreasSection
              ref={dispRefIndividual}
              formData={formData}
              handleInputChange={handleInputChange}
              tipoSolicitante="INDIVIDUAL"
            />

            <NavigationButtons
              onPrev={prevStep}
              onNext={handleNextFromDisponibilidad}
              disableNext={false}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <MotivacionHabilidadesSection
              ref={motivRef}
              formData={formData!}
              handleInputChange={handleInputChange!}
            />

            <NavigationButtons onPrev={prevStep} onNext={handleNextFromMotivacion} disableNext={false} />
          </div>
        )}

        {step === 4 && (
          <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
            <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                4
              </div>
              <h3 className="text-lg font-semibold text-[#708C3E]">Documentos</h3>
            </div>

            <DocumentUploadVoluntarios files={files!} setFiles={setFiles!} />

            <NavigationButtons onPrev={prevStep} onNext={nextStep} disableNext={!isStepValid!()} />
          </div>
        )}

        {/* Paso 5: Confirmación */}
        {step === 5 && (
          <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow-md mb-8">
            <h2 className="text-3xl font-bold text-[#708C3E] text-center mb-6">
              Confirmación de Solicitud
            </h2>

            <div className="space-y-6 text-[#4A4A4A]">
              {/* Datos Personales */}
              <div>
                <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Datos Personales</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <p>
                    <span className="text-sm text-gray-500">Nombre:</span> {formData!.name}
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Primer Apellido:</span>{" "}
                    {formData!.lastName1}
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Segundo Apellido:</span>{" "}
                    {formData!.lastName2}
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Cédula:</span> {formData!.idNumber}
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Fecha de Nacimiento:</span>{" "}
                    {formData!.birthDate}
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Nacionalidad:</span>{" "}
                    {formData!.nacionalidad || "No especificado"}
                  </p>
                </div>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Contacto</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <p>
                    <span className="text-sm text-gray-500">Teléfono:</span> {formData!.phone}
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Email:</span> {formData!.email}
                  </p>
                  <p className="md:col-span-2">
                    <span className="text-sm text-gray-500">Dirección:</span>{" "}
                    {formData!.address || "No especificado"}
                  </p>
                </div>
              </div>

              {/* Disponibilidad */}
              {formData!.disponibilidades && formData!.disponibilidades.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Disponibilidad</h3>
                  {formData!.disponibilidades.map((disp, idx) => (
                    <div key={idx} className="mb-3 bg-white p-3 rounded-lg">
                      <p>
                        <span className="text-sm text-gray-500">Periodo:</span> {disp.fechaInicio} -{" "}
                        {disp.fechaFin}
                      </p>
                      <p>
                        <span className="text-sm text-gray-500">Días:</span>{" "}
                        {disp.dias.join(", ") || "No especificado"}
                      </p>
                      <p>
                        <span className="text-sm text-gray-500">Horarios:</span>{" "}
                        {disp.horarios.join(", ") || "No especificado"}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Áreas de Interés */}
              {formData!.areasInteres && formData!.areasInteres.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Áreas de Interés</h3>
                  <ul className="list-disc list-inside bg-white p-3 rounded-lg">
                    {formData!.areasInteres.map((area, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        {area.nombreArea}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Motivación, Habilidades y Experiencia */}
              <div>
                <h3 className="text-lg font-semibold text-[#708C3E] mb-3">
                  Motivación y Habilidades
                </h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-500 font-medium">Motivación:</p>
                    <p className="text-sm text-gray-700 mt-1">
                      {formData!.motivation || "No especificado"}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-500 font-medium">Habilidades:</p>
                    <p className="text-sm text-gray-700 mt-1">
                      {formData!.volunteeringType || "No especificado"}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-500 font-medium">Experiencia Previa:</p>
                    <p className="text-sm text-gray-700 mt-1">
                      {formData!.previousExperience || "No especificado"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documentos adjuntos */}
              <div>
                <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Documentos Adjuntos</h3>
                <div className="space-y-2 bg-white p-3 rounded-lg">
                  <p className="text-sm">
                    <span className="text-gray-500">CV:</span>{" "}
                    {files?.cv ? (
                      <span className="text-green-600">✓ {files.cv.name}</span>
                    ) : (
                      <span className="text-red-600">✗ No adjuntado</span>
                    )}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Cédula:</span>{" "}
                    {files?.cedula ? (
                      <span className="text-green-600">✓ {files.cedula.name}</span>
                    ) : (
                      <span className="text-red-600">✗ No adjuntado</span>
                    )}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Carta de Motivación:</span>{" "}
                    {files?.carta ? (
                      <span className="text-green-600">✓ {files.carta.name}</span>
                    ) : (
                      <span className="text-gray-500">Opcional - No adjuntado</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="mt-8 flex justify-between items-center">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border-2 border-[#708C3E] text-[#708C3E] rounded-lg hover:bg-[#F5F7EC] transition-colors font-medium"
              >
                ← Anterior
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
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  isSubmitting
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#6F8C1F] to-[#475C1D] hover:from-[#5d741c] hover:to-[#384c17] text-white shadow-md"
                }`}
              >
                {isSubmitting ? "Enviando..." : "Enviar Solicitud →"}
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="bg-white/80 rounded-xl p-8 shadow-md border border-[#DCD6C9] text-center">
            {/* ... sin cambios ... */}
          </div>
        )}
      </>
    );
  }

  // ========== FLUJO ORGANIZACIÓN ==========
  if (tipoSolicitante === "ORGANIZACION") {
    if (!form) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Error: Formulario no inicializado</p>
        </div>
      );
    }

    const handleNextFromDisponibilidadOrg = () => {
      const ok = dispRefOrg.current?.validateAndShowErrors() ?? false;
      if (!ok) return; 
      nextStep();
    };

    // >>> FIX: forzar validación tipo "submit" y mostrar errores si hay vacíos
    const handleNextFromOrgStep1 = () => {
      const v = form?.state?.values?.organizacion || {};
      const r = v?.representante || {};
      const p = r?.persona || {};

      const anyEmpty =
        !v.nombre ||
        !v.numeroVoluntarios ||
        !v.cedulaJuridica ||
        !v.tipoOrganizacion ||
        !v.direccion ||
        !v.telefono ||
        !v.email ||
        !r.cargo ||
        !p.cedula ||
        !p.nombre ||
        !p.apellido1 ||
        !p.apellido2 ||
        !p.telefono ||
        !p.email;

      const namesToValidate = [
        "organizacion.nombre",
        "organizacion.numeroVoluntarios",
        "organizacion.cedulaJuridica",
        "organizacion.tipoOrganizacion",
        "organizacion.direccion",
        "organizacion.telefono",
        "organizacion.email",
        "organizacion.representante.cargo",
        "organizacion.representante.persona.cedula",
        "organizacion.representante.persona.nombre",
        "organizacion.representante.persona.apellido1",
        "organizacion.representante.persona.apellido2",
        "organizacion.representante.persona.telefono",
        "organizacion.representante.persona.email",
      ];

      // ⬇ ESTA ES LA LÍNEA CLAVE: pasa el tipo 'submit' para que corran los validators onSubmit
      namesToValidate.forEach((n) => form?.validateField?.(n, "submit"));

      if (anyEmpty) {
        setShowOrgStep1Errors(true);
        return;
      }

      nextStep();
    };

    return (
      <>
        {/* Paso 1: Información de Organización */}
        {step === 1 && (
          <div className="space-y-6">
            <OrganizacionSection form={form!} showErrors={showOrgStep1Errors} />
            <RepresentanteSection form={form} lookup={lookup} showErrors={showOrgStep1Errors} />

            <NavigationButtons
              onPrev={() => {}}
              onNext={handleNextFromOrgStep1}
              disableNext={false}
              hidePrev
            />
          </div>
        )}

        {/* Paso 2: Disponibilidad y Áreas */}
        {step === 2 && (
          <div className="space-y-6">
            <DisponibilidadAreasSection
              ref={dispRefOrg}
              formData={formData}
              handleInputChange={handleInputChange}
              tipoSolicitante="ORGANIZACION"
              form={form}
            />

            <NavigationButtons onPrev={prevStep} onNext={handleNextFromDisponibilidadOrg} disableNext={false} />
          </div>
        )}

        {/* Paso 3 */}
        {step === 3 && (
          <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
            <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <h3 className="text-lg font-semibold text-[#708C3E]">Documentos de la Organización</h3>
            </div>

            <DocumentUploadVoluntarios files={files!} setFiles={setFiles!} />

            <NavigationButtons onPrev={prevStep} onNext={nextStep} disableNext={!isStepValid!()} />
          </div>
        )}

        {/* Paso 4: Confirmación para Organización */}
        {step === 4 && (
          <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow-md">
            <h2 className="text-3xl font-bold text-[#708C3E] text-center mb-6">
              Confirmación de Solicitud - Organización
            </h2>

            <div className="space-y-6 text-[#4A4A4A]">
              {/* Información de la Organización */}
              <div>
                <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Datos de la Organización</h3>
                <div className="bg-white p-4 rounded-lg space-y-2">
                  <p>
                    <span className="text-sm text-gray-500">Nombre:</span>{" "}
                    {form.state.values.organizacion?.nombre || "N/A"}
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Cédula Jurídica:</span>{" "}
                    {form.state.values.organizacion?.cedulaJuridica || "N/A"}
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Tipo:</span>{" "}
                    {form.state.values.organizacion?.tipoOrganizacion || "N/A"}
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Email:</span>{" "}
                    {form.state.values.organizacion?.email || "N/A"}
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Teléfono:</span>{" "}
                    {form.state.values.organizacion?.telefono || "N/A"}
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Dirección:</span>{" "}
                    {form.state.values.organizacion?.direccion || "N/A"}
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">Número de Voluntarios:</span>{" "}
                    {form.state.values.organizacion?.numeroVoluntarios || "N/A"}
                  </p>
                </div>
              </div>

              {/* Representante */}
              {form.state.values.organizacion?.representante?.persona?.nombre && (
                <div>
                  <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Representante</h3>
                  <div className="bg-white p-4 rounded-lg space-y-2">
                    <p>
                      <span className="text-sm text-gray-500">Nombre:</span>{" "}
                      {form.state.values.organizacion.representante.persona.nombre}{" "}
                      {form.state.values.organizacion.representante.persona.apellido1}{" "}
                      {form.state.values.organizacion.representante.persona.apellido2}
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">Cédula:</span>{" "}
                      {form.state.values.organizacion.representante.persona.cedula || "N/A"}
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">Cargo:</span>{" "}
                      {form.state.values.organizacion.representante.cargo || "N/A"}
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">Email:</span>{" "}
                      {form.state.values.organizacion.representante.persona.email || "N/A"}
                    </p>
                    <p>
                      <span className="text-sm text-gray-500">Teléfono:</span>{" "}
                      {form.state.values.organizacion.representante.persona.telefono || "N/A"}
                    </p>
                  </div>
                </div>
              )}

              {/* Disponibilidad */}
              {form.state.values.organizacion?.disponibilidades &&
                form.state.values.organizacion.disponibilidades.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Disponibilidad</h3>
                    {form.state.values.organizacion.disponibilidades.map(
                      (disp: any, idx: number) => (
                        <div key={idx} className="mb-3 bg-white p-3 rounded-lg">
                          <p>
                            <span className="text-sm text-gray-500">Periodo:</span>{" "}
                            {disp.fechaInicio} - {disp.fechaFin}
                          </p>
                          <p>
                            <span className="text-sm text-gray-500">Días:</span>{" "}
                            {disp.dias?.join(", ") || "No especificado"}
                          </p>
                          <p>
                            <span className="text-sm text-gray-500">Horarios:</span>{" "}
                            {disp.horarios?.join(", ") || "No especificado"}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}

              {/* Áreas de Interés */}
              {form.state.values.organizacion?.areasInteres &&
                form.state.values.organizacion.areasInteres.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Áreas de Interés</h3>
                    <ul className="list-disc list-inside bg-white p-3 rounded-lg">
                      {form.state.values.organizacion.areasInteres.map(
                        (area: any, idx: number) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {typeof area === "string" ? area : area.nombreArea}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {/* Razones Sociales */}
              {form.state.values.organizacion?.razonesSociales &&
                form.state.values.organizacion.razonesSociales.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#708C3E] mb-3">Razones Sociales</h3>
                    <ul className="list-disc list-inside bg-white p-3 rounded-lg">
                      {form.state.values.organizacion.razonesSociales.map(
                        (razon: any, idx: number) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {typeof razon === "string" ? razon : razon.razonSocial}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {/* Documentos adjuntos */}
              <div>
                <h3 className="text-lg font-semibold text-[#708C3E] mb-3">
                  Documentos Adjuntos
                </h3>
                <div className="space-y-2 bg-white p-3 rounded-lg">
                  <p className="text-sm">
                    <span className="text-gray-500">Documento Legal:</span>{" "}
                    {files?.cedula ? (
                      <span className="text-green-600">✓ {files.cedula.name}</span>
                    ) : (
                      <span className="text-red-600">✗ No adjuntado</span>
                    )}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Carta de Presentación:</span>{" "}
                    {files?.carta ? (
                      <span className="text-green-600">✓ {files.carta.name}</span>
                    ) : (
                      <span className="text-gray-500">Opcional - No adjuntado</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border-2 border-[#708C3E] text-[#708C3E] rounded-lg hover:bg-[#F5F7EC] transition-colors font-medium"
              >
                ← Anterior
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (submitOrganizacion) {
                    try {
                      await submitOrganizacion();
                    } catch (error) {
                      console.error("[Steps] Error al enviar:", error);
                    }
                  }
                }}
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  isSubmitting
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#6F8C1F] to-[#475C1D] hover:from-[#5d741c] hover:to-[#384c17] text-white shadow-md"
                }`}
              >
                {isSubmitting ? "Enviando..." : "Enviar Solicitud →"}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}