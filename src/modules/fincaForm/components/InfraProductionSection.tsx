import type { FormLike } from "../../../shared/types/form-lite";

interface Props {
  form: FormLike;
}

export function InfraProduccionCard({ form }: Props) {
  const v = ((form as any).state.values.infraestructuraProduccion ?? {
    numeroAparatos: 0,
    numeroBebederos: 0,
    numeroSaleros: 0,
  }) as any;

  const set = (k: string, val: string) => {
    const current = ((form as any).state.values.infraestructuraProduccion ?? {
      numeroAparatos: 0,
      numeroBebederos: 0,
      numeroSaleros: 0,
    }) as any;
    
    const numValue = Math.max(0, parseInt(val || "0", 10) || 0);
    
    (form as any).setFieldValue("infraestructuraProduccion", {
      ...current,
      [k]: numValue,
    });
  };

  return (
    <section>
      <label className="block text-base font-semibold mb-3 text-[#4A4A4A]">
        ¿Qué tipo de infraestructura y equipo para la producción posee? Escriba la cantidad
      </label>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Aparatos</label>
          <input
            type="number"
            min={0}
            value={v?.numeroAparatos ?? 0}
            onChange={e => set("numeroAparatos", e.target.value)}
            className="w-full px-3 py-2 border rounded-md border-[#CFCFCF] focus:ring-[#6F8C1F] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Bebederos</label>
          <input
            type="number"
            min={0}
            value={v?.numeroBebederos ?? 0}
            onChange={e => set("numeroBebederos", e.target.value)}
            className="w-full px-3 py-2 border rounded-md border-[#CFCFCF] focus:ring-[#6F8C1F] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Saleros</label>
          <input
            type="number"
            min={0}
            value={v?.numeroSaleros ?? 0}
            onChange={e => set("numeroSaleros", e.target.value)}
            className="w-full px-3 py-2 border rounded-md border-[#CFCFCF] focus:ring-[#6F8C1F] focus:outline-none"
          />
        </div>
      </div>
    </section>
  );
}