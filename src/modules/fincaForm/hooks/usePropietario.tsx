import { useState, useEffect } from "react";
import { fetchCedulaData } from "../../../shared/services/IdApiService";
import type { FormLike } from "../../../shared/types/form-lite";

interface UsePropietarioSectionProps {
  form: FormLike;
}



export function usePropietarioSection({ form }: UsePropietarioSectionProps) {
  const [isLoadingCedula, setIsLoadingCedula] = useState(false);
  const [cedulaError, setCedulaError] = useState<string | null>(null);
  const [searchMessage, setSearchMessage] = useState<string>("");
  const [lastSearchedCedula, setLastSearchedCedula] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);

  /**
   * Validar formato de email
   */
  const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Buscar datos de cédula en API externa y llenar el formulario
   */
  const handleCedulaLookup = async (cedula: string) => {
    if (!cedula || cedula.length < 8) {
      return;
    }

    // Evitar búsquedas duplicadas
    if (cedula === lastSearchedCedula) {
      return;
    }

    setIsLoadingCedula(true);
    setCedulaError(null);
    setSearchMessage("");
    setLastSearchedCedula(cedula);

    try {
      const persona = await fetchCedulaData(cedula);

      if (persona) {
        // Parsear el nombre completo
        const nombreCompleto = persona.fullname || "";
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

        // Llenar los campos del formulario
        form.setFieldValue("propietarioNombre", nombre);
        form.setFieldValue("propietarioApellido1", apellido1);
        form.setFieldValue("propietarioApellido2", apellido2);

        setSearchMessage("✓ Datos encontrados y cargados");
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setSearchMessage(""), 3000);
      } else {
        setSearchMessage("No se encontraron datos para esta cédula");
      }
    } catch (error: any) {
      setCedulaError(error.message || "Error al buscar cédula");
    } finally {
      setIsLoadingCedula(false);
    }
  };

  /**
   * Efecto para buscar automáticamente cuando la cédula alcanza 9 dígitos
   */
  useEffect(() => {
    const cedulaValue = (form as any).state?.values?.propietarioCedula || "";
    
    // Buscar automáticamente cuando tiene 9 dígitos (cédula costarricense estándar)
    if (cedulaValue.length === 9 && cedulaValue !== lastSearchedCedula) {
      handleCedulaLookup(cedulaValue);
    }
  }, [(form as any).state?.values?.propietarioCedula]);

  /**
   * Validar email cuando cambia
   */
  const handleEmailChange = (email: string) => {
    if (email && !validateEmail(email)) {
      setEmailError("Formato de email inválido");
    } else {
      setEmailError(null);
    }
  };
  

  return {
    isLoadingCedula,
    cedulaError,
    searchMessage,
    emailError,
    handleCedulaLookup,
    handleEmailChange,
    validateEmail,
  };
}