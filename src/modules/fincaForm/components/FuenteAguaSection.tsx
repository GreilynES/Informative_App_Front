import { useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import {
  fuenteAguaItemSchema,
  metodoRiegoItemSchema,
} from "../../fincaForm/schema/fincaSchema";
import { Droplets } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface FuenteAguaSectionProps {
  form: FormLike;
  onChange?: () => void;
  showErrors?: boolean;
}

/** Error con alto fijo para no mover el layout */
function FieldError({ msg }: { msg?: string }) {
  return (
    <p className={`mt-1 h-5 text-sm ${msg ? "text-red-600" : "text-transparent"}`}>
      {msg || "placeholder"}
    </p>
  );
}

export function FuenteAguaSection({ form, onChange, showErrors = false }: FuenteAguaSectionProps) {
  const existentesFuentes = (form as any).state?.values?.fuentesAgua || [];
  const existentesRiego = (form as any).state?.values?.metodosRiego || [];

  const [fuentesText, setFuentesText] = useState<string>(
    existentesFuentes.map((f: any) => (typeof f === "string" ? f : f?.nombre))
      .filter(Boolean)
      .join("\n")
  );

  const [riegoText, setRiegoText] = useState<string>(
    existentesRiego.map((r: any) => (typeof r === "string" ? r : r?.tipo))
      .filter(Boolean)
      .join("\n")
  );

  const [fuentesError, setFuentesError] = useState<string>("");
  const [riegoError, setRiegoError] = useState<string>("");
  const [fuentesTouched, setFuentesTouched] = useState(false);
  const [riegoTouched, setRiegoTouched] = useState(false);

  const sanitizeTextarea = (s: string) =>
    s.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s,\n]/g, "");

  const parseList = (text: string) =>
    Array.from(
      new Set(
        text
          .split(/[\n,]/g)
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      )
    );

  const validateFuentes = (text: string) => {
    const items = parseList(text).map((nombre) => ({ nombre }));
    if (items.length === 0) return "Debe registrar al menos una fuente de agua";
    for (let i = 0; i < items.length; i++) {
      const r = fuenteAguaItemSchema.safeParse(items[i]);
      if (!r.success) {
        return r.error.issues[0]?.message || "Dato inválido";
      }
    }
    return "";
  };

  const validateRiego = (text: string) => {
    const items = parseList(text).map((tipo) => ({ tipo }));
    if (items.length === 0) return "Debe registrar al menos un método de riego";
    for (let i = 0; i < items.length; i++) {
      const r = metodoRiegoItemSchema.safeParse(items[i]);
      if (!r.success) {
        return r.error.issues[0]?.message || "Dato inválido";
      }
    }
    return "";
  };

  // Sincroniza con el form global y notifica al Step3
  useEffect(() => {
    const items = parseList(fuentesText).map((nombre) => ({ nombre }));
    (form as any).setFieldValue("fuentesAgua", items);
    onChange?.();

    // Validar si showErrors está activo
    if (showErrors || fuentesTouched) {
      const error = validateFuentes(fuentesText);
      setFuentesError(error);
    }
  }, [fuentesText, form, onChange, showErrors, fuentesTouched]);

  useEffect(() => {
    const items = parseList(riegoText).map((tipo) => ({ tipo }));
    (form as any).setFieldValue("metodosRiego", items);
    onChange?.();

    // Validar si showErrors está activo
    if (showErrors || riegoTouched) {
      const error = validateRiego(riegoText);
      setRiegoError(error);
    }
  }, [riegoText, form, onChange, showErrors, riegoTouched]);

  return (
  <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
    <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
      <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
        <Droplets className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-[#708C3E]">Recursos de agua y riego</h3>
    </div>

    <div className="p-6 space-y-8">
      {/* Fuentes */}
      <div>
        <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
          ¿Qué fuentes de agua existen en la finca? *
        </label>

        <Textarea
          value={fuentesText}
          onChange={(e) => {
            setFuentesText(sanitizeTextarea(e.target.value))
            if (fuentesError && fuentesTouched) setFuentesError(validateFuentes(e.target.value))
          }}
          onBlur={(e) => {
            setFuentesTouched(true)
            setFuentesError(validateFuentes(e.target.value))
          }}
          placeholder={
            "Ejemplos: Pozo, Naciente, Quebrada La Esperanza, Río Grande…\n(Puedes separar por coma o una por línea)"
          }
          className={`min-h-[112px] bg-white ${
            (showErrors || fuentesTouched) && fuentesError
              ? "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
              : "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
          }`}
          maxLength={150}
        />

        <FieldError msg={showErrors || fuentesTouched ? fuentesError : ""} />

        <p className="text-xs text-gray-500">
          Separa por comas o ingresa una por línea. Guardamos cada una como un registro.
        </p>
      </div>

      {/* Riego */}
      <div>
        <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
          ¿Qué tipos de riego para forraje o cultivos tiene en su finca? *
        </label>

        <Textarea
          value={riegoText}
          onChange={(e) => {
            setRiegoText(sanitizeTextarea(e.target.value))
            if (riegoError && riegoTouched) setRiegoError(validateRiego(e.target.value))
          }}
          onBlur={(e) => {
            setRiegoTouched(true)
            setRiegoError(validateRiego(e.target.value))
          }}
          placeholder={
            "Ejemplos: Gravedad, Aspersión, Goteo, Riego por manguera…\n(Puedes separar por coma o una por línea)"
          }
          className={`min-h-[112px] bg-white ${
            (showErrors || riegoTouched) && riegoError
              ? "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
              : "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
          }`}
          maxLength={150}
        />

        <FieldError msg={showErrors || riegoTouched ? riegoError : ""} />

        <p className="text-xs text-gray-500">
          Separa por comas o ingresa una por línea. Guardamos cada tipo como un registro.
        </p>
      </div>
    </div>
  </div>
)

}