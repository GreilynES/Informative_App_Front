import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateFincaEquipoDto } from "../../associatesForm/models/createAssociate";

const BASE = "/finca-equipo";

export async function addEquipoToFinca(dto: CreateFincaEquipoDto) {
  const { data } = await apiConfig.post(BASE, dto, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("[addEquipoToFinca] data:", data);
  return data;
}

export async function listEquiposByFinca(idFinca: number) {
  const { data } = await apiConfig.get(`${BASE}/finca/${idFinca}`);
  console.log("[listEquiposByFinca] data:", data);
  return data;
}

export async function removeFincaEquipo(idFincaEquipo: number) {
  await apiConfig.delete(`${BASE}/${idFincaEquipo}`);
}

export interface EquipoCatalogo {
    idEquipo: number;
    nombre: string;
    descripcion?: string;
  }
  
  /** Obtiene todos los equipos del catálogo */
  export async function listEquiposCatalogo(): Promise<EquipoCatalogo[]> {
    const { data } = await apiConfig.get<EquipoCatalogo[]>("/equipo");
    return data ?? [];
  }
