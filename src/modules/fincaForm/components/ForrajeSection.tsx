import React, { useEffect, useMemo } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import type { ForrajeItem } from "../models/forrajeInfoType";
import { forrajeItemSchema } from "../../fincaForm/schema/fincaSchema";

/** Componente de error con alto fijo para no mover el layout */
function FieldError({ msg }: { msg?: string }) {
  return (
    <p className={`mt-1 h-5 text-sm ${msg ? "text-red-600" : "text-transparent"}`}>
      {msg || "placeholder"}
    </p>
  );
}

interface ForrajeSectionProps {
  form: FormLike;
  onChange?: () => void;
  showErrors?: boolean;
}

// Tipo local: garantiza que `utilizacion` sea string
type ForrajeDraft = Omit<ForrajeItem, "id" | "idForraje"> & {
  utilizacion: string;
};

export function ForrajeSection({ form, onChange, showErrors = false }: ForrajeSectionProps) {
  const forrajesExistentes = (form as any).state?.values?.forrajes || [];

  const [forrajes, setForrajes] = React.useState<ForrajeItem[]>(forrajesExistentes);
  const [currentForraje, setCurrentForraje] = React.useState<ForrajeDraft>({
    tipoForraje: "",
    variedad: "",
    hectareas: 0,
    utilizacion: "",
  });

  // Errores por campo
  const [errors, setErrors] = React.useState<{
    tipoForraje?: string;
    variedad?: string;
    hectareas?: string;
    utilizacion?: string;
  }>({});

  // Banner general
  const [error, setError] = React.useState<string | null>(null);
  const [touched, setTouched] = React.useState({
    tipoForraje: false,
    variedad: false,
    hectareas: false,
    utilizacion: false,
  });

  // ====== NUEVO: área finca desde el form ======
  const areaFincaHa = useMemo(() => {
    const raw = (form as any).state?.values?.areaHa;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }, [(form as any).state?.values?.areaHa]);

  const totalHaForrajes = useMemo(() => {
    return forrajes.reduce((acc, f) => acc + (Number(f.hectareas) || 0), 0);
  }, [forrajes]);

  const disponibleHa = useMemo(() => {
    if (areaFincaHa <= 0) return 0;
    return Math.max(0, areaFincaHa - totalHaForrajes);
  }, [areaFincaHa, totalHaForrajes]);

  // ====== NUEVO: validación contra finca (sin clamp, solo avisar) ======
  const validateAgainstFincaArea = (hectareasNuevo: number) => {
    if (areaFincaHa <= 0) {
      return {
        ok: false,
        msg: "Primero ingrese el área (hectáreas) de la finca para poder registrar forrajes.",
      };
    }

    if (hectareasNuevo <= 0) {
      return { ok: false, msg: "Las hectáreas del forraje deben ser mayores a 0." };
    }

    if (hectareasNuevo > areaFincaHa) {
      return {
        ok: false,
        msg: `No se permite agregar ${hectareasNuevo.toFixed(
          2
        )} ha porque la finca tiene ${areaFincaHa.toFixed(2)} ha.`,
      };
    }

    const totalSiAgrega = totalHaForrajes + hectareasNuevo;
    if (totalSiAgrega > areaFincaHa) {
      return {
        ok: false,
        msg: `No se permite agregar ${hectareasNuevo.toFixed(
          2
        )} ha porque la suma total sería ${totalSiAgrega.toFixed(
          2
        )} ha y supera el área de la finca (${areaFincaHa.toFixed(
          2
        )} ha). Disponible: ${disponibleHa.toFixed(2)} ha.`,
      };
    }

    return { ok: true, msg: "" };
  };

  // Sincroniza con el form global
  useEffect(() => {
    (form as any).setFieldValue("forrajes", forrajes);

    // Validar si showErrors está activo
    if (showErrors && forrajes.length === 0) {
      setError("Debe agregar al menos un tipo de forraje");
    } else {
      // No borres un error de área excedida si existe
      // (lo controlamos en el useEffect de abajo)
      if (error === "Debe agregar al menos un tipo de forraje") {
        setError(null);
      }
    }

    onChange?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forrajes, form, onChange, showErrors]);

  // ====== NUEVO: si el usuario baja el área y queda en exceso, avisar ======
  useEffect(() => {
    if (areaFincaHa > 0 && totalHaForrajes > areaFincaHa) {
      setError(
        `La suma de hectáreas de forrajes (${totalHaForrajes.toFixed(
          2
        )} ha) supera el área de la finca (${areaFincaHa.toFixed(
          2
        )} ha). Ajuste los forrajes o el área.`
      );
    } else {
      // Si no hay exceso, solo mantenemos el error "Debe agregar..." si corresponde
      if (showErrors && forrajes.length === 0) {
        setError("Debe agregar al menos un tipo de forraje");
      } else {
        setError(null);
      }
    }
  }, [areaFincaHa, totalHaForrajes, showErrors, forrajes.length]);

  // ---- Helpers ----
  const validateDraft = (draft: ForrajeDraft) => {
    const parsed = forrajeItemSchema.safeParse(draft);
    if (parsed.success) return {};
    const fieldErrs: typeof errors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof errors;
      fieldErrs[key] = issue.message;
    }
    return fieldErrs;
  };

  const onBlurField = (key: keyof ForrajeDraft, value: string | number) => {
    setTouched({ ...touched, [key]: true });
    const next: ForrajeDraft = { ...currentForraje, [key]: value } as ForrajeDraft;
    const fieldErrs = validateDraft(next);
    setErrors((prev) => ({ ...prev, [key]: fieldErrs[key] }));
  };

  // Solo letras (tildes/ñ/ü) y espacios
  const keepLetters = (s: string) => s.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, "");

  const agregarForraje = () => {
    // Marcar todos como touched
    setTouched({
      tipoForraje: true,
      variedad: true,
      hectareas: true,
      utilizacion: true,
    });

    const fieldErrs = validateDraft(currentForraje);
    setErrors(fieldErrs);

    if (Object.keys(fieldErrs).length > 0) {
      setError(
        "Por favor complete todos los campos correctamente (las hectáreas deben ser mayores a 0)."
      );
      return;
    }

    // ====== NUEVO: Validación contra área finca (no agrega si se pasa) ======
    const haNuevo = Number(currentForraje.hectareas) || 0;
    const rule = validateAgainstFincaArea(haNuevo);

    if (!rule.ok) {
      setErrors((prev) => ({ ...prev, hectareas: rule.msg })); // error debajo
      setError(rule.msg); // banner arriba
      return;
    }

    const nuevoForraje: ForrajeItem = {
      id: Date.now(),
      tipoForraje: currentForraje.tipoForraje.trim(),
      variedad: currentForraje.variedad.trim(),
      hectareas: currentForraje.hectareas,
      utilizacion: currentForraje.utilizacion.trim(),
    };

    setForrajes((prev) => [...prev, nuevoForraje]);

    // Reset
    setCurrentForraje({
      tipoForraje: "",
      variedad: "",
      hectareas: 0,
      utilizacion: "",
    });

    setErrors({});
    setError(null);
    setTouched({
      tipoForraje: false,
      variedad: false,
      hectareas: false,
      utilizacion: false,
    });
    onChange?.();
    console.log("[ForrajeSection] Forraje agregado:", nuevoForraje);
  };

  const eliminarForraje = (id: number | undefined) => {
    if (!id) return;
    setForrajes((prev) => prev.filter((f) => f.id !== id));
    onChange?.();
    console.log("[ForrajeSection] Forraje eliminado:", id);
  };

  const shouldShowFieldError = (field: keyof typeof errors) => {
    return (touched[field] || showErrors) && errors[field];
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a1 1 0 01.894.553l2 4A1 1 0 0112 8H8a1 1 0 01-.894-1.447l2-4A1 1 0 0110 2zM4 9a1 1 0 000 2h12a1 1 0 100-2H4zm2 4a1 1 0 000 2h8a1 1 0 100-2H6z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Utilización de forraje y suplementación
        </h3>
      </div>

      <div className="p-6 space-y-1 mb-3">
        <p className="block text-sm font-medium text-[#4A4A4A] mb-3 space-y-6">
          Agrega cada forraje utilizado. Puedes registrar múltiples entradas. *
        </p>

        <div className="mb-2 flex items-center gap-2 p-2 text-semibold bg-[#eef7df] border border-[#efefef] rounded-md">
          <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
            i
          </span>
          <p className="block text-sm font-medium text-[#4A4A4A] mb-1">
            Después de ingresar completar los campos (Tipo, Variedad, Hectáreas y Utilización) y presiona el botón{" "}
            <span className="font-semibold text-[#708C3E]">Agregar</span> para registrarlo en la tabla.
          </p>
        </div>

        {/* Resumen área / total / disponible */}
        <div className="mb-3 flex items-center justify-between rounded-md border border-[#efefef] bg-white px-3 py-2">
          <p className="text-sm text-[#4A4A4A]">
            Área finca: <span className="font-semibold">{areaFincaHa.toFixed(2)}</span> ha
          </p>
          <p className="text-sm text-[#4A4A4A]">
            Total forrajes: <span className="font-semibold">{totalHaForrajes.toFixed(2)}</span> ha ·
            Disponible: <span className="font-semibold">{disponibleHa.toFixed(2)}</span> ha
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Draft */}
        <div className="grid md:grid-cols-5 gap-4 items-start space-y-6">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Tipo *</label>
            <select
              value={currentForraje.tipoForraje}
              onChange={(e) => setCurrentForraje({ ...currentForraje, tipoForraje: e.target.value })}
              onBlur={(e) => onBlurField("tipoForraje", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                shouldShowFieldError("tipoForraje")
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              }`}
            >
              <option value="">Seleccione</option>
              <option value="Pastos mejorados de piso">Pastos mejorados de piso</option>
              <option value="Pasto de corta">Pasto de corta</option>
              <option value="Caña de azúcar">Caña de azúcar</option>
              <option value="Banco de proteína">Banco de proteína</option>
              <option value="Otro">Otro</option>
            </select>
            <FieldError msg={shouldShowFieldError("tipoForraje") ? errors.tipoForraje : undefined} />
          </div>

          {/* Variedad */}
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Variedad *</label>
            <input
              type="text"
              value={currentForraje.variedad}
              onChange={(e) =>
                setCurrentForraje({ ...currentForraje, variedad: keepLetters(e.target.value) })
              }
              onBlur={(e) => onBlurField("variedad", e.target.value)}
              placeholder="Ej: Estrella africana"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                shouldShowFieldError("variedad")
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              }`}
              maxLength={75}
              inputMode="text"
              pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]*"
            />
            <FieldError msg={shouldShowFieldError("variedad") ? errors.variedad : undefined} />
          </div>

          {/* Hectáreas */}
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Hectáreas *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={currentForraje.hectareas || ""}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setCurrentForraje({
                  ...currentForraje,
                  hectareas: Number.isFinite(v) ? v : 0,
                });

                // Limpia el error si estaba puesto y el user está corrigiendo
                if (errors.hectareas) {
                  setErrors((prev) => ({ ...prev, hectareas: undefined }));
                }
                if (error && error.includes("No se permite agregar")) {
                  setError(null);
                }
              }}
              onBlur={(e) => onBlurField("hectareas", parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                shouldShowFieldError("hectareas")
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              }`}
            />
          </div>

          {/* Utilización */}
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Utilización *</label>
            <input
              type="text"
              value={currentForraje.utilizacion}
              onChange={(e) =>
                setCurrentForraje({ ...currentForraje, utilizacion: keepLetters(e.target.value) })
              }
              onBlur={(e) => onBlurField("utilizacion", e.target.value)}
              placeholder="Alimentación directa"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                shouldShowFieldError("utilizacion")
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              }`}
              maxLength={75}
              inputMode="text"
              pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]*"
            />
            <FieldError msg={shouldShowFieldError("utilizacion") ? errors.utilizacion : undefined} />
          </div>

          {/* Botón */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1 invisible">Acción</label>
            <button
              type="button"
              onClick={agregarForraje}
              className="w-full px-4 py-2 bg-white border border-[#CFCFCF] rounded-md text-[#4A4A4A] hover:bg-gray-50 hover:border-[#708C3E] transition-colors"
            >
              Agregar
            </button>
            <div className="h-5" />
          </div>
        </div>

        {/* Tabla */}
        {forrajes.length > 0 && (
          <div className="overflow-x-auto border border-[#CFCFCF] rounded-md">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Variedad</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Hectáreas</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Utilización</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {forrajes.map((f, idx) => (
                  <tr
                    key={f.id || idx}
                    className={idx !== forrajes.length - 1 ? "border-b border-[#CFCFCF]" : ""}
                  >
                    <td className="px-4 py-3 text-sm text-[#4A4A4A]">{f.tipoForraje}</td>
                    <td className="px-4 py-3 text-sm text-[#4A4A4A]">{f.variedad}</td>
                    <td className="px-4 py-3 text-sm text-[#4A4A4A]">
                      {(Number(f.hectareas) || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#4A4A4A]">{f.utilizacion}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => eliminarForraje(f.id)}
                        className="px-3 py-1 border border-[#CFCFCF] rounded text-sm text-[#4A4A4A] hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
