// src/hooks/EditionSection/PrincipalHook.tsx
import { useEffect, useState } from "react"
import { socket } from "../lib/socket"
import type { PrincipalEdition, PrincipalUpdate } from "../models/PrincipalType"
import { fetchSinglePrincipal, updatePrincipal, createPrincipal } from "../services/principalService"

type PrincipalRT = {
  action: 'created' | 'updated' | 'deleted';
  data?: PrincipalEdition;
  id?: number | string;
}

export function usePrincipalEdit() {
  const [data, setData] = useState<PrincipalEdition | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const p = await fetchSinglePrincipal()
      setData(p)
    } catch (e: any) {
      setError(e?.message ?? "Error cargando principal")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

    // 👇 Tiempo real: escucha "principal:updated"
  useEffect(() => {
    const handler = (p: PrincipalRT) => {
      // Si viene el objeto, actualízalo directo para UX más rápida,
      // si no, recarga para mantenerte fiel al backend.
      if (p?.data) {
        setData(p.data)
      } else {
        load()
      }
    }
    socket.on('principal:updated', handler)
    return () => { socket.off('principal:updated', handler) }
  }, []) // importante limpiar al desmontar

  const save = async (input: PrincipalUpdate) => {
    if (!data) return
    setSaving(true)
    setError(null)
    try {
      await updatePrincipal(data.id, input)
      // No necesitas load() aquí si confías en el evento realtime.
      // Lo dejo opcional por robustez:
      // await load()
    } catch (e: any) {
      setError(e?.message ?? "No se pudo guardar")
    } finally {
      setSaving(false)
    }
  }

  const create = async (input: PrincipalUpdate) => {
    setSaving(true)
    setError(null)
    try {
      await createPrincipal(input)
      // Igual que arriba: el event "created" actualizará todo.
      // await load()
    } catch (e: any) {
      setError(e?.message ?? "No se pudo crear")
    } finally {
      setSaving(false)
    }
  }

  return { data, loading, saving, error, save, create, reload: load }
}
