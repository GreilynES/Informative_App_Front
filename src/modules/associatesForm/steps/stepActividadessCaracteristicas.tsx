import { useState, useRef } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import { ActividadesInfraestructuraSection } from "../components/ActividadesInfraestructuraSection";
import { CaracteristicasFisicasSection } from "../components/CaracteristicasFisicasSection";
import { InfraestructuraSection } from "../components/InfraestructuraSection";
import { NavigationButtons } from "../components/NavigationButtons";

interface Step4Props {
  form: FormLike;
  onNext: () => void;
  onPrev: () => void;
}

export function Step4({ form, onNext, onPrev }: Step4Props) {
  const [intentado, setIntentado] = useState(false);

  // Refs para cada sección (preparado para validaciones futuras)
  const actividadesRef = useRef<HTMLDivElement>(null);
  const caracteristicasRef = useRef<HTMLDivElement>(null);
  const infraestructuraRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setIntentado(true);
    // En este paso no hay campos obligatorios según la validación del Step
    // pero mantenemos la estructura por consistencia
    
    // Si en el futuro se agregan validaciones, implementar aquí:
    // const errors = {
    //   actividades: false,
    //   caracteristicas: false,
    //   infraestructura: false,
    // };
    // 
    // if (Object.values(errors).some(e => e)) {
    //   setTimeout(() => scrollToFirstError(errors), 100);
    //   return;
    // }
    
    onNext();
  };

  // Función preparada para scroll a errores futuros
  // const scrollToFirstError = (errors: any) => {
  //   if (errors.actividades && actividadesRef.current) {
  //     actividadesRef.current.scrollIntoView({ 
  //       behavior: 'smooth', 
  //       block: 'start',
  //       inline: 'nearest'
  //     });
  //   } else if (errors.caracteristicas && caracteristicasRef.current) {
  //     caracteristicasRef.current.scrollIntoView({ 
  //       behavior: 'smooth', 
  //       block: 'start',
  //       inline: 'nearest'
  //     });
  //   } else if (errors.infraestructura && infraestructuraRef.current) {
  //     infraestructuraRef.current.scrollIntoView({ 
  //       behavior: 'smooth', 
  //       block: 'start',
  //       inline: 'nearest'
  //     });
  //   }
  // };

  return (
    <div className="space-y-6">
      {/* Secciones con refs para scroll */}
      <div ref={actividadesRef} className="scroll-mt-24">
        <ActividadesInfraestructuraSection form={form} showErrors={intentado} />
      </div>

      <div ref={caracteristicasRef} className="scroll-mt-24">
        <CaracteristicasFisicasSection form={form} showErrors={intentado} />
      </div>

      <div ref={infraestructuraRef} className="scroll-mt-24">
        <InfraestructuraSection form={form} showErrors={intentado} />
      </div>

      <NavigationButtons 
        onPrev={onPrev} 
        onNext={handleNext}
      />
    </div>
  );
}