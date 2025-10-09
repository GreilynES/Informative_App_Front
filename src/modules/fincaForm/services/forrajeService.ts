import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateForrajeDto, ForrajeItem } from "../models/forrajeInfoType";

export const forrajesService = {
    async crearForraje(data: CreateForrajeDto): Promise<ForrajeItem> {
      try {
        console.log('🔍 Creando forraje');
        console.log('📦 Datos a enviar:', data);
        
        const response = await apiConfig.post<ForrajeItem>('/forraje', data, {
          headers: { 'Content-Type': 'application/json' }
        });
  
        console.log('✅ Forraje creado exitosamente:', response.data);
        return response.data;
      } catch (error) {
        console.error('💥 Error en crearForraje:', error);
        throw error;
      }
    },
  
    async obtenerForrajesPorFinca(idFinca: number): Promise<ForrajeItem[]> {
      try {
        const response = await apiConfig.get<ForrajeItem[]>(`/forraje/finca/${idFinca}`);
        return response.data;
      } catch (error) {
        console.error('Error en obtenerForrajesPorFinca:', error);
        throw error;
      }
    },
  
    async obtenerTodos(): Promise<ForrajeItem[]> {
      try {
        const response = await apiConfig.get<ForrajeItem[]>('/forraje');
        return response.data;
      } catch (error) {
        console.error('Error en obtenerTodos:', error);
        throw error;
      }
    },
  
    async obtenerUno(id: number): Promise<ForrajeItem> {
      try {
        const response = await apiConfig.get<ForrajeItem>(`/forraje/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error en obtenerUno:', error);
        throw error;
      }
    },
  };