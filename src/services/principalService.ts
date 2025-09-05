
import apiConfig from "../apiConfig";
import type {
  PrincipalEdition,
  PrincipalUpdate,
} from "../models/PrincipalType";

/**
 * GET /principal
 * Devuelve el primer registro o null (porque manejas un único principal).
 */
export async function fetchSinglePrincipal(): Promise<PrincipalEdition | null> {
  const { data } = await apiConfig.get<PrincipalEdition[]>("/principal?include=event");
  return Array.isArray(data) && data.length ? data[0] : null;
}

/**
 * POST /principal
 * Crea el único registro permitido. El backend debe rechazar duplicados (409).
 * Usa PrincipalUpdate (title + description) para no cambiar tus tipos.
 */
export async function createPrincipal(input: PrincipalUpdate): Promise<PrincipalEdition> {
  try {
    const { data } = await apiConfig.post<PrincipalEdition>("/principal", input);
    return data;
  } catch (err: any) {
    console.error("POST /principal failed:", err?.response?.status, err?.response?.data);
    throw err;
  }
}

/**
 * PUT /principal/:id
 * Actualiza el registro existente. Puedes enviar { title, description } según tu tipo actual.
 */
export async function updatePrincipal(
  id: number,
  input: PrincipalUpdate
): Promise<PrincipalEdition> {
  try {
    const { data } = await apiConfig.put<PrincipalEdition>(`/principal/${id}`, input);
    return data;
  } catch (err: any) {
    console.error(`PUT /principal/${id} failed:`, err?.message);
    throw err;
  }
}

/**
 * DELETE /principal/:id
 * (Opcional) Si necesitaras borrar el único registro.
 */
export async function deletePrincipal(id: number): Promise<{ ok: true }> {
  try {
    const { data } = await apiConfig.delete<{ ok: true }>(`/principal/${id}`);
    return data;
  } catch (err: any) {
    console.error(`DELETE /principal/${id} failed:`, err?.message);
    throw err;
  }
}
