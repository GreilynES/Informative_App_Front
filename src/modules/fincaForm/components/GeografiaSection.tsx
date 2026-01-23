import { useEffect, useState } from "react"
import { ZodError } from "zod"
import type { FormLike } from "../../../shared/types/form-lite"
import { geografiaSchema } from "../schema/fincaSchema"
import { useGeografia } from "../hooks/useGeografia"
import type { RefObject } from "react"
import { CustomSelect } from "@/shared/ui/CustomSelect"
import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"

interface GeografiaSectionProps {
  form: FormLike
  forceValidation?: boolean
  caserioRef?: RefObject<HTMLDivElement | null>
}

export function GeografiaSection({ form, forceValidation = false, caserioRef }: GeografiaSectionProps) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

  const inputBase =
    "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
  const inputError =
    "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"

  const {
    provincias,
    cantones,
    distritos,
    loadingProvincias,
    loadingCantones,
    loadingDistritos,
    handleProvinciaChange,
    handleCantonChange,
  } = useGeografia({ form })

  const validateField = (name: string, value: any) => {
    try {
      const fieldSchema = (geografiaSchema.shape as any)[name]
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

    if (!values.provincia || String(values.provincia).trim().length === 0) errors.provincia = "La provincia es requerida"
    if (!values.canton || String(values.canton).trim().length === 0) errors.canton = "El cantón es requerido"
    if (!values.distrito || String(values.distrito).trim().length === 0) errors.distrito = "El distrito es requerido"
    if (!values.caserio || String(values.caserio).trim().length === 0) errors.caserio = "El caserío es requerido"

    setLocalErrors(errors)
  }, [forceValidation, form])

  const provinciaOptions = [
    { value: "", label: "Seleccione una provincia" },
    ...provincias.map((p) => ({ value: p.nombre, label: p.nombre })),
  ]
  const cantonOptions = [
    { value: "", label: "Seleccione un cantón" },
    ...cantones.map((c) => ({ value: c.nombre, label: c.nombre })),
  ]
  const distritoOptions = [
    { value: "", label: "Seleccione un distrito" },
    ...distritos.map((d) => ({ value: d.nombre, label: d.nombre })),
  ]

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Ubicación Geográfica</h3>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <form.Field name="provincia" validators={{ onChange: ({ value }: any) => validateField("provincia", value) }}>
            {(f: any) => {
              const showError = (f.state.meta.errors?.length > 0 || !!localErrors.provincia) as boolean

              return (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Provincia *</label>

                  <div className={showError ? "rounded-xl ring-1 ring-red-500" : ""}>
                    <CustomSelect
                      value={f.state.value ?? ""}
                      onChange={(val) => {
                        const value = String(val)
                        handleProvinciaChange(value, f)
                        f.handleBlur?.()
                        if (localErrors.provincia) {
                          setLocalErrors((prev) => {
                            const { provincia, ...rest } = prev
                            return rest
                          })
                        }
                      }}
                      options={provinciaOptions}
                      placeholder="Seleccione una provincia"
                      disabled={loadingProvincias}
                      zIndex={60}
                    />
                  </div>

                  {showError && (
                    <p className="text-sm text-red-600 mt-1">{localErrors.provincia || f.state.meta.errors[0]}</p>
                  )}
                </div>
              )
            }}
          </form.Field>

          <form.Field name="canton" validators={{ onChange: ({ value }: any) => validateField("canton", value) }}>
            {(f: any) => {
              const provinciaValue = (form as any).state.values.provincia
              const showError = (f.state.meta.errors?.length > 0 || !!localErrors.canton) as boolean

              return (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Cantón *</label>

                  <div className={showError ? "rounded-xl ring-1 ring-red-500" : ""}>
                    <CustomSelect
                      value={f.state.value ?? ""}
                      onChange={(val) => {
                        const value = String(val)
                        handleCantonChange(value, f)
                        f.handleBlur?.()
                        if (localErrors.canton) {
                          setLocalErrors((prev) => {
                            const { canton, ...rest } = prev
                            return rest
                          })
                        }
                      }}
                      options={cantonOptions}
                      placeholder="Seleccione un cantón"
                      disabled={!provinciaValue || loadingCantones}
                      zIndex={55}
                    />
                  </div>

                  {showError && (
                    <p className="text-sm text-red-600 mt-1">{localErrors.canton || f.state.meta.errors[0]}</p>
                  )}
                </div>
              )
            }}
          </form.Field>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <form.Field name="distrito" validators={{ onChange: ({ value }: any) => validateField("distrito", value) }}>
            {(f: any) => {
              const cantonValue = (form as any).state.values.canton
              const showError = (f.state.meta.errors?.length > 0 || !!localErrors.distrito) as boolean

              return (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Distrito *</label>

                  <div className={showError ? "rounded-xl ring-1 ring-red-500" : ""}>
                    <CustomSelect
                      value={f.state.value ?? ""}
                      onChange={(val) => {
                        const value = String(val)
                        f.handleChange(value)
                        f.handleBlur?.()
                        if (localErrors.distrito) {
                          setLocalErrors((prev) => {
                            const { distrito, ...rest } = prev
                            return rest
                          })
                        }
                      }}
                      options={distritoOptions}
                      placeholder="Seleccione un distrito"
                      disabled={!cantonValue || loadingDistritos}
                      zIndex={50}
                    />
                  </div>

                  {showError && (
                    <p className="text-sm text-red-600 mt-1">{localErrors.distrito || f.state.meta.errors[0]}</p>
                  )}
                </div>
              )
            }}
          </form.Field>

          <form.Field name="caserio" validators={{ onChange: ({ value }: any) => validateField("caserio", value) }}>
            {(f: any) => {
              const showError = (f.state.meta.errors?.length > 0 || !!localErrors.caserio) as boolean

              return (
                <div ref={caserioRef} className="scroll-mt-28">
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                    Caserío (dirección exacta) *
                  </label>

                  <Input
                    value={f.state.value ?? ""}
                    onChange={(e) => {
                      f.handleChange(e.target.value)
                      if (localErrors.caserio) {
                        setLocalErrors((prev) => {
                          const { caserio, ...rest } = prev
                          return rest
                        })
                      }
                    }}
                    onBlur={f.handleBlur}
                    placeholder="Nombre del caserío"
                    maxLength={100}
                    className={`${showError ? inputError : inputBase} bg-white`}
                  />

                  {showError && (
                    <p className="text-sm text-red-600 mt-1">{localErrors.caserio || f.state.meta.errors[0]}</p>
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
