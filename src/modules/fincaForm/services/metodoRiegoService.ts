import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateMetodoRiegoDto } from "../models/fuenteAguaType";

const METODO_RIEGO_BASE = "/metodos-riego";

/** Crear un método de riego */
export async function createMetodoRiego(dto: CreateMetodoRiegoDto) {
  const { data } = await apiConfig.post(`${METODO_RIEGO_BASE}`, dto, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
}

/** Crear varios métodos */
export async function createMetodosRiego(dtos: CreateMetodoRiegoDto[]) {
  return Promise.all(dtos.map((d) => createMetodoRiego(d)));
}

/** Listar todos o por finca */
export async function listMetodosRiegoByFinca(idFinca: number) {
  const { data } = await apiConfig.get(`${METODO_RIEGO_BASE}/finca/${idFinca}`);
  return data;
}

/** Contar métodos de riego por finca */
export async function countMetodosRiegoByFinca(idFinca: number) {
  const { data } = await apiConfig.get(`${METODO_RIEGO_BASE}/finca/${idFinca}/count`);
  return data;
}

/** Actualizar método de riego (usa fetch directo para PATCH) */
export async function updateMetodoRiego(id: number, patch: Partial<CreateMetodoRiegoDto>) {
  const { data } = await apiConfig.put(`${METODO_RIEGO_BASE}/${id}`, patch);
  return data;
}

/** Eliminar método de riego (usa fetch directo para DELETE) */
export async function deleteMetodoRiego(id: number) {
  const { data } = await apiConfig.delete(`${METODO_RIEGO_BASE}/${id}`);
  return data;
}
