import apiConfig from "../../../apiConfig/apiConfig";
import type {
  CreateFincaDto,
  CreateGeografiaDto,
  CreatePropietarioDto,
  Finca,
  Geografia,
  Propietario,
} from "../models/fincaInfoType";

/**
 * Servicio para manejar todas las operaciones de Finca, Geografía y Propietario
 */
export const fincaService = {
  // ========== GEOGRAFÍA ==========
  
  async createGeografia(data: CreateGeografiaDto): Promise<Geografia> {
    const response = await apiConfig.post<Geografia>("/geografias", data, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  },

  async getGeografias(): Promise<Geografia[]> {
    const response = await apiConfig.get<Geografia[]>("/geografias");
    return response.data;
  },

  async findGeografiaByLocation(
    provincia: string,
    canton: string,
    distrito: string,
    caserio: string
  ): Promise<Geografia | null> {
    try {
      const geografias = await this.getGeografias();
      return geografias.find(
        (geo) =>
          geo.provincia === provincia &&
          geo.canton === canton &&
          geo.distrito === distrito &&
          geo.caserio === caserio
      ) || null;
    } catch (error) {
      console.error("[FincaService] Error al buscar geografía:", error);
      return null;
    }
  },

  async getOrCreateGeografia(data: CreateGeografiaDto): Promise<number> {
    const existing = await this.findGeografiaByLocation(
      data.provincia,
      data.canton,
      data.distrito,
      data.caserio
    );

    if (existing) {
      console.log("[FincaService] Geografía ya existe:", existing.idGeografia);
      return existing.idGeografia;
    }

    console.log("[FincaService] Creando nueva geografía...");
    const newGeografia = await this.createGeografia(data);
    return newGeografia.idGeografia;
  },

  // ========== PROPIETARIO ==========
  
  async createPropietario(data: CreatePropietarioDto): Promise<Propietario> {
    const response = await apiConfig.post<Propietario>("/propietarios", data, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  },

  async findPropietarioByCedula(cedula: string): Promise<Propietario | null> {
    try {
      const response = await apiConfig.get<Propietario>(`/propietarios/cedula/${cedula}`);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async getOrCreatePropietario(data: CreatePropietarioDto): Promise<number> {
    const existing = await this.findPropietarioByCedula(data.persona.cedula);

    if (existing) {
      console.log("[FincaService] Propietario ya existe:", existing.idPropietario);
      return existing.idPropietario;
    }

    console.log("[FincaService] Creando nuevo propietario...");
    const newPropietario = await this.createPropietario(data);
    return newPropietario.idPropietario;
  },

  // ========== FINCA ==========
  
  async createFinca(data: CreateFincaDto): Promise<Finca> {
    const response = await apiConfig.post<Finca>("/fincas", data, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  },

  async getFincasByAsociado(idAsociado: number): Promise<Finca[]> {
    const response = await apiConfig.get<Finca[]>(`/fincas/associate/${idAsociado}`);
    return response.data;
  },

  async getFinca(idFinca: number): Promise<Finca> {
    const response = await apiConfig.get<Finca>(`/fincas/${idFinca}`);
    return response.data;
  },

  async updateFinca(idFinca: number, data: Partial<CreateFincaDto>): Promise<Finca> {
    const response = await apiConfig.put<Finca>(`/fincas/${idFinca}`, data);
    return response.data;
  },

  async deleteFinca(idFinca: number): Promise<void> {
    await apiConfig.delete(`/fincas/${idFinca}`);
  },
};