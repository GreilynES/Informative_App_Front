// src/shared/services/geografiaService.ts

const BASE_URL = 'https://ubicaciones.paginasweb.cr';

export interface UbicacionItem {
  id: string;
  nombre: string;
}

/**
 * Servicio para interactuar con el API de ubicaciones de Costa Rica
 */
export const geografiaService = {
  /**
   * Obtiene todas las provincias de Costa Rica
   */
  async getProvincias(): Promise<UbicacionItem[]> {
    try {
      const response = await fetch(`${BASE_URL}/provincias.json`);
      const data = await response.json();
      
      // Convertir objeto a array: {"1":"San José",...} -> [{id:"1", nombre:"San José"},...]
      return Object.entries(data).map(([id, nombre]) => ({
        id,
        nombre: nombre as string
      }));
    } catch (error) {
      console.error('[GeografiaService] Error al cargar provincias:', error);
      throw new Error('No se pudieron cargar las provincias');
    }
  },

  /**
   * Obtiene los cantones de una provincia específica
   */
  async getCantones(provinciaId: string): Promise<UbicacionItem[]> {
    try {
      const response = await fetch(`${BASE_URL}/provincia/${provinciaId}/cantones.json`);
      const data = await response.json();
      
      return Object.entries(data).map(([id, nombre]) => ({
        id,
        nombre: nombre as string
      }));
    } catch (error) {
      console.error('[GeografiaService] Error al cargar cantones:', error);
      throw new Error('No se pudieron cargar los cantones');
    }
  },

  /**
   * Obtiene los distritos de un cantón específico
   */
  async getDistritos(provinciaId: string, cantonId: string): Promise<UbicacionItem[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/provincia/${provinciaId}/canton/${cantonId}/distritos.json`
      );
      const data = await response.json();
      
      return Object.entries(data).map(([id, nombre]) => ({
        id,
        nombre: nombre as string
      }));
    } catch (error) {
      console.error('[GeografiaService] Error al cargar distritos:', error);
      throw new Error('No se pudieron cargar los distritos');
    }
  },

  /**
   * Busca el ID de una provincia por su nombre
   */
  findProvinciaId(provincias: UbicacionItem[], nombre: string): string | undefined {
    return provincias.find(p => p.nombre === nombre)?.id;
  },

  /**
   * Busca el ID de un cantón por su nombre
   */
  findCantonId(cantones: UbicacionItem[], nombre: string): string | undefined {
    return cantones.find(c => c.nombre === nombre)?.id;
  },
};