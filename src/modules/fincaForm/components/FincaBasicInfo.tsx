import { useEffect, useState } from "react"
import { ZodError } from "zod"
import type { FormLike } from "../../../shared/types/form-lite"
import { fincaBasicSchema } from "../schema/fincaSchema"
import { Input } from "@/components/ui/input"
import { Home } from "lucide-react"

interface FincaBasicInfoProps {
  form: FormLike
  forceValidation?: boolean
}

export function FincaBasicInfo({ form, forceValidation = false }: FincaBasicInfoProps) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

  const inputBase =
    "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
  const inputError =
    "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"

  const validateField = (name: string, value: any) => {
    try {
      const fieldSchema = (fincaBasicSchema.shape as any)[name]
      if (fieldSchema) fieldSchema.parse(value)
      return undefined
    } catch (error) {
      if (error instanceof ZodError) return error.issues[0]?.message || "Error de validación"
      return "Error de validación"
    }
  }

  useEffect(() => {
    if (!forceValidation) return

    const values = (form as any).state?.values || {}
    const errors: Record<string, string> = {}

    if (!values.nombreFinca || String(values.nombreFinca).trim().length === 0) {
      errors.nombreFinca = "El nombre de la finca es requerido"
    }

    if (!values.areaHa || String(values.areaHa).trim() === "" || Number(values.areaHa) <= 0) {
      errors.areaHa = "El área es requerida"
    }

    if (!values.numeroPlano || String(values.numeroPlano).trim().length === 0) {
      errors.numeroPlano = "El número de plano es requerido"
    }

    setLocalErrors(errors)
  }, [forceValidation, form])

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
          <Home className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Información de la Finca</h3>
      </div>

      <div className="p-6 space-y-4">
        <form.Field
          name="nombreFinca"
          validators={{ onChange: ({ value }: any) => validateField("nombreFinca", value) }}
        >
          {(f: any) => {
            const showError = (f.state.meta.errors?.length > 0 || localErrors.nombreFinca) as boolean
            return (
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                  Nombre de la Finca *
                </label>

                <Input
                  value={f.state.value ?? ""}
                  onChange={(e) => {
                    f.handleChange(e.target.value)
                    if (localErrors.nombreFinca) {
                      setLocalErrors((prev) => {
                        const { nombreFinca, ...rest } = prev
                        return rest
                      })
                    }
                  }}
                  onBlur={f.handleBlur}
                  placeholder="Ej: Finca La Esperanza"
                  maxLength={100}
                  className={`${showError ? inputError : inputBase} bg-white`}
                />

                {showError && (
                  <p className="text-sm text-[#9c1414] mt-1">
                    {localErrors.nombreFinca || f.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )
          }}
        </form.Field>

        <div className="grid md:grid-cols-2 gap-4">
          <form.Field
            name="areaHa"
            validators={{ onChange: ({ value }: any) => validateField("areaHa", value) }}
          >
            {(f: any) => {
              const showError = (f.state.meta.errors?.length > 0 || localErrors.areaHa) as boolean
              return (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                    Área (Hectáreas) *
                  </label>

                  <Input
                    type="text"
                    inputMode="numeric"
                    value={f.state.value ?? ""}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "")
                      if (v !== "" && (v.startsWith("0") || Number(v) === 0)) v = ""
                      f.handleChange(v)
                      if (localErrors.areaHa) {
                        setLocalErrors((prev) => {
                          const { areaHa, ...rest } = prev
                          return rest
                        })
                      }
                    }}
                    onBlur={f.handleBlur}
                    placeholder="Ej: 25"
                    className={`${showError ? inputError : inputBase} bg-white`}
                  />

                  {showError && (
                    <p className="text-sm text-[#9c1414] mt-1">
                      {localErrors.areaHa || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )
            }}
          </form.Field>

          <form.Field
            name="numeroPlano"
            validators={{ onChange: ({ value }: any) => validateField("numeroPlano", value) }}
          >
            {(f: any) => {
              const showError = (f.state.meta.errors?.length > 0 || localErrors.numeroPlano) as boolean
              return (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                    Número de Plano *
                  </label>

                  <Input
                    value={f.state.value ?? ""}
                    onChange={(e) => {
                      f.handleChange(e.target.value)
                      if (localErrors.numeroPlano) {
                        setLocalErrors((prev) => {
                          const { numeroPlano, ...rest } = prev
                          return rest
                        })
                      }
                    }}
                    onBlur={f.handleBlur}
                    placeholder="Ej: P-2025-001"
                    maxLength={50}
                    className={`${showError ? inputError : inputBase} bg-white`}
                  />

                  {showError && (
                    <p className="text-sm text-[#9c1414] mt-1">
                      {localErrors.numeroPlano || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )
            }}
          </form.Field>
        </div>
      </div>
    </div>
  )
}
