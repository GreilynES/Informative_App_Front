import type { FormLike } from "../../../shared/types/form-lite";

interface Props {
  form: FormLike;
}

export function TiposCercaCard({ form }: Props) {
  const v = ((form as any).state.values.tipoCerca ?? {
    viva: false,
    electrica: false,
    pMuerto: false,
    otra: "",
  }) as any;

  const setV = (k: "viva" | "electrica" | "pMuerto" | "otra", val: any) => {
    const current = ((form as any).state.values.tipoCerca ?? {
      viva: false,
      electrica: false,
      pMuerto: false,
      otra: "",
    }) as any;
    
    (form as any).setFieldValue("tipoCerca", { ...current, [k]: val });
  };

  return (
    <div className="space-y-3">
      <div className="font-medium text-[#4A4A4A]">¿Su finca posee cerca? Seleccione el tipo:</div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input 
          type="checkbox" 
          checked={!!v.viva} 
          onChange={(e) => setV("viva", e.target.checked)}
          className="cursor-pointer"
        />
        Viva
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input 
          type="checkbox" 
          checked={!!v.electrica} 
          onChange={(e) => setV("electrica", e.target.checked)}
          className="cursor-pointer"
        />
        Eléctrica
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input 
          type="checkbox" 
          checked={!!v.pMuerto} 
          onChange={(e) => setV("pMuerto", e.target.checked)}
          className="cursor-pointer"
        />
        P. muerto
      </label>

      <input
        type="text"
        placeholder="Otro tipo de cerca…"
        value={v.otra ?? ""}
        onChange={(e) => setV("otra", e.target.value)}
        className="w-full px-3 py-2 border rounded-md border-[#CFCFCF] focus:ring-[#6F8C1F] focus:outline-none"
      />
    </div>
  );
}