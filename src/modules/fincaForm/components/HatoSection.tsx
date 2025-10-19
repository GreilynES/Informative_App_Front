import React, { useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import { hatoGanaderoSchema } from "../../fincaForm/schema/fincaSchema";

interface HatoFormProps {
  form: FormLike;
  onNext: () => void;
  onPrev: () => void;
  forceValidation?: boolean;
}

type Row = { id?: string; nombre: string; cantidad: string };
type HatoLocalState = {
  idFinca: number;
  tipoExplotacion: string;
  totalGanado: number;
  razaPredominante: string;
  animales: Row[];
};

function FieldError({ msg }: { msg?: string }) {
  return (
    <p className={`mt-1 h-5 text-sm ${msg ? "text-red-600" : "text-transparent"}`}>
      {msg || "placeholder"}
    </p>
  );
}

// Opciones predefinidas de animales
const TIPOS_ANIMAL = [
  { value: "", label: "Seleccione un tipo" },
  { value: "Vaca", label: "Vaca" },
  { value: "Toro", label: "Toro" },
  { value: "Novillo", label: "Novillo" },
  { value: "Novilla", label: "Novilla" },
  { value: "Buey", label: "Buey" },
  { value: "Torete", label: "Torete" },
  { value: "Otro", label: "Otro" },
];

export function HatoSection({ form, forceValidation = false }: HatoFormProps) {
  const hatoDataExistente = (form as any).state?.values?.hatoData as
    | HatoLocalState
    | undefined;

  const normalizaAnimales = (animales: any[] | undefined): Row[] =>
    Array.isArray(animales)
      ? animales.map((a) => ({
          id: a?.id,
          nombre: a?.nombre ?? a?.animal ?? "",
          cantidad: a?.cantidad != null ? String(a.cantidad) : "",
        }))
      : [];

  const [formValues, setFormValues] = React.useState<HatoLocalState>(
    hatoDataExistente
      ? {
          idFinca: hatoDataExistente.idFinca ?? 0,
          tipoExplotacion: hatoDataExistente.tipoExplotacion ?? "",
          totalGanado: Number(hatoDataExistente.totalGanado ?? 0),
          razaPredominante: hatoDataExistente.razaPredominante ?? "",
          animales: normalizaAnimales(hatoDataExistente.animales),
        }
      : {
          idFinca: 0,
          tipoExplotacion: "",
          totalGanado: 0,
          razaPredominante: "",
          animales: [],
        }
  );

  const [currentAnimal, setCurrentAnimal] = React.useState<Row>({
    nombre: "",
    cantidad: "",
  });

  const [otroAnimal, setOtroAnimal] = React.useState<string>("");
  const [showOtroInput, setShowOtroInput] = React.useState<boolean>(false);
  
  const [tipoExplotacionError, setTipoExplotacionError] = React.useState<string>("");
  const [razaError, setRazaError] = React.useState<string>("");
  const [rowErrors, setRowErrors] = React.useState<{ nombre?: string; cantidad?: string }>({});
  const [animalesError, setAnimalesError] = React.useState<string>("");

  // Validar cuando forceValidation cambia a true
  useEffect(() => {
    if (forceValidation) {
      if (!formValues.tipoExplotacion || formValues.tipoExplotacion.trim().length === 0) {
        setTipoExplotacionError("El tipo de explotación es requerido");
      }

      if (!formValues.animales || formValues.animales.length === 0) {
        setAnimalesError("Debe agregar al menos un animal al hato ganadero");
      }
    }
  }, [forceValidation, formValues]);

  const schemaInputBase = () => ({
    tipoExplotacion: formValues.tipoExplotacion,
    razaPredominante: formValues.razaPredominante || "",
    totalHato: formValues.totalGanado,
    hatoItems: (formValues.animales ?? []).map((a: Row) => ({
      animal: a.nombre?.trim() || "",
      cantidad:
        a.cantidad === "" ? (a.cantidad as unknown as number) : Number(a.cantidad),
    })),
  });

  const validateFieldWithSchema = (
    partial: Partial<ReturnType<typeof schemaInputBase>>
  ) => {
    const parsed = hatoGanaderoSchema.safeParse({ ...schemaInputBase(), ...partial });
    return parsed;
  };

  const validateTipoExplotacion = (value: string) => {
    if (!value || value.trim().length === 0) {
      return "El tipo de explotación es requerido";
    }
    const res = validateFieldWithSchema({ tipoExplotacion: value });
    if (res.success) return "";
    const issue = res.error.issues.find((i) => i.path[0] === "tipoExplotacion");
    return issue?.message || "";
  };

  const validateRazaPredominante = (value: string) => {
    const res = validateFieldWithSchema({ razaPredominante: value ?? "" });
    if (res.success) return "";
    const issue = res.error.issues.find((i) => i.path[0] === "razaPredominante");
    return issue?.message || "";
  };

  const validateCurrentRowWithSchema = (row: Row) => {
    const errs: { nombre?: string; cantidad?: string } = {};
    
    if (!row.nombre || row.nombre.trim().length === 0) {
      errs.nombre = "Debe seleccionar un tipo de animal";
      return errs;
    }

    if (!row.cantidad || row.cantidad === "") {
      errs.cantidad = "La cantidad es requerida";
      return errs;
    }

    const cantidadNum = Number(row.cantidad);
    if (isNaN(cantidadNum) || cantidadNum < 1) {
      errs.cantidad = "La cantidad debe ser al menos 1";
      return errs;
    }

    const candidate = {
      ...schemaInputBase(),
      hatoItems: [
        {
          animal: row.nombre.trim(),
          cantidad: cantidadNum,
        },
      ],
    };

    const parsed = hatoGanaderoSchema.safeParse(candidate);
    if (parsed.success) return {};

    for (const issue of parsed.error.issues) {
      if (issue.path[0] === "hatoItems" && issue.path[1] === 0) {
        const field = issue.path[2];
        if (field === "animal") errs.nombre = issue.message;
        if (field === "cantidad") errs.cantidad = issue.message;
      }
    }
    
    return errs;
  };

  useEffect(() => {
    const total = (formValues.animales || []).reduce(
      (sum: number, a: Row) => sum + (parseInt(a.cantidad) || 0),
      0
    );
    if (total !== formValues.totalGanado) {
      setFormValues((prev) => ({ ...prev, totalGanado: total }));
    }
  }, [formValues.animales]);

  useEffect(() => {
    (form as any).setFieldValue("hatoData", {
      tipoExplotacion: formValues.tipoExplotacion,
      totalGanado: String(formValues.totalGanado),
      razaPredominante: formValues.razaPredominante || "",
      animales: formValues.animales || [],
      idFinca: 0,
    });
  }, [formValues, form]);

  const agregarAnimal = () => {
    // Determinar el nombre final del animal
    let nombreFinal = currentAnimal.nombre;
    if (currentAnimal.nombre === "Otro") {
      if (!otroAnimal || otroAnimal.trim().length === 0) {
        setRowErrors({ nombre: "Ingrese el tipo de animal" });
        return;
      }
      nombreFinal = otroAnimal.trim();
    }

    const animalToValidate = {
      ...currentAnimal,
      nombre: nombreFinal,
    };

    const errs = validateCurrentRowWithSchema(animalToValidate);
    setRowErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Verificar si el animal ya existe
    const existe = formValues.animales.some(
      (a) => a.nombre.toLowerCase() === nombreFinal.toLowerCase()
    );
    if (existe) {
      setRowErrors({ nombre: "Este tipo de animal ya fue agregado" });
      return;
    }

    const nuevo: Row = {
      id: Date.now().toString(),
      nombre: nombreFinal,
      cantidad: currentAnimal.cantidad,
    };

    setFormValues((prev) => ({
      ...prev,
      animales: [...(prev.animales || []), nuevo],
    }));

    setCurrentAnimal({ nombre: "", cantidad: "" });
    setOtroAnimal("");
    setShowOtroInput(false);
    setRowErrors({});
    setAnimalesError("");
  };

  const eliminarAnimal = (id?: string) => {
    setFormValues((prev) => ({
      ...prev,
      animales: (prev.animales || []).filter((a) => a.id !== id),
    }));
  };

  const handleAnimalChange = (value: string) => {
    setCurrentAnimal({ ...currentAnimal, nombre: value });
    setShowOtroInput(value === "Otro");
    if (value !== "Otro") {
      setOtroAnimal("");
    }
    if (rowErrors.nombre) {
      setRowErrors((er) => ({ ...er, nombre: undefined }));
    }
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]" data-hato-section>
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Descripción del hato ganadero
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Tipo de explotación y Raza predominante */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Tipo de explotación <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formValues.tipoExplotacion}
              onChange={(e) => {
                setFormValues({ ...formValues, tipoExplotacion: e.target.value });
                if (tipoExplotacionError) setTipoExplotacionError("");
              }}
              onBlur={(e) =>
                setTipoExplotacionError(validateTipoExplotacion(e.target.value))
              }
              placeholder="Ej: Intensivo, extensivo o mixto"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                (forceValidation || tipoExplotacionError) && tipoExplotacionError
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              }`}
              maxLength={75}
            />
            <FieldError msg={(forceValidation || tipoExplotacionError) ? tipoExplotacionError : ""} />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Raza predominante
            </label>
            <input
              type="text"
              value={formValues.razaPredominante || ""}
              onChange={(e) => {
                setFormValues({ ...formValues, razaPredominante: e.target.value });
                if (razaError) setRazaError("");
              }}
              onBlur={(e) => setRazaError(validateRazaPredominante(e.target.value))}
              placeholder="Ej: Brahman, Holstein, Criollo, etc."
              className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              maxLength={75}
            />
            <FieldError msg={razaError} />
          </div>
        </div>

        {/* Agregar animales */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
            Agregar animales al hato <span className="text-red-500">*</span>
          </label>

          <div className="space-y-2">
            <div className="flex gap-4 items-end">
              {/* Selector de tipo de animal */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">
                  Tipo de animal
                </label>
                <select
                  value={currentAnimal.nombre}
                  onChange={(e) => handleAnimalChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                    rowErrors.nombre
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  }`}
                >
                  {TIPOS_ANIMAL.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo "Otro" condicional */}
              {showOtroInput && (
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">
                    Especifique el tipo
                  </label>
                  <input
                    type="text"
                    value={otroAnimal}
                    onChange={(e) => {
                      setOtroAnimal(e.target.value);
                      if (rowErrors.nombre)
                        setRowErrors((er) => ({ ...er, nombre: undefined }));
                    }}
                    placeholder="Ingrese el tipo de animal"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                      rowErrors.nombre
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    }`}
                    maxLength={75}
                  />
                </div>
              )}

              {/* Cantidad */}
              <div className="w-40">
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  value={currentAnimal.cantidad}
                  onChange={(e) => {
                    setCurrentAnimal({ ...currentAnimal, cantidad: e.target.value });
                    if (rowErrors.cantidad)
                      setRowErrors((er) => ({ ...er, cantidad: undefined }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                    rowErrors.cantidad
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  }`}
                  placeholder="Cantidad"
                  min="1"
                />
              </div>

              {/* Botón Agregar */}
              <button
                type="button"
                onClick={agregarAnimal}
               className=" px-4 py-2 bg-white border border-[#CFCFCF] rounded-md text-[#4A4A4A] hover:bg-gray-50 hover:border-[#708C3E] transition-colors"
              >
                Agregar
              </button>
            </div>

            {/* Errores debajo de los campos */}
            {(rowErrors.nombre || rowErrors.cantidad) && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <FieldError msg={rowErrors.nombre} />
                </div>
                {showOtroInput && <div className="flex-1" />}
                <div className="w-40">
                  <FieldError msg={rowErrors.cantidad} />
                </div>
                <div className="w-[88px]" /> {/* Espacio del botón */}
              </div>
            )}
          </div>
        </div>

        {/* Mensaje de error si no hay animales */}
        {(forceValidation || animalesError) && animalesError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{animalesError}</p>
          </div>
        )}

        {/* Tabla de animales agregados */}
        {Array.isArray(formValues.animales) && formValues.animales.length > 0 && (
          <div className="overflow-x-auto border border-[#CFCFCF] rounded-md">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4A4A4A]">
                    Tipo de Animal
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#4A4A4A]">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#4A4A4A]">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {formValues.animales.map((animal: Row, idx: number) => (
                  <tr
                    key={animal.id || idx}
                    className={
                      idx !== formValues.animales.length - 1
                        ? "border-b border-[#CFCFCF]"
                        : ""
                    }
                  >
                    <td className="px-4 py-3 text-sm text-[#4A4A4A]">
                      {animal.nombre}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#4A4A4A]">
                      {animal.cantidad}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => eliminarAnimal(animal.id)}
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

        {/* Total del hato */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">
                Total del hato
              </label>
              <p className="text-xs text-blue-700">
                Se calcula automáticamente sumando las cantidades
              </p>
            </div>
            <div className="text-3xl font-bold text-blue-900">
              {formValues.totalGanado}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}