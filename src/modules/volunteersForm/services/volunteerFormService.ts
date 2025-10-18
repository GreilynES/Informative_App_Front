// src/modules/volunteersForm/services/volunteerFormService.ts

import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateSolicitudVoluntarioDto, SolicitudVoluntarioResponse } from "../models/createVolunteer";

/**
 * Helper: limpia undefined/null y strings vacíos
 */
function sanitizePayload(obj: any): any {
  if (Array.isArray(obj)) {
    return obj
      .map((v) => sanitizePayload(v))
      .filter((v) => v !== undefined && v !== null);
  }

  if (obj && typeof obj === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined || v === null) continue;
      if (typeof v === "string") {
        const trimmed = v.trim();
        if (trimmed === "") continue;
        out[k] = trimmed;
      } else if (typeof v === "object") {
        const nested = sanitizePayload(v);
        if (nested && (Array.isArray(nested) ? nested.length : Object.keys(nested).length)) {
          out[k] = nested;
        }
      } else {
        out[k] = v;
      }
    }
    return out;
  }

  return obj;
}

/**
 * Crea una solicitud de voluntariado
 */
export async function createSolicitudVoluntario(
  payload: CreateSolicitudVoluntarioDto
): Promise<SolicitudVoluntarioResponse> {
  console.log("[Service] Enviando solicitud:", JSON.stringify(payload, null, 2));

  try {
    const cleanData = sanitizePayload(payload);
    const { data } = await apiConfig.post<SolicitudVoluntarioResponse>(
      "/solicitudes-voluntariado",
      cleanData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("[Service] ✅ Respuesta del backend:", data);
    return data;
  } catch (err: any) {
    console.error("[Service] ❌ Error al enviar solicitud:", err?.message || err);
    console.error("[Service] Response data:", err?.response?.data);
    throw err;
  }
}