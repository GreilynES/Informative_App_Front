import { useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";

interface Props {
  form: FormLike;
}

export function AgroActivitiesCard({ form }: Props) {
  const [input, setInput] = useState("");
  const items = ((form as any).state.values.actividadesAgropecuarias ?? []) as any[];

  const add = () => {
    const v = input.trim();
    if (!v) return;
    
    const current = ((form as any).state.values.actividadesAgropecuarias ?? []) as any[];
    const exists = current.some((x) =>
      String(typeof x === "string" ? x : x?.nombre).toLowerCase() === v.toLowerCase()
    );
    
    if (exists) return;
    
    form.setFieldValue("actividadesAgropecuarias", [...current, { nombre: v }]);
    setInput("");
  };

  const remove = (i: number) => {
    const current = ((form as any).state.values.actividadesAgropecuarias ?? []) as any[];
    form.setFieldValue(
      "actividadesAgropecuarias",
      current.filter((_: any, idx: number) => idx !== i)
    );
  };

  return (
    <section>
      <label className="block text-base font-semibold mb-3 text-[#4A4A4A]">
        ¿Qué cultivos o actividades tiene en su finca?
      </label>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          className="flex-1 px-3 py-2 border rounded-md border-[#CFCFCF] focus:ring-[#6F8C1F] focus:outline-none"
          placeholder="Ej. Maíz, Huerta, Porcicultura..."
        />
        <button
          type="button"
          onClick={add}
          className="px-4 py-2 rounded-md bg-[#708C3E] text-white hover:opacity-90 transition-opacity"
        >
          Agregar
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {items.map((x: any, i: number) =>
          <span key={i} className="inline-flex items-center px-2 py-1 bg-[#DCF2C7] rounded">
            {x.nombre}
            <button
              type="button"
              onClick={() => remove(i)}
              className="ml-2 text-red-600 text-xs hover:text-red-800 font-bold"
            >
              ×
            </button>
          </span>
        )}
      </div>
    </section>
  );
}