import { useState, useCallback, useRef } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import { NavigationButtons } from "../components/NavigationButtons";
import { ForrajeSection } from "../../fincaForm/components/ForrajeSection";
import { RegistroSection } from "../../fincaForm/components/RegistroSection";
import { FuenteAguaSection } from "../../fincaForm/components/FuenteAguaSection";

interface Step3Props {
  form: FormLike;
  onNext: () => void;
  onPrev: () => void;
}

export function Step3({ form, onNext, onPrev }: Step3Props) {
  const [intentoAvanzar, setIntentoAvanzar] = useState(false);
  const [erroresPorSeccion, setErroresPorSeccion] = useState({
    forraje: false,
    registro: false,
    fuentes: false,
    riego: false,
  });

  // Refs para cada sección
  const forrajeRef = useRef<HTMLDivElement>(null);
  const registroRef = useRef<HTMLDivElement>(null);
  const fuenteAguaRef = useRef<HTMLDivElement>(null);

  const scrollToFirstError = (errors: typeof erroresPorSeccion) => {
    // Orden de arriba hacia abajo según el código
    if (errors.forraje && forrajeRef.current) {
      forrajeRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    } else if (errors.registro && registroRef.current) {
      registroRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    } else if ((errors.fuentes || errors.riego) && fuenteAguaRef.current) {
      fuenteAguaRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const handleNext = () => {
    setIntentoAvanzar(true);
    const state = (form as any).state?.values || {};

    // Validar cada sección
    const hasForraje = Array.isArray(state.forrajes) && state.forrajes.length > 0;
    
    const registros = state.registrosProductivos || {};
    const hasRegistro = registros.reproductivos || registros.costosProductivos || registros.noTiene;

    const hasFuentes = Array.isArray(state.fuentesAgua) && state.fuentesAgua.length > 0;
    const hasRiego = Array.isArray(state.metodosRiego) && state.metodosRiego.length > 0;

    // Actualizar errores por sección
    const errors = {
      forraje: !hasForraje,
      registro: !hasRegistro,
      fuentes: !hasFuentes,
      riego: !hasRiego,
    };
    
    setErroresPorSeccion(errors);

    // Si todas las secciones son válidas, avanzar
    const todoValido = hasForraje && hasRegistro && hasFuentes && hasRiego;
    
    if (!todoValido) {
      // Scroll a la primera sección con error (de arriba hacia abajo)
      setTimeout(() => scrollToFirstError(errors), 100);
      return;
    }

    onNext();
  };

  const validateStep = useCallback(() => {
    // Esta función solo se usa para mantener compatibilidad con las secciones
    // La validación real ocurre en handleNext
  }, []);

  return (
    <div className="space-y-6">
 

      {/* Secciones con refs */}
      <div ref={forrajeRef} className="scroll-mt-24">
        <ForrajeSection form={form} onChange={validateStep} showErrors={intentoAvanzar} />
      </div>

      <div ref={registroRef} className="scroll-mt-24">
        <RegistroSection form={form} onChange={validateStep} showErrors={intentoAvanzar} />
      </div>

      <div ref={fuenteAguaRef} className="scroll-mt-24">
        <FuenteAguaSection form={form} onChange={validateStep} showErrors={intentoAvanzar} />
      </div>

      <NavigationButtons
        onPrev={onPrev}
        onNext={handleNext}
      />
    </div>
  );
}