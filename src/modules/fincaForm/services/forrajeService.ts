import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateForrajeDto, ForrajeItem } from "../models/forrajeInfoType";

export const forrajesService = {
    async crearForraje(data: CreateForrajeDto): Promise<ForrajeItem> {
      try {

        const response = await apiConfig.post<ForrajeItem>('/forraje', data, {
          headers: { 'Content-Type': 'application/json' }
        });
  
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  
    async obtenerForrajesPorFinca(idFinca: number): Promise<ForrajeItem[]> {
      try {
        const response = await apiConfig.get<ForrajeItem[]>(`/forraje/finca/${idFinca}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  
    async obtenerTodos(): Promise<ForrajeItem[]> {
      try {
        const response = await apiConfig.get<ForrajeItem[]>('/forraje');
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  
    async obtenerUno(id: number): Promise<ForrajeItem> {
      try {
        const response = await apiConfig.get<ForrajeItem>(`/forraje/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  };