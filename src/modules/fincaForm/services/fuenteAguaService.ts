import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateFuenteAguaDto } from "../models/fuenteAguaType";

const FUENTE_AGUA_BASE = "/fuentes-agua";

/** Crear una fuente de agua */
export async function createFuenteAgua(dto: CreateFuenteAguaDto) {
  const { data } = await apiConfig.post(`${FUENTE_AGUA_BASE}`, dto, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
}

/** Crear varias fuentes de agua */
export async function createFuentesAgua(dtos: CreateFuenteAguaDto[]) {
  return Promise.all(dtos.map((d) => createFuenteAgua(d)));
}

/** Listar todas las fuentes o filtrar por finca */
export async function listFuentesAgua(params?: { idFinca?: number }) {
  const query = params?.idFinca ? `?idFinca=${params.idFinca}` : "";
  const { data } = await apiConfig.get(`${FUENTE_AGUA_BASE}${query}`);
  return data;
}

/** Listar por finca específica */
export async function listFuentesAguaByFinca(idFinca: number) {
  const { data } = await apiConfig.get(`${FUENTE_AGUA_BASE}/by-finca/${idFinca}`);
  return data;
}

/** Actualizar fuente de agua (usa fetch directo para PATCH) */
export async function updateFuenteAgua(id: number, patch: Partial<CreateFuenteAguaDto>) {
  const { data } = await apiConfig.put(`${FUENTE_AGUA_BASE}/${id}`, patch);
  return data;
}

/** Eliminar fuente de agua (usa fetch directo para DELETE) */
export async function deleteFuenteAgua(id: number) {
  const { data } = await apiConfig.delete(`${FUENTE_AGUA_BASE}/${id}`);
  return data;
}
