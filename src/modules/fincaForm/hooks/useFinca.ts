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

export function useFinca(options: UseFincaOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crea una finca completa con geografía y propietario
   */
  const createFincaComplete = async (formData: FincaFormPayload): Promise<number | null> => {
    setLoading(true);
    setError(null);

    try {
      // 1. Crear o buscar geografía
      const geografiaData: CreateGeografiaDto = {
        provincia: formData.provincia,
        canton: formData.canton,
        distrito: formData.distrito,
        caserio: formData.caserio,
      };

      console.log("[useFinca] Creando/buscando geografía...", geografiaData);
      const idGeografia = await fincaService.getOrCreateGeografia(geografiaData);
      console.log("[useFinca] Geografía obtenida:", idGeografia);

      // 2. Crear o buscar propietario (solo si NO es el asociado)
      let idPropietario: number | undefined;

      if (!formData.esPropietario) {
        if (
          !formData.propietarioCedula ||
          !formData.propietarioNombre ||
          !formData.propietarioApellido1 ||
          !formData.propietarioApellido2 ||
          !formData.propietarioTelefono ||
          !formData.propietarioEmail
        ) {
          throw new Error("Faltan datos del propietario");
        }

        const propietarioData: CreatePropietarioDto = {
          persona: {
            cedula: formData.propietarioCedula,
            nombre: formData.propietarioNombre,
            apellido1: formData.propietarioApellido1,
            apellido2: formData.propietarioApellido2,
            fechaNacimiento: formData.propietarioFechaNacimiento,
            telefono: formData.propietarioTelefono,
            email: formData.propietarioEmail,
            direccion: formData.propietarioDireccion,
          },
        };

        console.log("[useFinca] Creando/buscando propietario...", propietarioData);
        idPropietario = await fincaService.getOrCreatePropietario(propietarioData);
        console.log("[useFinca] Propietario obtenido:", idPropietario);
      } else {
        console.log("[useFinca] El asociado es el propietario, no se crea propietario separado");
      }

      // 3. Crear finca
      if (!options.idAsociado) {
        throw new Error("idAsociado es requerido para crear la finca");
      }

      const fincaData: CreateFincaDto = {
        idAsociado: options.idAsociado,
        nombre: formData.nombreFinca,
        areaHa: parseFloat(formData.areaHa),
        numeroPlano: formData.numeroPlano,
        idGeografia,
        idPropietario,
      };

      console.log("[useFinca] Creando finca...", fincaData);
      const finca = await fincaService.createFinca(fincaData);
      console.log("[useFinca] Finca creada exitosamente:", finca);

      options.onSuccess?.(finca.idFinca);
      return finca.idFinca;
    } catch (err: any) {
      console.error("[useFinca] Error al crear finca completa:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Error al crear la finca";
      setError(errorMessage);
      options.onError?.(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene las fincas de un asociado
   */
  const getFincasByAsociado = async (idAsociado: number) => {
    setLoading(true);
    setError(null);

    try {
      const fincas = await fincaService.getFincasByAsociado(idAsociado);
      return fincas;
    } catch (err: any) {
      console.error("[useFinca] Error al obtener fincas:", err);
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
      console.log("[useFinca] Finca actualizada:", updatedFinca);
      return updatedFinca;
    } catch (err: any) {
      console.error("[useFinca] Error al actualizar finca:", err);
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
      console.log("[useFinca] Finca eliminada:", idFinca);
      return true;
    } catch (err: any) {
      console.error("[useFinca] Error al eliminar finca:", err);
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