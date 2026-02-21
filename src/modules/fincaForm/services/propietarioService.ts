import apiConfig from "../../../apiConfig/apiConfig";
import type { CreatePropietarioDto, Propietario } from "../models/fincaInfoType";



export const propietarioService = {
  /**
   * Crear un nuevo propietario
   */
  async createPropietario(data: CreatePropietarioDto): Promise<Propietario> {
    const response = await apiConfig.post<Propietario>("/propietarios", data, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  },

  /**
   * Buscar propietario por cédula
   */
  async findByCedula(cedula: string): Promise<Propietario | null> {
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

  /**
   * Obtener todos los propietarios
   */
  async getAll(): Promise<Propietario[]> {
    const response = await apiConfig.get<Propietario[]>("/propietarios");
    return response.data;
  },

  /**
   * Obtener propietario por ID
   */
  async getById(id: number): Promise<Propietario> {
    const response = await apiConfig.get<Propietario>(`/propietarios/${id}`);
    return response.data;
  },

  /**
   * Actualizar propietario
   */
  async update(id: number, data: Partial<CreatePropietarioDto>): Promise<Propietario> {
    const response = await apiConfig.put<Propietario>(`/propietarios/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar propietario
   */
  async delete(id: number): Promise<void> {
    await apiConfig.delete(`/propietarios/${id}`);
  },

  /**
   * Buscar o crear propietario
   */
  async getOrCreate(data: CreatePropietarioDto): Promise<number> {
    const existing = await this.findByCedula(data.persona.cedula);

    if (existing) {
      return existing.idPropietario;
    }

    const newPropietario = await this.createPropietario(data);
    return newPropietario.idPropietario;
  },
};
