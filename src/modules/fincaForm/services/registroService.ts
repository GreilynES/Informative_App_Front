import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateRegistrosProductivosDto, RegistrosProductivosData, UpdateRegistrosProductivosDto } from "../models/registrosInfoType";

export const registrosProductivosService = {
    async crear(data: CreateRegistrosProductivosDto): Promise<RegistrosProductivosData> {
      try {
        console.log('🔍 Creando registros productivos');
        console.log('📦 Datos a enviar:', data);
        
        const response = await apiConfig.post<RegistrosProductivosData>('/registros-productivos', data, {
          headers: { 'Content-Type': 'application/json' }
        });
  
        console.log('✅ Registros productivos creados exitosamente:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('💥 Error en crear registros productivos:', error);
        // Extraer mensaje de error más específico si está disponible
        if (error.message?.includes('ya tiene registros')) {
          throw new Error('Esta finca ya tiene registros productivos asociados');
        }
        throw error;
      }
    },
  
    async obtenerTodos(): Promise<RegistrosProductivosData[]> {
      try {
        const response = await apiConfig.get<RegistrosProductivosData[]>('/registros-productivos');
        return response.data;
      } catch (error) {
        console.error('Error en obtenerTodos:', error);
        throw error;
      }
    },
  
    async obtenerPorFinca(idFinca: number): Promise<RegistrosProductivosData> {
      try {
        const response = await apiConfig.get<RegistrosProductivosData>(`/registros-productivos/finca/${idFinca}`);
        return response.data;
      } catch (error) {
        console.error('Error en obtenerPorFinca:', error);
        throw error;
      }
    },
  
    async obtenerUno(id: number): Promise<RegistrosProductivosData> {
      try {
        const response = await apiConfig.get<RegistrosProductivosData>(`/registros-productivos/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error en obtenerUno:', error);
        throw error;
      }
    },
  
    async actualizar(id: number, data: UpdateRegistrosProductivosDto): Promise<RegistrosProductivosData> {
      try {
        const response = await apiConfig.put<RegistrosProductivosData>(`/registros-productivos/${id}`, data);
        return response.data;
      } catch (error) {
        console.error('Error en actualizar:', error);
        throw error;
      }
    },
  
    async eliminar(id: number): Promise<void> {
      try {
        await apiConfig.delete<void>(`/registros-productivos/${id}`);
      } catch (error) {
        console.error('Error en eliminar:', error);
        throw error;
      }
    },
  
    async obtenerEstadisticas(): Promise<any> {
      try {
        const response = await apiConfig.get<any>('/registros-productivos/estadisticas');
        return response.data;
      } catch (error) {
        console.error('Error en obtenerEstadisticas:', error);
        throw error;
      }
    },
  };