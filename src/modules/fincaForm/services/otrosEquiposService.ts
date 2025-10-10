import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateOtroEquipoDto } from "../../associatesForm/models/createAssociate";

const BASE = "/finca-otro-equipo";

interface OpcionesResp { equipos: string[]; }

export async function createOtroEquipo(dto: CreateOtroEquipoDto) {
  const { data } = await apiConfig.post(BASE, dto, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("[createOtroEquipo] dto:", dto);
  console.log("[createOtroEquipo] data:", data);
  return data;
}

export async function listOtrosEquiposByFinca(idFinca: number) {
  const { data } = await apiConfig.get(`${BASE}/finca/${idFinca}`);
  console.log("[listOtrosEquiposByFinca] data:", data);
  return data;
}

export async function getOpcionesOtrosEquipos(): Promise<string[]> {
  const { data } = await apiConfig.get<OpcionesResp>(`${BASE}/opciones`);
  console.log("[getOpcionesOtrosEquipos] data:", data);
  return data?.equipos ?? [];
}

export async function deleteOtroEquipo(id: number) {
  await apiConfig.delete(`${BASE}/${id}`);
}
