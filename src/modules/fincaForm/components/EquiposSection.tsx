import type { FormLike } from "../../../shared/types/form-lite";

const EQUIPOS_FIJOS = [
  "Tractor",
  "Bomba de agua",
  "Carreta",
  "Motosierra",
  "Picadora eléctrica",
  "Picadora de combustible",
  "Tanque de ordeño",
];

interface Props {
  form: FormLike;
}

export function EquiposCard({ form }: Props) {
  const seleccionados = ((form as any).state.values.equiposSeleccionados ?? []) as string[];
  const otro = ((form as any).state.values.otroEquipoTexto ?? "") as string;

  const toggle = (nombre: string) => {
    const current = ((form as any).state.values.equiposSeleccionados ?? []) as string[];
    
    if (current.includes(nombre)) {
      (form as any).setFieldValue(
        "equiposSeleccionados",
        current.filter((x) => x !== nombre)
      );
    } else {
      (form as any).setFieldValue("equiposSeleccionados", [...current, nombre]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="font-medium text-[#4A4A4A]">Seleccione los equipos con que cuenta:</div>
      {EQUIPOS_FIJOS.map((eq) => (
        <label key={eq} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={seleccionados.includes(eq)}
            onChange={() => toggle(eq)}
            className="cursor-pointer"
          />
          {eq}
        </label>
      ))}

      <input
        type="text"
        placeholder="Otro equipo…"
        value={otro}
        onChange={(e) => (form as any).setFieldValue("otroEquipoTexto", e.target.value)}
        className="w-full px-3 py-2 border rounded-md border-[#CFCFCF] focus:ring-[#6F8C1F] focus:outline-none"
      />
    </div>
  );
}