// src/modules/finca/services/fincaService.ts

import apiConfig from "../../../apiConfig/apiConfig";
import type {
  CreateFincaDto,
  CreateGeografiaDto,
  CreatePropietarioDto,
  Finca,
  Geografia,
  Propietario,
} from "../models/fincaInfoType";

export const fincaService = {
  // ========== GEOGRAFÍA ==========
  async createGeografia(data: CreateGeografiaDto): Promise<Geografia> {
    try {
      const response = await apiConfig.post<Geografia>("/geografias", data, { headers: { "Content-Type": "application/json" } });
      return response.data;
    } catch (error: any) {
      console.error("[FincaService] Error al crear geografía:", error);
      throw error;
    }
  },

  async findGeografiaByLocation(
    provincia: string,
    canton: string,
    distrito: string,
    caserio: string
  ): Promise<Geografia | null> {
    try {
      // Buscar todas las geografías y filtrar manualmente
      const response = await apiConfig.get<Geografia[]>("/geografias");
      
      const found = response.data.find(
        (geo: Geografia) =>
          geo.provincia === provincia &&
          geo.canton === canton &&
          geo.distrito === distrito &&
          geo.caserio === caserio
      );
      
      return found || null;
    } catch (error) {
      console.error("[FincaService] Error al buscar geografía:", error);
      return null;
    }
  },

  async getOrCreateGeografia(data: CreateGeografiaDto): Promise<number> {
    // Intentar buscar primero
    const existing = await this.findGeografiaByLocation(
      data.provincia,
      data.canton,
      data.distrito,
      data.caserio
    );

    if (existing) {
      return existing.idGeografia;
    }

    // Si no existe, crear
    const newGeografia = await this.createGeografia(data);
    return newGeografia.idGeografia;
  },

  // ========== PROPIETARIO ==========
  async createPropietario(data: CreatePropietarioDto): Promise<Propietario> {
    try {
      const response = await apiConfig.post<Propietario>("/propietarios", data, { headers: { "Content-Type": "application/json" } });
      return response.data;
    } catch (error: any) {
      console.error("[FincaService] Error al crear propietario:", error);
      throw error;
    }
  },

  async findPropietarioByCedula(cedula: string): Promise<Propietario | null> {
    try {
      const response = await apiConfig.get<Propietario>(`/propietarios/cedula/${cedula}`);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      console.error("[FincaService] Error al buscar propietario:", error);
      throw error;
    }
  },

  async getOrCreatePropietario(data: CreatePropietarioDto): Promise<number> {
    // Intentar buscar primero por cédula
    const existing = await this.findPropietarioByCedula(data.persona.cedula);

    if (existing) {
      return existing.idPropietario;
    }

    // Si no existe, crear
    const newPropietario = await this.createPropietario(data);
    return newPropietario.idPropietario;
  },

  // ========== FINCA ==========
  async createFinca(data: CreateFincaDto): Promise<Finca> {
    try {
      const response = await apiConfig.post<Finca>("/fincas", data, { headers: { "Content-Type": "application/json" } });
      return response.data;
    } catch (error: any) {
      console.error("[FincaService] Error al crear finca:", error);
      throw error;
    }
  },

  async getFincasByAsociado(idAsociado: number): Promise<Finca[]> {
    try {
      const response = await apiConfig.get<Finca[]>(`/fincas/associate/${idAsociado}`);
      return response.data;
    } catch (error: any) {
      console.error("[FincaService] Error al obtener fincas:", error);
      throw error;
    }
  },

  async getFinca(idFinca: number): Promise<Finca> {
    try {
      const response = await apiConfig.get<Finca>(`/fincas/${idFinca}`);
      return response.data;
    } catch (error: any) {
      console.error("[FincaService] Error al obtener finca:", error);
      throw error;
    }
  },

  async updateFinca(idFinca: number, data: Partial<CreateFincaDto>): Promise<Finca> {
    try {
      const response = await apiConfig.put<Finca>(`/fincas/${idFinca}`, data);
      return response.data ;
    } catch (error: any) {
      console.error("[FincaService] Error al actualizar finca:", error);
      throw error;
    }
  },

  async deleteFinca(idFinca: number): Promise<void> {
    try {
      await apiConfig.delete(`/fincas/${idFinca}`);
    } catch (error: any) {
      console.error("[FincaService] Error al eliminar finca:", error);
      throw error;
    }
  },
};