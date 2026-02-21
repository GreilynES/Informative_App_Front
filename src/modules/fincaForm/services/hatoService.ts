import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateHatoDto, Hato, CreateAnimalDto, Animal } from "../models/hatoInfoType";

export async function createHato(payload: CreateHatoDto): Promise<Hato> {
    try {
      const data = await apiConfig.post("/hatos", payload, {
        headers: { "Content-Type": "application/json" },
      });
      return data.data as Hato;
    } catch (err: any) {
      throw err;
    }
  }
  
  export async function createAnimal(payload: CreateAnimalDto): Promise<Animal> {
    try {
      const data = await apiConfig.post("/animales", payload, {
        headers: { "Content-Type": "application/json" },
      });
      return data.data as Animal;
    } catch (err: any) {
      throw err;
    }
  }
  
  export async function getHatoByFinca(idFinca: number): Promise<Hato> {
    try {
      const data = await apiConfig.get(`/hatos/finca/${idFinca}`);
      return data.data as Hato;
    } catch (err: any) {
      throw err;
    }
  }