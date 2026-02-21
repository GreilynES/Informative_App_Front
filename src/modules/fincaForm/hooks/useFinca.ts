import { useState } from "react";
import { fincaService } from "../services/fincaService";
import type {
  FincaFormPayload,
  CreateFincaDto,
  CreateGeografiaDto,
  CreatePropietarioDto,
} from "../models/fincaInfoType";

interface UseFincaOptions {
  idAsociado?: number;
  onSuccess?: (fincaId: number) => void;
  onError?: (error: any) => void;
}

/**
 * Hook para manejar operaciones de fincas
 */
export function useFinca(options: UseFincaOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Procesa y prepara los datos de geografía
   */
  const processGeografia = async (formData: FincaFormPayload): Promise<number> => {
    const geografiaData: CreateGeografiaDto = {
      provincia: formData.provincia,
      canton: formData.canton,
      distrito: formData.distrito,
      caserio: formData.caserio || "",
    };

    return await fincaService.getOrCreateGeografia(geografiaData);
  };

  /**
   * Procesa y prepara los datos del propietario (si aplica)
   */
  const processPropietario = async (formData: FincaFormPayload): Promise<number | undefined> => {
    if (formData.esPropietario) {
      return undefined;
    }

    // Validar campos requeridos del propietario
    const camposRequeridos = [
      formData.propietarioCedula,
      formData.propietarioNombre,
      formData.propietarioApellido1,
      formData.propietarioApellido2,
      formData.propietarioTelefono,
      formData.propietarioEmail,
    ];

    if (camposRequeridos.some(campo => !campo)) {
      throw new Error("Faltan datos obligatorios del propietario");
    }

    const propietarioData: CreatePropietarioDto = {
      persona: {
        cedula: formData.propietarioCedula!,
        nombre: formData.propietarioNombre!,
        apellido1: formData.propietarioApellido1!,
        apellido2: formData.propietarioApellido2!,
        fechaNacimiento: formData.propietarioFechaNacimiento,
        telefono: formData.propietarioTelefono!,
        email: formData.propietarioEmail!,
        direccion: formData.propietarioDireccion,
      },
    };

    return await fincaService.getOrCreatePropietario(propietarioData);
  };

  /**
   * Crea una finca completa con geografía y propietario
   */
  const createFincaComplete = async (formData: FincaFormPayload): Promise<number | null> => {
    setLoading(true);
    setError(null);

    try {
      if (!options.idAsociado) {
        throw new Error("idAsociado es requerido para crear la finca");
      }

      // 1. Procesar geografía
      const idGeografia = await processGeografia(formData);

      // 2. Procesar propietario (si no es el asociado)
      const idPropietario = await processPropietario(formData);

      // 3. Crear finca
      const fincaData: CreateFincaDto = {
        idAsociado: options.idAsociado,
        nombre: formData.nombreFinca,
        areaHa: parseFloat(formData.areaHa),
        numeroPlano: formData.numeroPlano,
        idGeografia,
        idPropietario,
      };

      const finca = await fincaService.createFinca(fincaData);

      options.onSuccess?.(finca.idFinca);
      return finca.idFinca;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Error al crear la finca";
      setError(errorMessage);
      options.onError?.(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getFincasByAsociado = async (idAsociado: number) => {
    setLoading(true);
    setError(null);

    try {
      const fincas = await fincaService.getFincasByAsociado(idAsociado);
      return fincas;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Error al obtener las fincas";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza una finca
   */
  const updateFinca = async (idFinca: number, data: Partial<CreateFincaDto>) => {
    setLoading(true);
    setError(null);

    try {
      const updatedFinca = await fincaService.updateFinca(idFinca, data);
      return updatedFinca;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Error al actualizar la finca";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina una finca
   */
  const deleteFinca = async (idFinca: number) => {
    setLoading(true);
    setError(null);

    try {
      await fincaService.deleteFinca(idFinca);
      return true;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Error al eliminar la finca";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createFincaComplete,
    getFincasByAsociado,
    updateFinca,
    deleteFinca,
  };
}