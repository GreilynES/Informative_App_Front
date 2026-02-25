import { useState } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { fetchCedulaData } from "../../../shared/services/IdApiService"
import { lookupPersonaByCedulaForForms } from "@/modules/associatesForm/services/associatesFormService"
import { useCedulaLookupController } from "@/shared/hooks/useCedulaLookupController"

interface UsePropietarioSectionProps {
  form: FormLike
}

export function usePropietarioSection({ form }: UsePropietarioSectionProps) {
  const [cedulaError, setCedulaError] = useState<string | null>(null)
  const [searchMessage, setSearchMessage] = useState<string>("")
  const [personaFromDB, setPersonaFromDB] = useState(false)

  const clearMsgLater = () => window.setTimeout(() => setSearchMessage(""), 3000)

  const resetPropietario = () => {
    setCedulaError(null)
    setSearchMessage("")
    setPersonaFromDB(false)

    form.setFieldValue("propietarioNombre", "")
    form.setFieldValue("propietarioApellido1", "")
    form.setFieldValue("propietarioApellido2", "")
    form.setFieldValue("propietarioTelefono", "")
    form.setFieldValue("propietarioEmail", "")
    form.setFieldValue("propietarioFechaNacimiento", "")
    form.setFieldValue("propietarioDireccion", "")
  }

  const fillFromDBDto = (dto: any) => {
    const p = dto?.persona
    const vi = dto?.volunteerIndividual

    const nombre = p?.nombre ?? vi?.name ?? ""
    const apellido1 = p?.apellido1 ?? vi?.lastName1 ?? ""
    const apellido2 = p?.apellido2 ?? vi?.lastName2 ?? ""

    form.setFieldValue("propietarioNombre", nombre)
    form.setFieldValue("propietarioApellido1", apellido1)
    form.setFieldValue("propietarioApellido2", apellido2)

    form.setFieldValue("propietarioTelefono", String(p?.telefono ?? vi?.phone ?? ""))
    form.setFieldValue("propietarioEmail", String(p?.email ?? vi?.email ?? ""))
    form.setFieldValue("propietarioFechaNacimiento", String(p?.fechaNacimiento ?? vi?.birthDate ?? ""))
    form.setFieldValue("propietarioDireccion", String(p?.direccion ?? vi?.address ?? ""))

    setPersonaFromDB(true)
  }

  const fillFromTSE = (personaTSE: any) => {
    const nombreCompleto = personaTSE?.fullname || ""
    const partes = nombreCompleto.trim().split(/\s+/)

    let nombre = ""
    let apellido1 = ""
    let apellido2 = ""

    if (partes.length >= 3) {
      nombre = partes[0]
      apellido1 = partes[1]
      apellido2 = partes.slice(2).join(" ")
    } else if (partes.length === 2) {
      nombre = partes[0]
      apellido1 = partes[1]
    } else if (partes.length === 1) {
      nombre = partes[0]
    }

    form.setFieldValue("propietarioNombre", nombre)
    form.setFieldValue("propietarioApellido1", apellido1)
    form.setFieldValue("propietarioApellido2", apellido2)

    // si viene de TSE, se puede editar resto
    setPersonaFromDB(false)
  }

  const lookupPropietario = async (digits: string) => {
    const db = await lookupPersonaByCedulaForForms(digits)
    if (db?.found) return { source: "DB", ...db }

    const tse = await fetchCedulaData(digits)
    if (tse) return { source: "TSE", ...tse }

    return null
  }

  const cedulaCtrl = useCedulaLookupController({
    minLen: 9,
    debounceMs: 350,
    lookup: lookupPropietario,
    isFromDB: (res: any) => res?.source === "DB",
    onReset: resetPropietario,
    onFill: (res: any) => {
      setCedulaError(null)

      if (!res) {
        setSearchMessage("No se encontraron datos para esta cédula")
        clearMsgLater()
        return
      }

      if (res.source === "DB") {
        fillFromDBDto(res)
        setSearchMessage("✓ Datos encontrados en el sistema y cargados")
        clearMsgLater()
        return
      }

      if (res.source === "TSE") {
        fillFromTSE(res)
        setSearchMessage("✓ Datos encontrados en TSE y cargados")
        clearMsgLater()
        return
      }

      setSearchMessage("No se encontraron datos para esta cédula")
      clearMsgLater()
    },
  })

  const bloquearPorCedula = cedulaCtrl.loading || !!cedulaCtrl.error || !!cedulaError
  const bloquearCamposDB = bloquearPorCedula || personaFromDB

  return {
    isLoadingCedula: cedulaCtrl.loading,
    cedulaError,
    searchMessage,
    personaFromDB,
    bloquearCamposDB,
    onCedulaChange: cedulaCtrl.onKeyChange,
    onCedulaBlur: cedulaCtrl.onKeyBlur,
    resetPropietario, 
  }
}