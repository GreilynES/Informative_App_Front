import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateHatoDto, Hato, CreateAnimalDto, Animal } from "../models/hatoInfoType";

export async function createHato(payload: CreateHatoDto): Promise<Hato> {
    console.log("[HatoService] Creando hato:", payload);
    try {
      const data = await apiConfig.post("/hatos", payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("[HatoService] ✅ Hato creado:", data);
      return data.data as Hato;
    } catch (err: any) {
      console.error("[HatoService] ❌ Error al crear hato:", err?.response?.data || err);
      throw err;
    }
  }
  
  export async function createAnimal(payload: CreateAnimalDto): Promise<Animal> {
    console.log("[HatoService] Creando animal:", payload);
    try {
      const data = await apiConfig.post("/animales", payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("[HatoService] ✅ Animal creado:", data);
      return data.data as Animal;
    } catch (err: any) {
      console.error("[HatoService] ❌ Error al crear animal:", err?.response?.data || err);
      throw err;
    }
  }
  
  export async function getHatoByFinca(idFinca: number): Promise<Hato> {
    try {
      const data = await apiConfig.get(`/hatos/finca/${idFinca}`);
      return data.data as Hato;
    } catch (err: any) {
      console.error("[HatoService] Error al obtener hato:", err);
      throw err;
    }
  }