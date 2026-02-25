import { useEffect, useRef, useState } from "react"

type LookupResult = any

type UseCedulaLookupControllerArgs = {
  // extrae y normaliza la cédula (ej: solo dígitos)
  normalizeKey?: (raw: string) => string

  // mínimo de dígitos para disparar lookup
  minLen?: number

  // debounce ms
  debounceMs?: number

  // PRECHECK opcional (ej: validateSolicitudVoluntariado / validateRepresentanteCedula)
  precheck?: (cedulaDigits: string) => Promise<void>

  // Lookup real
  lookup: (cedulaDigits: string) => Promise<LookupResult>

  // Detecta si vino de DB
  isFromDB: (res: LookupResult) => boolean

  // Acción: reset de campos cuando cambia la cédula
  onReset: () => void

  // Acción: llenar campos con el resultado
  onFill: (res: LookupResult) => void

  // Si querés evitar re-lookup de misma cédula
  avoidRepeat?: boolean
}

export function useCedulaLookupController({
  normalizeKey = (raw) => String(raw ?? "").replace(/\D/g, ""),
  minLen = 9,
  debounceMs = 350,
  precheck,
  lookup,
  isFromDB,
  onReset,
  onFill,
  avoidRepeat = true,
}: UseCedulaLookupControllerArgs) {
  const [loading, setLoading] = useState(false)
  const [fromDB, setFromDB] = useState(false)
  const [error, setError] = useState<string>("")

  const debounceRef = useRef<number | null>(null)
  const lastKeyRef = useRef<string>("") // “cédula actual” ya consultada

  const clearDebounce = () => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = null
  }

  const resetRuntime = () => {
    clearDebounce()
    lastKeyRef.current = ""
    setFromDB(false)
    setError("")
    onReset()
  }

  const runLookup = async (digits: string) => {
    if (!digits || digits.length < minLen) return
    if (avoidRepeat && lastKeyRef.current === digits) return

    setLoading(true)
    try {
      // precheck primero
      if (precheck) await precheck(digits)

      // marcamos como “ya consultada”
      lastKeyRef.current = digits

      // lookup
      const res = await lookup(digits)
      if (!res) {
        setFromDB(false)
        return
      }

      const db = isFromDB(res)
      setFromDB(db)

      // llenar
      onFill(res)
    } catch (err: any) {
      // si precheck/lookup tiran error, lo guardamos en error
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "No se pudo validar la cédula."
      setError(String(msg))
    } finally {
      setLoading(false)
    }
  }

  const onKeyChange = (raw: string) => {
    const digits = normalizeKey(raw)

    // si la cédula cambió respecto a la última consultada (o si quedó “vieja”),
    // reseteamos campos inmediatamente para no “mezclar personas”.
    if (digits !== lastKeyRef.current) {
      resetRuntime()
    }

    if (digits.length < minLen) {
      // aún no consultamos, pero ya reseteamos para evitar datos viejos
      return
    }

    clearDebounce()
    debounceRef.current = window.setTimeout(() => {
      runLookup(digits)
    }, debounceMs)
  }

  const onKeyBlur = async (raw: string) => {
    const digits = normalizeKey(raw)
    if (digits.length < minLen) return
    clearDebounce()
    await runLookup(digits)
  }

  useEffect(() => {
    return () => clearDebounce()
  }, [])

  return {
    loading,
    fromDB,
    error,
    setError, // por si querés setear error desde afuera (ej 409)
    resetRuntime, // por si querés forzar reset manual
    onKeyChange,
    onKeyBlur,
  }
}