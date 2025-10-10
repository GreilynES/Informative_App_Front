import React from "react";
import { NavigationButtons } from "../components/NavigationButtons";
import { AgroActivitiesCard } from "../../fincaForm/components/AgropecuariosSection";
import { InfraProduccionCard } from "../../fincaForm/components/InfraProductionSection";
import { TiposCercaCard } from "../../fincaForm/components/TipoCercaSection";
import { EquiposCard } from "../../fincaForm/components/EquiposSection";
import type { FormLike } from "../../../shared/types/form-lite";

type Props = {
  nextStep: () => void;
  prevStep: () => void;
  form: FormLike;  // ← AGREGAR ESTA PROP
};

function Card({
  number,
  title,
  children,
}: {
  number: string | number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full text-white grid place-items-center font-bold">
          {number}
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">{title}</h3>
      </div>
      <div className="p-6 flex flex-col gap-8">{children}</div>
    </div>
  );
}

export default function StepAgroYEquipos({ nextStep, prevStep, form }: Props) {
  return (
    <div className="flex flex-col gap-8">
      {/* CARD 1: Actividades + Infraestructura */}
      <Card
        number="7"
        title="Otras Actividades e Infraestructura de Producción"
      >
        <AgroActivitiesCard form={form} />
        <InfraProduccionCard form={form} />
      </Card>

      {/* CARD 2: Tipo de cerca + Equipos */}
      <Card number="8" title="Características físicas y equipos de la finca">
        <TiposCercaCard form={form} />
        <EquiposCard form={form} />
      </Card>

      <NavigationButtons onPrev={prevStep} onNext={nextStep} />
    </div>
  );
}