import { useState, useEffect } from "react";
import { geografiaService, type UbicacionItem } from "../services/geografiaService";
import type { FormLike } from "../../../shared/types/form-lite";

interface UseGeografiaProps {
  form: FormLike;
}

/**
 * Hook para manejar la lógica de geografía (provincias, cantones, distritos)
 * Carga automática de datos desde el API de Costa Rica
 */
export function useGeografia({ form }: UseGeografiaProps) {
  const [provincias, setProvincias] = useState<UbicacionItem[]>([]);
  const [cantones, setCantones] = useState<UbicacionItem[]>([]);
  const [distritos, setDistritos] = useState<UbicacionItem[]>([]);
  
  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [loadingCantones, setLoadingCantones] = useState(false);
  const [loadingDistritos, setLoadingDistritos] = useState(false);
  
  const [selectedProvinciaId, setSelectedProvinciaId] = useState<string>("");
  const [selectedCantonId, setSelectedCantonId] = useState<string>("");

  // Cargar provincias al montar el componente
  useEffect(() => {
    const fetchProvincias = async () => {
      setLoadingProvincias(true);
      try {
        const data = await geografiaService.getProvincias();
        setProvincias(data);
      } catch (error) {
        console.error('Error al cargar provincias:', error);
      } finally {
        setLoadingProvincias(false);
      }
    };
    
    fetchProvincias();
  }, []);

  /**
   * Maneja el cambio de provincia
   */
  const handleProvinciaChange = async (provinciaNombre: string, field: any) => {
    field.handleChange(provinciaNombre);
    
    // Limpiar cantones y distritos
    form.setFieldValue('canton', '');
    form.setFieldValue('distrito', '');
    setCantones([]);
    setDistritos([]);
    
    if (!provinciaNombre) {
      setSelectedProvinciaId("");
      return;
    }

    // Buscar ID de la provincia
    const provinciaId = geografiaService.findProvinciaId(provincias, provinciaNombre);
    if (!provinciaId) return;
    
    setSelectedProvinciaId(provinciaId);
    setLoadingCantones(true);
    
    try {
      const data = await geografiaService.getCantones(provinciaId);
      setCantones(data);
    } catch (error) {
      console.error('Error al cargar cantones:', error);
    } finally {
      setLoadingCantones(false);
    }
  };

  /**
   * Maneja el cambio de cantón
   */
  const handleCantonChange = async (cantonNombre: string, field: any) => {
    field.handleChange(cantonNombre);
    
    // Limpiar distritos
    form.setFieldValue('distrito', '');
    setDistritos([]);
    
    if (!cantonNombre || !selectedProvinciaId) {
      setSelectedCantonId("");
      return;
    }

    // Buscar ID del cantón
    const cantonId = geografiaService.findCantonId(cantones, cantonNombre);
    if (!cantonId) return;
    
    setSelectedCantonId(cantonId);
    setLoadingDistritos(true);
    
    try {
      const data = await geografiaService.getDistritos(selectedProvinciaId, cantonId);
      setDistritos(data);
    } catch (error) {
      console.error('Error al cargar distritos:', error);
    } finally {
      setLoadingDistritos(false);
    }
  };

  return {
    // Datos
    provincias,
    cantones,
    distritos,
    
    // Estados de carga
    loadingProvincias,
    loadingCantones,
    loadingDistritos,
    
    // Handlers
    handleProvinciaChange,
    handleCantonChange,
  };
}