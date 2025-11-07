import { useEffect, useState, useRef } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import { AccesoSection } from "../../fincaForm/components/AccesoSection";
import { ComercializacionSection } from "../../fincaForm/components/ComercializacionSection";
import { NecesidadesSection } from "../../fincaForm/components/NecesidadesSection";
import { NavigationButtons } from "../components/NavigationButtons";

interface Step5Props {
  form: FormLike;
  onNext: () => void;
  onPrev: () => void;
}

export function Step5({ form, onNext, onPrev }: Step5Props) {
  const [intentado, setIntentado] = useState(false);
  const [, setTick] = useState(0);

  // Refs para cada sección
  const accesoRef = useRef<HTMLDivElement>(null);
  const comercializacionRef = useRef<HTMLDivElement>(null);
  const necesidadesRef = useRef<HTMLDivElement>(null);

  // Forzamos actualización cada vez que cambian los valores del form
  useEffect(() => {
    const unsubscribe = (form as any).subscribe?.(() => {
      setTick((t) => t + 1);
    });

    // si el form no tiene subscribe, hacemos un fallback polling
    if (!unsubscribe) {
      const interval = setInterval(() => setTick((t) => t + 1), 500);
      return () => clearInterval(interval);
    }

    return () => unsubscribe?.();
  }, [form]);

  // Leemos valores actuales del formulario
  const valores = (form as any).state?.values || {};
  const accesos = valores.viasAcceso?.accesos || [];
  const canales = valores.comercializacion?.canales || [];
  const necesidades = (valores.necesidadesObservaciones?.necesidades || []).filter(
    (n: string) => n && n.trim() !== ""
  );

  const faltan = {
    accesos: accesos.length === 0,
    canales: canales.length === 0,
    necesidades: necesidades.length === 0,
  };

  const disableNext = faltan.accesos || faltan.canales || faltan.necesidades;

  const scrollToFirstError = (errors: typeof faltan) => {
    // Orden de arriba hacia abajo según el código
    if (errors.accesos && accesoRef.current) {
      accesoRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    } else if (errors.canales && comercializacionRef.current) {
      comercializacionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    } else if (errors.necesidades && necesidadesRef.current) {
      necesidadesRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const handleNext = () => {
    setIntentado(true);
    
    if (!disableNext) {
      onNext();
    } else {
      // Scroll a la primera sección con error (de arriba hacia abajo)
      setTimeout(() => scrollToFirstError(faltan), 100);
    }
  };

  return (
    <div className="space-y-6">
      {/* Secciones con refs y scroll-margin */}
      <div ref={accesoRef} className="scroll-mt-24">
        <AccesoSection form={form} showErrors={intentado} />
        {intentado && faltan.accesos && (
          <div className="mt-2 px-6">
            <p className="text-sm text-red-600">
              Debe seleccionar o ingresar al menos una vía de acceso
            </p>
          </div>
        )}
      </div>

      <div ref={comercializacionRef} className="scroll-mt-24">
        <ComercializacionSection form={form} showErrors={intentado} />
        {intentado && faltan.canales && (
          <div className="mt-2 px-6">
            <p className="text-sm text-red-600">
              Debe seleccionar o ingresar al menos un canal de comercialización
            </p>
          </div>
        )}
      </div>

      <div ref={necesidadesRef} className="scroll-mt-24">
        <NecesidadesSection form={form} showErrors={intentado} />
        {intentado && faltan.necesidades && (
          <div className="mt-2 px-6">
            <p className="text-sm text-red-600">
              Debe ingresar al menos una necesidad o mejora en el primer campo
            </p>
          </div>
        )}
      </div>

      <NavigationButtons
        onPrev={onPrev}
        onNext={handleNext}
        disableNext={false}
      />
    </div>
  );
}