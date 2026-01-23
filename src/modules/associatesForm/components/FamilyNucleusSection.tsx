import { useMemo } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { Input } from "@/components/ui/input"
import { Users } from "lucide-react"

interface NucleoFamiliarSectionProps {
  form: FormLike
}

export function NucleoFamiliarSection({ form }: NucleoFamiliarSectionProps) {
  const values = (form as any).state?.values || {}

  const hombres = Number(values.nucleoHombres ?? 0) || 0
  const mujeres = Number(values.nucleoMujeres ?? 0) || 0
  const total = hombres + mujeres

  const inputBase =
    "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
  const inputError =
    "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"

  // si querés validar después, por ahora no hay errores:
  const errorHombres = ""
  const errorMujeres = ""

  const resumen = useMemo(() => {
    if (total <= 0) return ""
    const parts: string[] = []
    if (hombres > 0) parts.push(`${hombres} ${hombres === 1 ? "hombre" : "hombres"}`)
    if (mujeres > 0) parts.push(`${mujeres} ${mujeres === 1 ? "mujer" : "mujeres"}`)
    return parts.join(", ")
  }, [hombres, mujeres, total])

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Núcleo Familiar <span className="text-sm font-medium text-gray-400">(Opcional)</span>
        </h3>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-sm text-gray-600">
          Si desea registrar información sobre su núcleo familiar, indique el número de personas.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <form.Field name="nucleoHombres">
            {(field: any) => (
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                  Número de Hombres
                </label>

                <Input
                  name="nucleoHombres"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={field.state.value ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value
                    const clean = raw.replace(/\D/g, "")
                    const num = clean === "" ? "" : String(Math.max(0, Number(clean)))
                    field.handleChange(num === "" ? "" : Number(num))
                  }}
                  onBlur={field.handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "." || e.key === ",") e.preventDefault()
                  }}
                  className={`${errorHombres ? inputError : inputBase} bg-white`}
                />

                {errorHombres && <p className="text-sm text-[#9c1414] mt-1">{errorHombres}</p>}
              </div>
            )}
          </form.Field>

          <form.Field name="nucleoMujeres">
            {(field: any) => (
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                  Número de Mujeres
                </label>

                <Input
                  name="nucleoMujeres"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={field.state.value ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value
                    const clean = raw.replace(/\D/g, "")
                    const num = clean === "" ? "" : String(Math.max(0, Number(clean)))
                    field.handleChange(num === "" ? "" : Number(num))
                  }}
                  onBlur={field.handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "." || e.key === ",") e.preventDefault()
                  }}
                  className={`${errorMujeres ? inputError : inputBase} bg-white`}
                />

                {errorMujeres && <p className="text-sm text-[#9c1414] mt-1">{errorMujeres}</p>}
              </div>
            )}
          </form.Field>
        </div>

        {total > 0 && (
          <div className="mt-2 rounded-xl border border-[#F5E6C5] bg-[#FEF6E0] px-4 py-3">
            <p className="text-sm text-[#8B6C2E]">
              <span className="font-semibold">
                Total personas en el núcleo familiar: {total}
              </span>
              {resumen ? ` (${resumen})` : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
