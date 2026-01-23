import React, { useEffect, useMemo } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import type { ForrajeItem } from "../models/forrajeInfoType"
import { forrajeItemSchema } from "../../fincaForm/schema/fincaSchema"
import { Button } from "@/components/ui/button"
import { Leaf, Plus, Trash2 } from "lucide-react"
import { btn } from "@/shared/ui/buttonStyles"
import { CustomSelect } from "@/shared/ui/CustomSelect"
import type { ColumnDef } from "@tanstack/react-table"
import { GenericTable } from "@/shared/ui/GenericTable"
import { Input } from "@/components/ui/input"

function FieldError({ msg }: { msg?: string }) {
  return (
    <p className={`mt-1 h-5 text-sm ${msg ? "text-[#9c1414]" : "text-transparent"}`}>
      {msg || "placeholder"}
    </p>
  )
}

interface ForrajeSectionProps {
  form: FormLike
  onChange?: () => void
  showErrors?: boolean
}

type ForrajeDraft = Omit<ForrajeItem, "id" | "idForraje"> & { utilizacion: string }

export function ForrajeSection({ form, onChange, showErrors = false }: ForrajeSectionProps) {
  const forrajesExistentes = (form as any).state?.values?.forrajes || []

  const [forrajes, setForrajes] = React.useState<ForrajeItem[]>(forrajesExistentes)
  const [currentForraje, setCurrentForraje] = React.useState<ForrajeDraft>({
    tipoForraje: "",
    variedad: "",
    hectareas: 0,
    utilizacion: "",
  })

  const [errors, setErrors] = React.useState<{
    tipoForraje?: string
    variedad?: string
    hectareas?: string
    utilizacion?: string
  }>({})

  const [error, setError] = React.useState<string | null>(null)
  const [touched, setTouched] = React.useState({
    tipoForraje: false,
    variedad: false,
    hectareas: false,
    utilizacion: false,
  })

  const areaFincaHa = useMemo(() => {
    const raw = (form as any).state?.values?.areaHa
    const n = Number(raw)
    return Number.isFinite(n) ? n : 0
  }, [(form as any).state?.values?.areaHa])

  const totalHaForrajes = useMemo(() => {
    return forrajes.reduce((acc, f) => acc + (Number(f.hectareas) || 0), 0)
  }, [forrajes])

  const disponibleHa = useMemo(() => {
    if (areaFincaHa <= 0) return 0
    return Math.max(0, areaFincaHa - totalHaForrajes)
  }, [areaFincaHa, totalHaForrajes])

  const validateAgainstFincaArea = (hectareasNuevo: number) => {
    if (areaFincaHa <= 0) {
      return {
        ok: false,
        msg: "Primero ingrese el área (hectáreas) de la finca para poder registrar forrajes.",
      }
    }

    if (hectareasNuevo <= 0) return { ok: false, msg: "Las hectáreas del forraje deben ser mayores a 0." }

    if (hectareasNuevo > areaFincaHa) {
      return {
        ok: false,
        msg: `No se permite agregar ${hectareasNuevo.toFixed(2)} ha porque la finca tiene ${areaFincaHa.toFixed(2)} ha.`,
      }
    }

    const totalSiAgrega = totalHaForrajes + hectareasNuevo
    if (totalSiAgrega > areaFincaHa) {
      return {
        ok: false,
        msg: `No se permite agregar ${hectareasNuevo.toFixed(2)} ha porque la suma total sería ${totalSiAgrega.toFixed(
          2
        )} ha y supera el área de la finca (${areaFincaHa.toFixed(2)} ha). Disponible: ${disponibleHa.toFixed(2)} ha.`,
      }
    }

    return { ok: true, msg: "" }
  }

  useEffect(() => {
    ;(form as any).setFieldValue("forrajes", forrajes)

    if (showErrors && forrajes.length === 0) setError("Debe agregar al menos un tipo de forraje")
    else {
      if (error === "Debe agregar al menos un tipo de forraje") setError(null)
    }

    onChange?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forrajes, form, onChange, showErrors])

  useEffect(() => {
    if (areaFincaHa > 0 && totalHaForrajes > areaFincaHa) {
      setError(
        `La suma de hectáreas de forrajes (${totalHaForrajes.toFixed(2)} ha) supera el área de la finca (${areaFincaHa.toFixed(
          2
        )} ha). Ajuste los forrajes o el área.`
      )
    } else {
      if (showErrors && forrajes.length === 0) setError("Debe agregar al menos un tipo de forraje")
      else setError(null)
    }
  }, [areaFincaHa, totalHaForrajes, showErrors, forrajes.length])

  const validateDraft = (draft: ForrajeDraft) => {
    const parsed = forrajeItemSchema.safeParse(draft)
    if (parsed.success) return {}
    const fieldErrs: typeof errors = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof errors
      fieldErrs[key] = issue.message
    }
    return fieldErrs
  }

  const onBlurField = (key: keyof ForrajeDraft, value: string | number) => {
    setTouched({ ...touched, [key]: true })
    const next: ForrajeDraft = { ...currentForraje, [key]: value } as ForrajeDraft
    const fieldErrs = validateDraft(next)
    setErrors((prev) => ({ ...prev, [key]: fieldErrs[key] }))
  }

  const keepLetters = (s: string) => s.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, "")

  const agregarForraje = () => {
    setTouched({ tipoForraje: true, variedad: true, hectareas: true, utilizacion: true })

    const fieldErrs = validateDraft(currentForraje)
    setErrors(fieldErrs)

    if (Object.keys(fieldErrs).length > 0) {
      setError("Por favor complete todos los campos correctamente (las hectáreas deben ser mayores a 0).")
      return
    }

    const haNuevo = Number(currentForraje.hectareas) || 0
    const rule = validateAgainstFincaArea(haNuevo)

    if (!rule.ok) {
      setErrors((prev) => ({ ...prev, hectareas: rule.msg }))
      setError(rule.msg)
      return
    }

    const nuevoForraje: ForrajeItem = {
      id: Date.now(),
      tipoForraje: currentForraje.tipoForraje.trim(),
      variedad: currentForraje.variedad.trim(),
      hectareas: currentForraje.hectareas,
      utilizacion: currentForraje.utilizacion.trim(),
    }

    setForrajes((prev) => [...prev, nuevoForraje])

    setCurrentForraje({ tipoForraje: "", variedad: "", hectareas: 0, utilizacion: "" })
    setErrors({})
    setError(null)
    setTouched({ tipoForraje: false, variedad: false, hectareas: false, utilizacion: false })
    onChange?.()
  }

  const eliminarForraje = (id: number | undefined) => {
    if (!id) return
    setForrajes((prev) => prev.filter((f) => f.id !== id))
    onChange?.()
  }

  const shouldShowFieldError = (field: keyof typeof errors) => {
    return (touched[field] || showErrors) && errors[field]
  }

  const tipoForrajeOptions = [
    { value: "", label: "Seleccione" },
    { value: "Pastos mejorados de piso", label: "Pastos mejorados de piso" },
    { value: "Pasto de corta", label: "Pasto de corta" },
    { value: "Caña de azúcar", label: "Caña de azúcar" },
    { value: "Banco de proteína", label: "Banco de proteína" },
    { value: "Otro", label: "Otro" },
  ]

  const forrajeColumns = React.useMemo<ColumnDef<ForrajeItem, any>[]>(() => {
  return [
    {
      header: "Tipo",
      accessorKey: "tipoForraje",
      cell: ({ getValue }) => (
        <span className="text-sm text-[#4A4A4A] whitespace-normal break-words block">
          {String(getValue() ?? "")}
        </span>
      ),
    },
    {
      header: "Variedad",
      accessorKey: "variedad",
      cell: ({ getValue }) => (
        <span className="text-sm text-[#4A4A4A] whitespace-normal break-words block">
          {String(getValue() ?? "")}
        </span>
      ),
    },
    {
      header: "Hectáreas",
      accessorKey: "hectareas",
      cell: ({ getValue }) => (
        <span className="text-sm text-[#4A4A4A] whitespace-nowrap block">
          {(Number(getValue() ?? 0) || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Utilización",
      accessorKey: "utilizacion",
      cell: ({ getValue }) => (
        <span className="text-sm text-[#4A4A4A] whitespace-normal break-words block">
          {String(getValue() ?? "")}
        </span>
      ),
    },
    {
      header: "Acción",
      id: "accion",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => eliminarForraje(row.original.id)}
          className={`${btn.outlineRed} border`}
        >
          <Trash2 className="size-4" />
          Eliminar
        </Button>
        </div>
      ),
    },
  ]
}, [eliminarForraje])

  return (
  <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
    <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
      <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
        <Leaf className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-[#708C3E]">Utilización de forraje y suplementación</h3>
    </div>

    <div className="p-6 space-y-5">
      <p className="text-sm font-medium text-[#4A4A4A]">
        Agrega cada forraje utilizado. Puedes registrar múltiples entradas. *
      </p>

      {/* Callout */}
      <div className="rounded-xl border border-[#DCD6C9] bg-[#F3F1EA] px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
            i
          </span>
          <p className="text-sm text-[#4A4A4A]">
            Completa Tipo, Variedad, Hectáreas y Utilización y presiona{" "}
            <span className="font-semibold text-[#708C3E]">Agregar</span>.
          </p>
        </div>
      </div>

      {/* Resumen área */}
      <div className="rounded-xl border border-[#DCD6C9] bg-white px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <p className="text-sm text-[#4A4A4A]">
          Área finca: <span className="font-semibold">{areaFincaHa.toFixed(2)}</span> ha
        </p>
        <p className="text-sm text-[#4A4A4A]">
          Total forrajes: <span className="font-semibold">{totalHaForrajes.toFixed(2)}</span> ha · Disponible:{" "}
          <span className="font-semibold">{disponibleHa.toFixed(2)}</span> ha
        </p>
      </div>

      {/* Error general */}
      {error && (
        <div className="rounded-xl border border-[#f3c7c7] bg-[#f3c7c7]/30 px-4 py-3">
          <p className="text-sm text-[#9c1414]">{error}</p>
        </div>
      )}

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
        {/* Tipo */}
        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Tipo *</label>

          <div className={shouldShowFieldError("tipoForraje") ? "rounded-xl ring-1 ring-[#9c1414]" : ""}>
            <CustomSelect
            value={currentForraje.tipoForraje}
            onChange={(v) => {
              setCurrentForraje({ ...currentForraje, tipoForraje: String(v) })
              if (errors.tipoForraje) setErrors((p) => ({ ...p, tipoForraje: undefined }))
            }}
            options={tipoForrajeOptions}
            placeholder="Seleccione"
            zIndex={50}
            buttonClassName={`h-9 px-3 pr-10 py-0 border-[#DCD6C9] ${
              shouldShowFieldError("tipoForraje")
                ? "border-[#9c1414] focus:ring-[#9c1414]/30 focus:border-[#9c1414]"
                : "focus:ring-[#708C3E]/30 focus:border-[#708C3E]"
            }`}
          />
          </div>

          <FieldError msg={shouldShowFieldError("tipoForraje") ? errors.tipoForraje : undefined} />
        </div>

        {/* Variedad */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Variedad *</label>
          <Input
            value={currentForraje.variedad}
            onChange={(e) => {
              const v = keepLetters(e.target.value)
              setCurrentForraje({ ...currentForraje, variedad: v })
              if (errors.variedad) setErrors((p) => ({ ...p, variedad: undefined }))
            }}
            onBlur={(e) => onBlurField("variedad", e.target.value)}
            placeholder="Ej: Estrella africana"
            maxLength={75}
            className={`bg-white ${
              shouldShowFieldError("variedad")
                ? "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
                : "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
            }`}
          />
          <FieldError msg={shouldShowFieldError("variedad") ? errors.variedad : undefined} />
        </div>

        {/* Hectáreas */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Hectáreas *</label>
          <Input
            type="text"
            inputMode="decimal"
            value={currentForraje.hectareas ? String(currentForraje.hectareas) : ""}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d.]/g, "")
              const parts = raw.split(".")
              const clean = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : raw
              const n = parseFloat(clean)
              setCurrentForraje({ ...currentForraje, hectareas: Number.isFinite(n) ? n : 0 })

              if (errors.hectareas) setErrors((p) => ({ ...p, hectareas: undefined }))
              if (error && error.includes("No se permite agregar")) setError(null)
            }}
            onBlur={(e) => onBlurField("hectareas", parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={`bg-white ${
              shouldShowFieldError("hectareas")
                ? "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
                : "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
            }`}
          />
          <FieldError msg={shouldShowFieldError("hectareas") ? errors.hectareas : undefined} />
        </div>

        {/* Utilización */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Utilización *</label>
          <Input
            value={currentForraje.utilizacion}
            onChange={(e) => {
              const v = keepLetters(e.target.value)
              setCurrentForraje({ ...currentForraje, utilizacion: v })
              if (errors.utilizacion) setErrors((p) => ({ ...p, utilizacion: undefined }))
            }}
            onBlur={(e) => onBlurField("utilizacion", e.target.value)}
            placeholder="Alimentación directa"
            maxLength={75}
            className={`bg-white ${
              shouldShowFieldError("utilizacion")
                ? "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
                : "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
            }`}
          />
          <FieldError msg={shouldShowFieldError("utilizacion") ? errors.utilizacion : undefined} />
        </div>

        {/* Botón */}
      <div className="md:col-span-2 flex flex-col justify-end">
        {/* label fantasma con MISMO tamaño que los demás */}
        <label className="block text-sm font-medium mb-1 opacity-0 select-none">
          Acción
        </label>

        <Button
          type="button"
          variant="outline"
          onClick={agregarForraje}
          className={`${btn.outlineGreen} h-8 px-4 text-sm`}
        >
          <Plus className="size-4" />
          Agregar
        </Button>
        <div className="h-5" />
      </div>

      </div>

      {/* Tabla */}
      {forrajes.length > 0 && (
        <div className="rounded-xl border border-[#DCD6C9] bg-white">
        <GenericTable<ForrajeItem> data={forrajes} columns={forrajeColumns} isLoading={false} />
      </div>
      )}
    </div>
  </div>
)

}
