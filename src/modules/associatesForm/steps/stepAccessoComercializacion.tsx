import { useEffect, useState } from "react";
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

  // 🧩 Forzamos actualización cada vez que cambian los valores del form
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

  // 🔍 Leemos valores actuales del formulario
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

  const handleNext = () => {
    setIntentado(true);
    if (!disableNext) onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <AccesoSection form={form} />
        {intentado && faltan.accesos && (
          <p className="text-sm text-red-600 text-center mt-2">
            Debe seleccionar o ingresar al menos una{" "}
            <strong>vía de acceso</strong>.
          </p>
        )}
      </div>

      <div>
        <ComercializacionSection form={form} />
        {intentado && faltan.canales && (
          <p className="text-sm text-red-600 text-center mt-2">
            Debe seleccionar o ingresar al menos un{" "}
            <strong>canal de comercialización</strong>.
          </p>
        )}
      </div>

      <div>
        <NecesidadesSection form={form} />
        {intentado && faltan.necesidades && (
          <p className="text-sm text-red-600 text-center mt-2">
            Debe ingresar al menos una <strong>necesidad o mejora</strong>.
          </p>
        )}
      </div>

      <NavigationButtons
        onPrev={onPrev}
        onNext={handleNext}
        disableNext={disableNext}
      />
    </div>
  );
}
