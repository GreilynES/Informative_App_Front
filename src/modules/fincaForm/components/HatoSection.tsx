import React, { useEffect } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { hatoGanaderoSchema } from "../../fincaForm/schema/fincaSchema"
import { Button } from "@/components/ui/button"
import { ListChecks, Plus, Trash2 } from "lucide-react"
import { btn } from "@/shared/ui/buttonStyles"
import { CustomSelect } from "@/shared/ui/CustomSelect"
import type { ColumnDef } from "@tanstack/react-table"
import { GenericTable } from "@/shared/ui/GenericTable"
import { Input } from "@/components/ui/input"

interface HatoFormProps {
  form: FormLike
  onNext: () => void
  onPrev: () => void
  forceValidation?: boolean
}

type Row = { id?: string; nombre: string; cantidad: string }
type HatoLocalState = {
  idFinca: number
  tipoExplotacion: string
  totalGanado: number
  razaPredominante: string
  animales: Row[]
}

const TIPOS_ANIMAL = [
  { value: "", label: "Seleccione un tipo" },
  { value: "Vaca", label: "Vaca" },
  { value: "Toro", label: "Toro" },
  { value: "Novillo", label: "Novillo" },
  { value: "Novilla", label: "Novilla" },
  { value: "Buey", label: "Buey" },
  { value: "Torete", label: "Torete" },
  { value: "Otro", label: "Otro" },
]

function HelperText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-gray-500 leading-relaxed">{children}</p>
}

