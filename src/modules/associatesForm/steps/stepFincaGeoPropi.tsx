import { useRef, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import { NavigationButtons } from "../components/NavigationButtons";
import { FincaBasicInfo } from "../../fincaForm/components/FincaBasicInfo";
import { GeografiaSection } from "../../fincaForm/components/GeografiaSection";
import { PropietarioSection} from "../../fincaForm/components/PropieatarioSection";
import { HatoSection} from "../../fincaForm/components/HatoSection";

interface Step2Props {
  form: FormLike;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
}

export function Step2({ form, onNext, onPrev, canProceed }: Step2Props) {
  const [intentoAvanzar, setIntentoAvanzar] = useState(false);
  const [erroresPorSeccion, setErroresPorSeccion] = useState({
    finca: false,
    geografia: false,
    propietario: false,
    hato: false,
  });

  // Refs individuales para cada sección
  const fincaRef = useRef<HTMLDivElement>(null);
  const geografiaRef = useRef<HTMLDivElement>(null);
  const propietarioRef = useRef<HTMLDivElement>(null);
  const hatoRef = useRef<HTMLDivElement>(null);

  // Función de scroll al primer error (orden de arriba a abajo)
  const scrollToFirstError = (errors: typeof erroresPorSeccion) => {
    if (errors.finca && fincaRef.current) {
      fincaRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    } else if (errors.geografia && geografiaRef.current) {
      geografiaRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    } else if (errors.propietario && propietarioRef.current) {
      propietarioRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    } else if (errors.hato && hatoRef.current) {
      hatoRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const handleNext = () => {
    setIntentoAvanzar(true);
    
    const values = (form as any).state?.values || {};
    
    // Validar campos de finca básica
    const areaOk = values.areaHa !== null && 
                   values.areaHa !== undefined && 
                   String(values.areaHa).trim() !== "" &&
                   Number(values.areaHa) > 0;

    const fincaValid =
      (values.nombreFinca?.length ?? 0) >= 1 &&
      areaOk &&
      (values.numeroPlano?.length ?? 0) >= 1;

    // Validar geografía
    const geografiaValid =
      (values.provincia?.length ?? 0) >= 1 &&
      (values.canton?.length ?? 0) >= 1 &&
      (values.distrito?.length ?? 0) >= 1;

    // Validar propietario si no es propietario
    let propietarioValid = true;
    if (values.esPropietario === false) {
      propietarioValid = !!(
        (values.propietarioCedula?.length ?? 0) >= 8 &&
        (values.propietarioNombre?.length ?? 0) >= 1 &&
        (values.propietarioApellido1?.length ?? 0) >= 1 &&
        (values.propietarioApellido2?.length ?? 0) >= 1 &&
        (values.propietarioTelefono?.length ?? 0) >= 8 &&
        (values.propietarioEmail?.length ?? 0) >= 1 &&
        !!values.propietarioFechaNacimiento
      );
    }

    // Validar hato ganadero
    const hatoData = values.hatoData || {};
    const animales = hatoData.animales || [];
    const hatoValid = 
      (hatoData.tipoExplotacion?.length ?? 0) >= 1 &&
      Array.isArray(animales) && 
      animales.length > 0;

    // Actualizar errores
    const errors = {
      finca: !fincaValid,
      geografia: !geografiaValid,
      propietario: !propietarioValid && values.esPropietario === false,
      hato: !hatoValid,
    };
    
    setErroresPorSeccion(errors);

    const todoValido = fincaValid && geografiaValid && propietarioValid && hatoValid;

    if (!todoValido) {
      // Scroll al primer error con delay para que el DOM se actualice
      setTimeout(() => scrollToFirstError(errors), 100);
      return;
    }

    // Si todo está válido, avanzar
    onNext();
  };

  return (
    <div className="space-y-6">

      {/* Sección 1: Información Básica con ref y scroll-margin */}
      <div ref={fincaRef} className="scroll-mt-24">
        <FincaBasicInfo form={form} forceValidation={intentoAvanzar} />
        {intentoAvanzar && erroresPorSeccion.finca && (
          <div className="mt-2 px-6">
            <p className="text-sm text-red-600">
              Complete todos los campos obligatorios de información de la finca
            </p>
          </div>
        )}
      </div>

      {/* Sección 2: Geografía con ref y scroll-margin */}
      <div ref={geografiaRef} className="scroll-mt-24">
        <GeografiaSection form={form} forceValidation={intentoAvanzar} />
        {intentoAvanzar && erroresPorSeccion.geografia && (
          <div className="mt-2 px-6">
            <p className="text-sm text-red-600">
              Seleccione la provincia, cantón y distrito
            </p>
          </div>
        )}
      </div>

      {/* Sección 3: Propietario con ref y scroll-margin */}
      <div ref={propietarioRef} className="scroll-mt-24">
        <PropietarioSection form={form}/>
        {intentoAvanzar && erroresPorSeccion.propietario && (
          <div className="mt-2 px-6">
            <p className="text-sm text-red-600">
              Complete toda la información del propietario de la finca
            </p>
          </div>
        )}
      </div>

      {/* Sección 4: Hato Ganadero con ref y scroll-margin */}
      <div ref={hatoRef} className="scroll-mt-24">
        <HatoSection form={form} onNext={onNext} onPrev={onPrev} forceValidation={intentoAvanzar}/>
      </div>

      <NavigationButtons 
        onPrev={onPrev} 
        onNext={handleNext}
      />
    </div>
  );
}