import React, { useEffect, useMemo, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import {
  fuenteAguaItemSchema,
  metodoRiegoItemSchema,
} from "../../fincaForm/schema/fincaSchema";

interface FuenteAguaSectionProps {
  form: FormLike;
}

/** Error con alto fijo para no mover el layout */
function FieldError({ msg }: { msg?: string }) {
  return (
    <p className={`mt-1 h-5 text-sm ${msg ? "text-red-600" : "text-transparent"}`}>
      {msg || "placeholder"}
    </p>
  );
}

export function FuenteAguaSection({ form }: FuenteAguaSectionProps) {
  // Carga inicial (si el usuario vuelve atrás)
  const existentesFuentes = (form as any).state?.values?.fuentesAgua || [];
  const existentesRiego = (form as any).state?.values?.metodosRiego || [];

  // Convertimos a texto (una línea por item)
  const initialFuentesText = useMemo(
    () =>
      existentesFuentes
        .map((f: any) => (typeof f === "string" ? f : f?.nombre))
        .filter(Boolean)
        .join("\n"),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const initialRiegoText = useMemo(
    () =>
      existentesRiego
        .map((r: any) => (typeof r === "string" ? r : r?.tipo))
        .filter(Boolean)
        .join("\n"),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const [fuentesText, setFuentesText] = useState<string>(initialFuentesText);
  const [riegoText, setRiegoText] = useState<string>(initialRiegoText);

  // Errores por textarea
  const [fuentesError, setFuentesError] = useState<string>("");
  const [riegoError, setRiegoError] = useState<string>("");

  // Sanitiza: permite letras (con tildes/ñ/ü), espacios, comas y saltos de línea
  const sanitizeTextarea = (s: string) =>
    s.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s,\n]/g, "");

  // parsea por líneas o comas, quita duplicados y vacíos
  const parseList = (text: string) => {
    return Array.from(
      new Set(
        text
          .split(/[\n,]/g)
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      )
    );
  };

  // Validar textareas con Zod (requeridos + 150 por línea + solo letras/espacios)
  const validateFuentes = (text: string) => {
    const items = parseList(text).map((nombre) => ({ nombre }));
    if (items.length === 0) return "Debe registrar al menos una fuente de agua";
    for (let i = 0; i < items.length; i++) {
      const r = fuenteAguaItemSchema.safeParse(items[i]);
      if (!r.success) {
        const msg = r.error.issues[0]?.message || "Dato inválido";
        // SIN “(línea X)”
        return msg;
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
        const msg = r.error.issues[0]?.message || "Dato inválido";
        // SIN “(línea X)”
        return msg;
      }
    }
    return "";
  };

  // Sincroniza con el form global cada vez que cambie el textarea
  useEffect(() => {
    const items = parseList(fuentesText).map((nombre) => ({ nombre }));
    (form as any).setFieldValue("fuentesAgua", items);
  }, [fuentesText, form]);

  useEffect(() => {
    const items = parseList(riegoText).map((tipo) => ({ tipo }));
    (form as any).setFieldValue("metodosRiego", items);
  }, [riegoText, form]);

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            {/* Gotita/agua */}
            <path d="M10.5 2.5c-.3 0-.6.1-.8.3C8.2 4.3 5 7.9 5 11a5 5 0 1010 0c0-3.1-3.2-6.7-4.7-8.2a1.1 1.1 0 00-.8-.3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Recursos de agua y riego</h3>
      </div>

      {/* Body */}
      <div className="p-6 space-y-8">
        {/* Fuentes de agua */}
        <div>
          <label className="block text-lg font-medium text-[#4A4A4A] mb-3">
            ¿Qué fuentes de agua existen en la finca? *
          </label>
          <textarea
            value={fuentesText}
            onChange={(e) => {
              setFuentesText(sanitizeTextarea(e.target.value));
              if (fuentesError) setFuentesError("");
            }}
            onBlur={(e) => setFuentesError(validateFuentes(e.target.value))}
            placeholder="Ejemplos: Pozo, Naciente, Quebrada La Esperanza, Río Grande…&#10;(Puedes separar por coma o una por línea)"
            className="w-full min-h-[112px] px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
            maxLength={150}
          />
          <FieldError msg={fuentesError} />
          <p className="text-xs text-gray-500">
            Separa por comas o ingresa una por línea. Guardamos cada una como un registro.
          </p>
        </div>

        {/* Métodos de riego */}
        <div>
          <label className="block text-lg font-medium text-[#4A4A4A] mb-3">
            ¿Qué tipos de riego para forraje o cultivos tiene en su finca? *
          </label>
          <textarea
            value={riegoText}
            onChange={(e) => {
              setRiegoText(sanitizeTextarea(e.target.value));
              if (riegoError) setRiegoError("");
            }}
            onBlur={(e) => setRiegoError(validateRiego(e.target.value))}
            placeholder="Ejemplos: Gravedad, Aspersión, Goteo, Riego por manguera…&#10;(Puedes separar por coma o una por línea)"
            className="w-full min-h-[112px] px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
            maxLength={150}
          />
          <FieldError msg={riegoError} />
          <p className="text-xs text-gray-500">
            Separa por comas o ingresa una por línea. Guardamos cada tipo como un registro.
          </p>
        </div>
      </div>
    </div>
  );
}
