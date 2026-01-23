import { useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import { fetchCedulaData } from "../../../shared/services/IdApiService";
import { lookupPersonaByCedulaForForms } from "@/modules/associatesForm/services/associatesFormService";

interface UsePropietarioSectionProps {
  form: FormLike;
}

export function usePropietarioSection({ form }: UsePropietarioSectionProps) {
  const [isLoadingCedula, setIsLoadingCedula] = useState(false);
  const [cedulaError, setCedulaError] = useState<string | null>(null);
  const [searchMessage, setSearchMessage] = useState<string>("");
  const [lastSearchedCedula, setLastSearchedCedula] = useState<string>("");

  const clearMsgLater = () => {
    window.setTimeout(() => setSearchMessage(""), 3000);
  };

  const fillFromDBDto = (dto: any) => {
    // Preferimos persona si existe, si no, volunteerIndividual
    const p = dto?.persona;
    const vi = dto?.volunteerIndividual;

    const nombre = p?.nombre ?? vi?.name ?? "";
    const apellido1 = p?.apellido1 ?? vi?.lastName1 ?? "";
    const apellido2 = p?.apellido2 ?? vi?.lastName2 ?? "";

    form.setFieldValue("propietarioNombre", nombre);
    form.setFieldValue("propietarioApellido1", apellido1);
    form.setFieldValue("propietarioApellido2", apellido2);

    if (p?.telefono ?? vi?.phone) form.setFieldValue("propietarioTelefono", String(p?.telefono ?? vi?.phone ?? ""));
    if (p?.email ?? vi?.email) form.setFieldValue("propietarioEmail", String(p?.email ?? vi?.email ?? ""));
    if (p?.fechaNacimiento ?? vi?.birthDate)
      form.setFieldValue("propietarioFechaNacimiento", String(p?.fechaNacimiento ?? vi?.birthDate ?? ""));
    if (p?.direccion ?? vi?.address) form.setFieldValue("propietarioDireccion", String(p?.direccion ?? vi?.address ?? ""));
  };

  const fillFromTSE = (personaTSE: any) => {
    // tu fetchCedulaData trae fullname; aquí mantenemos tu lógica
    const nombreCompleto = personaTSE?.fullname || "";
    const partes = nombreCompleto.trim().split(/\s+/);

    let nombre = "";
    let apellido1 = "";
    let apellido2 = "";

    if (partes.length >= 3) {
      nombre = partes[0];
      apellido1 = partes[1];
      apellido2 = partes.slice(2).join(" ");
    } else if (partes.length === 2) {
      nombre = partes[0];
      apellido1 = partes[1];
    } else if (partes.length === 1) {
      nombre = partes[0];
    }

    form.setFieldValue("propietarioNombre", nombre);
    form.setFieldValue("propietarioApellido1", apellido1);
    form.setFieldValue("propietarioApellido2", apellido2);
  };

  const handleCedulaLookup = async (cedulaRaw: string) => {
    const cedula = String(cedulaRaw ?? "").replace(/\D/g, "");

    if (!cedula || cedula.length < 8) return;

    // Evitar búsquedas duplicadas
    if (cedula === lastSearchedCedula) return;

    setIsLoadingCedula(true);
    setCedulaError(null);
    setSearchMessage("");
    setLastSearchedCedula(cedula);

    try {
      const db = await lookupPersonaByCedulaForForms(cedula);

      if (db?.found) {
        fillFromDBDto(db);
        setSearchMessage("✓ Datos encontrados en el sistema y cargados");
        clearMsgLater();
        return;
      }

      const personaTSE = await fetchCedulaData(cedula);
      if (personaTSE) {
        fillFromTSE(personaTSE);
        setSearchMessage("✓ Datos encontrados en TSE y cargados");
        clearMsgLater();
        return;
      }

      setSearchMessage("No se encontraron datos para esta cédula");
      clearMsgLater();
    } catch (error: any) {
      setCedulaError(error?.message || "Error al buscar cédula");
    } finally {
      setIsLoadingCedula(false);
    }
  };

  useEffect(() => {
    const cedulaValue = String((form as any).state?.values?.propietarioCedula || "").replace(/\D/g, "");
    if (cedulaValue.length === 9 && cedulaValue !== lastSearchedCedula) {
      handleCedulaLookup(cedulaValue);
    }
  }, [(form as any).state?.values?.propietarioCedula]);

  return {
    isLoadingCedula,
    cedulaError,
    searchMessage,
    handleCedulaLookup,
  };
}
