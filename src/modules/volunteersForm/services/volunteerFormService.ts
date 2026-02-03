import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateSolicitudVoluntarioDto, SolicitudVoluntarioResponse } from "../models/createVolunteer";

export async function createSolicitudVoluntario(
  payload: CreateSolicitudVoluntarioDto
): Promise<SolicitudVoluntarioResponse> {
  try {
    const response = await apiConfig.post<SolicitudVoluntarioResponse>(
      "/solicitud-voluntariado",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (err: any) {
    console.error("[Service Solicitud] ❌ Error:", {
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message,
    });
    throw err;
  }
}

export async function uploadVolunteerDocuments(
  solicitudId: number,
  files: { cv?: File; cedula?: File; carta?: File }
) {
  console.log("[Service Volunteers] uploadDocuments llamado con:", {
    solicitudId,
    cv: files.cv?.name,
    cedula: files.cedula?.name,
    carta: files.carta?.name,
  });

  const formData = new FormData();
  if (files.cv) formData.append("cv", files.cv);
  if (files.cedula) formData.append("cedula", files.cedula);
  if (files.carta) formData.append("carta", files.carta);

  const entries = Array.from(formData.entries()).map(([k]) => k);
  if (entries.length === 0) throw new Error("No hay archivos para subir");

  try {
    const response = await apiConfig.post(
      `/solicitud-voluntariado/${solicitudId}/upload-documents`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (err: any) {
    console.error("[Service Volunteers] ❌ Error al subir documentos:", {
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message,
    });
    throw err;
  }
}

export async function existsCedula(cedula: string): Promise<boolean> {
  const v = (cedula ?? "").trim();
  if (!v) return false;

  try {
    await apiConfig.get(`/personas/cedula/${encodeURIComponent(v)}`);
    return true;
  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 404) return false;

    console.warn("[existsCedula] ⚠️ Error al verificar cédula:", status, err?.message);
    return false;
  }
}

export async function existsEmail(email: string): Promise<boolean> {
  const v = (email ?? "").trim();
  if (!v) return false;

  try {
    await apiConfig.get(`/personas/email/${encodeURIComponent(v)}`);
    return true;
  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 404) return false;

    console.warn("[existsEmail] ⚠️ Error al verificar email:", status, err?.message);
    return false;
  }
}

export async function lookupPersonaByCedula(cedula: string) {
  const v = (cedula ?? "").trim();
  if (!v) return null;

  try {
    const { data } = await apiConfig.get(`/personas/cedula/${encodeURIComponent(v)}`);
    console.log("[lookupPersonaByCedula] ✅ 200", data);
    return data;
  } catch (err: any) {
    const status = err?.response?.status;
    console.log("[lookupPersonaByCedula] ❌", status, err?.response?.data);
    if (status === 404) return null;
    throw err;
  }
}

export async function validateSolicitudVoluntariado(params: {
  tipoSolicitante: "INDIVIDUAL" | "ORGANIZACION";
  cedula?: string;
  cedulaJuridica?: string;
}) {
  const res = await apiConfig.post("/solicitud-voluntariado/validate", params, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data; // { ok: true }
}

export async function validateRepresentanteCedula(cedula: string) {
  const digits = String(cedula ?? "").replace(/\D/g, "").trim()
  if (!digits) return { ok: true }

  const { data } = await apiConfig.get(`/representantes/validate-cedula/${encodeURIComponent(digits)}`)
  return data as { ok: boolean; code?: string; message?: string; meta?: any }
}