function ErrorText({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="mt-1 text-sm text-[#9c1414]">{msg}</p>
}

export function HatoSection({ form, forceValidation = false }: HatoFormProps) {
  const hatoDataExistente = (form as any).state?.values?.hatoData as HatoLocalState | undefined

  const normalizaAnimales = (animales: any[] | undefined): Row[] =>
    Array.isArray(animales)
      ? animales.map((a) => ({
          id: a?.id,
          nombre: a?.nombre ?? a?.animal ?? "",
          cantidad: a?.cantidad != null ? String(a.cantidad) : "",
        }))
      : []

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
  )

  const [currentAnimal, setCurrentAnimal] = React.useState<Row>({ nombre: "", cantidad: "" })
  const [otroAnimal, setOtroAnimal] = React.useState<string>("")
  const [showOtroInput, setShowOtroInput] = React.useState<boolean>(false)

  const [tipoExplotacionError, setTipoExplotacionError] = React.useState<string>("")
  const [razaError, setRazaError] = React.useState<string>("")
  const [rowErrors, setRowErrors] = React.useState<{ nombre?: string; cantidad?: string }>({})
  const [, setAnimalesError] = React.useState<string>("")

  const inputBase =
    "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
  const inputError =
    "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"

  useEffect(() => {
    if (forceValidation) {
      if (!formValues.tipoExplotacion || formValues.tipoExplotacion.trim().length === 0) {
        setTipoExplotacionError("El tipo de explotación es requerido")
      }
      if (!formValues.animales || formValues.animales.length === 0) {
        setAnimalesError("Debe agregar al menos un animal al hato ganadero")
      }
      if ((!currentAnimal.nombre || (showOtroInput && !otroAnimal)) && formValues.animales.length === 0) {
        setRowErrors((er) => ({ ...er, nombre: er.nombre ?? "Debe ingresar un tipo de animal" }))
      }
      const cantidadNum = Number(currentAnimal.cantidad)
      if ((currentAnimal.cantidad === "" || isNaN(cantidadNum) || cantidadNum < 1) && formValues.animales.length === 0) {
        setRowErrors((er) => ({ ...er, cantidad: er.cantidad ?? "La cantidad debe ser al menos 1" }))
      }
    }
  }, [forceValidation, formValues, currentAnimal, showOtroInput, otroAnimal])

  const schemaInputBase = () => ({
    tipoExplotacion: formValues.tipoExplotacion,
    razaPredominante: formValues.razaPredominante || "",
    totalHato: formValues.totalGanado,
    hatoItems: (formValues.animales ?? []).map((a: Row) => ({
      animal: a.nombre?.trim() || "",
      cantidad: a.cantidad === "" ? (a.cantidad as unknown as number) : Number(a.cantidad),
    })),
  })

  const validateFieldWithSchema = (partial: Partial<ReturnType<typeof schemaInputBase>>) => {
    const parsed = hatoGanaderoSchema.safeParse({ ...schemaInputBase(), ...partial })
    return parsed
  }

  const validateTipoExplotacion = (value: string) => {
    if (!value || value.trim().length === 0) return "El tipo de explotación es requerido"
    const res = validateFieldWithSchema({ tipoExplotacion: value })
    if (res.success) return ""
    const issue = res.error.issues.find((i) => i.path[0] === "tipoExplotacion")
    return issue?.message || ""
  }

  const validateRazaPredominante = (value: string) => {
    const res = validateFieldWithSchema({ razaPredominante: value ?? "" })
    if (res.success) return ""
    const issue = res.error.issues.find((i) => i.path[0] === "razaPredominante")
    return issue?.message || ""
  }

  const validateCurrentRowWithSchema = (row: Row) => {
    const errs: { nombre?: string; cantidad?: string } = {}

    if (!row.nombre || row.nombre.trim().length === 0) {
      errs.nombre = "Debe ingresar un tipo de animal"
      return errs
    }

    if (!row.cantidad || row.cantidad === "") {
      errs.cantidad = "La cantidad es requerida"
      return errs
    }

    const cantidadNum = Number(row.cantidad)
    if (isNaN(cantidadNum) || cantidadNum < 1) {
      errs.cantidad = "La cantidad debe ser al menos 1"
      return errs
    }

    const candidate = {
      ...schemaInputBase(),
      hatoItems: [{ animal: row.nombre.trim(), cantidad: cantidadNum }],
    }

    const parsed = hatoGanaderoSchema.safeParse(candidate)
    if (parsed.success) return {}

    for (const issue of parsed.error.issues) {
      if (issue.path[0] === "hatoItems" && issue.path[1] === 0) {
        const field = issue.path[2]
        if (field === "animal") errs.nombre = issue.message
        if (field === "cantidad") errs.cantidad = issue.message
      }
    }

    return errs
  }

  useEffect(() => {
    const total = (formValues.animales || []).reduce((sum: number, a: Row) => sum + (parseInt(a.cantidad) || 0), 0)
    if (total !== formValues.totalGanado) {
      setFormValues((prev) => ({ ...prev, totalGanado: total }))
    }
  }, [formValues.animales, formValues.totalGanado])

  useEffect(() => {
    ;(form as any).setFieldValue("hatoData", {
      tipoExplotacion: formValues.tipoExplotacion,
      totalGanado: String(formValues.totalGanado),
      razaPredominante: formValues.razaPredominante || "",
      animales: formValues.animales || [],
      idFinca: 0,
    })
  }, [formValues, form])

  const agregarAnimal = () => {
    let nombreFinal = currentAnimal.nombre
    if (currentAnimal.nombre === "Otro") {
      if (!otroAnimal || otroAnimal.trim().length === 0) {
        setRowErrors({ nombre: "Ingrese el tipo de animal" })
        return
      }
      nombreFinal = otroAnimal.trim()
    }

    const animalToValidate = { ...currentAnimal, nombre: nombreFinal }
    const errs = validateCurrentRowWithSchema(animalToValidate)
    setRowErrors(errs)
    if (Object.keys(errs).length > 0) return

    const existe = formValues.animales.some((a) => a.nombre.toLowerCase() === nombreFinal.toLowerCase())
    if (existe) {
      setRowErrors({ nombre: "Este tipo de animal ya fue agregado" })
      return
    }

    const nuevo: Row = { id: Date.now().toString(), nombre: nombreFinal, cantidad: currentAnimal.cantidad }

    setFormValues((prev) => ({ ...prev, animales: [...(prev.animales || []), nuevo] }))
    setCurrentAnimal({ nombre: "", cantidad: "" })
    setOtroAnimal("")
    setShowOtroInput(false)
    setRowErrors({})
    setAnimalesError("")
  }

  const eliminarAnimal = (id?: string) => {
    setFormValues((prev) => ({
      ...prev,
      animales: (prev.animales || []).filter((a) => a.id !== id),
    }))
  }

  const handleAnimalChange = (value: string | number) => {
    const v = String(value)
    setCurrentAnimal({ ...currentAnimal, nombre: v })
    setShowOtroInput(v === "Otro")
    if (v !== "Otro") setOtroAnimal("")
    if (rowErrors.nombre) setRowErrors((er) => ({ ...er, nombre: undefined }))
  }

  const animalSelectOptions = TIPOS_ANIMAL.map((t) => ({ value: t.value, label: t.label }))

  const animalColumns = React.useMemo<ColumnDef<Row, any>[]>(() => {
    return [
      {
        header: "Tipo de Animal",
        accessorKey: "nombre",
        size: 280,
        cell: ({ getValue }) => <span className="text-sm text-[#4A4A4A]">{String(getValue() ?? "")}</span>,
      },
      {
        header: "Cantidad",
        accessorKey: "cantidad",
        size: 160,
        cell: ({ getValue }) => <span className="text-sm text-[#4A4A4A]">{String(getValue() ?? "")}</span>,
      },
      {
        header: "Acción",
        id: "accion",
        size: 220,
        cell: ({ row }) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => eliminarAnimal(row.original.id)}
            className="border-[#E6C3B4] text-[#8C3A33] hover:bg-[#E6C3B4]/40 hover:text-[#8C3A33]"
          >
            <Trash2 className="size-4" />
            Eliminar
          </Button>
        ),
      },
    ]
  }, [])

  const tipoExplotacionShowErr =
    !!tipoExplotacionError || (forceValidation && (!formValues.tipoExplotacion || formValues.tipoExplotacion.trim().length === 0))

  const animalNombreShowErr =
    !!rowErrors.nombre ||
    (forceValidation &&
      formValues.animales.length === 0 &&
      (!currentAnimal.nombre || (showOtroInput && !otroAnimal)))

  const animalCantidadShowErr =
    !!rowErrors.cantidad ||
    (forceValidation && formValues.animales.length === 0 && !(Number(currentAnimal.cantidad) > 0))

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]" data-hato-section>
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
          <ListChecks className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-[#708C3E]">Descripción del hato ganadero</h3>
          <p className="text-xs text-gray-500">
            Todos los campos son obligatorios, a menos que indiquen <span className="font-medium">(Opcional)</span>.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* === Campos principales === */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Tipo de explotación */}
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Tipo de explotación</label>

            <Input
              value={formValues.tipoExplotacion}
              onChange={(e) => {
                setFormValues({ ...formValues, tipoExplotacion: e.target.value })
                if (tipoExplotacionError) setTipoExplotacionError("")
              }}
              onBlur={(e) => setTipoExplotacionError(validateTipoExplotacion(e.target.value))}
              maxLength={75}
              className={`bg-white ${tipoExplotacionShowErr ? inputError : inputBase}`}
            />


            <ErrorText
              msg={
                tipoExplotacionError ||
                (forceValidation && !formValues.tipoExplotacion ? "El tipo de explotación es requerido" : "")
              }
            />
             <HelperText>Ejemplo: intensivo, extensivo o mixto.</HelperText>
          </div>

          {/* Raza predominante (Opcional) */}
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Raza predominante <span className="text-xs text-gray-500 font-normal">(Opcional)</span>
            </label>

            <Input
              value={formValues.razaPredominante || ""}
              onChange={(e) => {
                setFormValues({ ...formValues, razaPredominante: e.target.value })
                if (razaError) setRazaError("")
              }}
              onBlur={(e) => setRazaError(validateRazaPredominante(e.target.value))}
              maxLength={75}
              className={`bg-white ${razaError ? inputError : inputBase}`}
            />
            <ErrorText msg={razaError || ""} />
            <HelperText>Ejemplo: Brahman, Holstein, Criollo.</HelperText>
          </div>
        </div>

        {/* === Agregar animales === */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">Agregar animales al hato</label>

          <div className="rounded-xl border border-[#DCD6C9] bg-[#F3F1EA] px-4 py-3 mb-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
                i
              </span>
              <p className="text-sm text-[#4A4A4A]">
                Ingrese el tipo de animal y la cantidad, luego presione{" "}
                <span className="font-semibold text-[#708C3E]">Agregar</span> para incluirlo en la tabla.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Tipo de animal */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Tipo de animal</label>

              <div className={animalNombreShowErr ? "rounded-xl ring-1 ring-[#9c1414]" : ""}>
                <CustomSelect
                  value={currentAnimal.nombre}
                  onChange={handleAnimalChange}
                  options={animalSelectOptions}
                  placeholder="Seleccione un tipo"
                  zIndex={50}
                />
              </div>

              <ErrorText
                msg={
                  rowErrors.nombre ||
                  (forceValidation &&
                  formValues.animales.length === 0 &&
                  (!currentAnimal.nombre || (showOtroInput && !otroAnimal))
                    ? "Debe ingresar un tipo de animal"
                    : "")
                }
              />
              <HelperText>Seleccione una opción. Si elige “Otro”, especifique el tipo.</HelperText>
              {/* Otro */}
              {showOtroInput && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Especifique el tipo</label>

                  <Input
                    value={otroAnimal}
                    onChange={(e) => {
                      setOtroAnimal(e.target.value)
                      if (rowErrors.nombre) setRowErrors((er) => ({ ...er, nombre: undefined }))
                    }}
                    maxLength={75}
                    className={`bg-white ${(rowErrors.nombre && !otroAnimal) ? inputError : inputBase}`}
                  />

                  <ErrorText
                    msg={
                      rowErrors.nombre ||
                      (forceValidation && formValues.animales.length === 0 && showOtroInput && !otroAnimal
                        ? "Ingrese el tipo de animal"
                        : "")
                    }
                  />
                  <HelperText>Escriba el nombre del animal (ejemplo: ternera, becerro, etc.).</HelperText>
                </div>
              )}
            </div>

            {/* Cantidad */}
            <div className="w-full md:w-[160px]">
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Cantidad</label>

              <Input
                type="text"
                inputMode="numeric"
                value={currentAnimal.cantidad}
                onChange={(e) => {
                  const clean = e.target.value.replace(/\D/g, "")
                  setCurrentAnimal({ ...currentAnimal, cantidad: clean })
                  if (rowErrors.cantidad) setRowErrors((er) => ({ ...er, cantidad: undefined }))
                }}
                className={`bg-white ${animalCantidadShowErr ? inputError : inputBase}`}
              />

              <ErrorText
                msg={
                  rowErrors.cantidad ||
                  (forceValidation && formValues.animales.length === 0 && !(Number(currentAnimal.cantidad) > 0)
                    ? "La cantidad debe ser al menos 1"
                    : "")
                }
                
              />
              <HelperText>Ingrese un número mayor a 0.</HelperText>

            </div>

            {/* Botón agregar */}
            <div className="w-full md:w-[8rem] shrink-0">
              <label className="block text-xs font-medium mb-1 opacity-0 select-none">Acción</label>

              <Button type="button" variant="outline" size="sm" onClick={agregarAnimal} className={btn.outlineGreen}>
                <Plus className="size-4" />
                Agregar
              </Button>

              {/* helper fijo para no “bailar” layout */}
              <HelperText>&nbsp;</HelperText>
            </div>
          </div>
        </div>

        {/* === Tabla animales === */}
        {Array.isArray(formValues.animales) && formValues.animales.length > 0 && (
          <div className="rounded-xl border border-[#DCD6C9] bg-white overflow-hidden">
            <GenericTable<Row> data={formValues.animales} columns={animalColumns} isLoading={false} />
          </div>
        )}

        {/* === Total === */}
        <div className="rounded-xl border border-[#F5E6C5] bg-[#FEF6E0] px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#8B6C2E]">Total del hato</p>
              <p className="text-xs text-[#A3853D]">Se calcula automáticamente sumando las cantidades.</p>
            </div>
            <div className="text-3xl font-bold text-[#A3853D]">{formValues.totalGanado}</div>
          </div>
        </div>
      </div>
    </div>
  )
}