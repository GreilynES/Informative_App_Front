// src/modules/volunteersForm/services/volunteerFormService.ts

import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateSolicitudVoluntarioDto, SolicitudVoluntarioResponse } from "../models/createVolunteer";

// ... código de sanitizePayload ...

export async function createSolicitudVoluntario(
  payload: CreateSolicitudVoluntarioDto
): Promise<SolicitudVoluntarioResponse> {
  console.log("[Service Org] Enviando payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await apiConfig.post("/solicitudes-voluntariado", payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("[Service Org] ✅ Respuesta del backend:", response);
    console.log("[Service Org] ✅ response.data:", response.data);
    
    // ✅ Axios envuelve la respuesta en .data
    return response.data as SolicitudVoluntarioResponse;
  } catch (err: any) {
    console.error("[Service Org] ❌ Error:", err?.message || err);
    console.error("[Service Org] Response data:", err?.response?.data);
    throw err;
  }
}

export async function createSolicitudVoluntarioIndividual(
  payload: CreateSolicitudVoluntarioDto
): Promise<SolicitudVoluntarioResponse> {
  console.log("[Service Individual] Enviando payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await apiConfig.post("/solicitudes-voluntariado", payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("[Service Individual] ✅ Respuesta del backend:", response);
    console.log("[Service Individual] ✅ response.data:", response.data);
    
    // ✅ Axios envuelve la respuesta en .data
    return response.data as SolicitudVoluntarioResponse;
  } catch (err: any) {
    console.error("[Service Individual] ❌ Error:", err?.message || err);
    console.error("[Service Individual] Response data:", err?.response?.data);
    throw err;
  }
}

// ✅ Función para subir documentos
export async function uploadVolunteerDocuments(
  solicitudId: number,
  files: {
    cv?: File;
    cedula?: File;
    carta?: File;
  }
) {
  console.log("[Service Volunteers] uploadDocuments llamado con:", {
    solicitudId,
    cv: files.cv?.name,
    cedula: files.cedula?.name,
    carta: files.carta?.name,
  });

  const formData = new FormData();
  
  if (files.cv) {
    console.log("[Service Volunteers] Agregando CV al FormData:", files.cv.name);
    formData.append('cv', files.cv);
  }
  
  if (files.cedula) {
    console.log("[Service Volunteers] Agregando cédula al FormData:", files.cedula.name);
    formData.append('cedula', files.cedula);
  }
  
  if (files.carta) {
    console.log("[Service Volunteers] Agregando carta al FormData:", files.carta.name);
    formData.append('carta', files.carta);
  }

  const entries = Array.from(formData.entries()).map(([k]) => k);
  console.log("[Service Volunteers] FormData entries:", entries);

  if (entries.length === 0) {
    console.error("[Service Volunteers] ❌ FormData está vacío!");
    throw new Error("No hay archivos para subir");
  }

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(
      `${apiUrl}/solicitudes-voluntariado/${solicitudId}/upload-documents`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Service Volunteers] Error response:", errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[Service Volunteers] ✅ Documentos subidos:", data);
    return data;
  } catch (err: any) {
    console.error("[Service Volunteers] ❌ Error al subir documentos:", err?.message || err);
    throw err;
  }
}