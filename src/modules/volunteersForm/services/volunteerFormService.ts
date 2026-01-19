import apiConfig from "../../../apiConfig/apiConfig";
import type { CreateSolicitudVoluntarioDto, SolicitudVoluntarioResponse } from "../models/createVolunteer";


export async function createSolicitudVoluntario(
  payload: CreateSolicitudVoluntarioDto
): Promise<SolicitudVoluntarioResponse> {

  try {
    const response = await apiConfig.post("/solicitudes-voluntariado", payload, {
      headers: { "Content-Type": "application/json" },
    });
    //Axios envuelve la respuesta en .data
    return response.data as SolicitudVoluntarioResponse;
  } catch (err: any) {
    console.error("[Service Org] Response data:", err?.response?.data);
    throw err;
  }
}

export async function createSolicitudVoluntarioIndividual(
  payload: CreateSolicitudVoluntarioDto
): Promise<SolicitudVoluntarioResponse> {

  try {
    const response = await apiConfig.post("/solicitudes-voluntariado", payload, {
      headers: { "Content-Type": "application/json" },
    });

    // Axios envuelve la respuesta en .data
    return response.data as SolicitudVoluntarioResponse;
  } catch (err: any) {
    console.error("[Service Individual] Response data:", err?.response?.data);
    throw err;
  }
}

//Función para subir documentos
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
    formData.append('cv', files.cv);
  }
  
  if (files.cedula) {
    formData.append('cedula', files.cedula);
  }
  
  if (files.carta) {
    formData.append('carta', files.carta);
  }

  const entries = Array.from(formData.entries()).map(([k]) => k);

  if (entries.length === 0) {
    console.error("[Service Volunteers] ❌ FormData está vacío!");
    throw new Error("No hay archivos para subir");
  }

  try {
    const apiUrl = import.meta.env.VITE_API_URL;
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
    return data;
  } catch (err: any) {
    console.error("[Service Volunteers] ❌ Error al subir documentos:", err?.message || err);
    throw err;
  }

  
}

export async function existsCedula(cedula: string): Promise<boolean> {
  const v = (cedula ?? "").trim();
  if (!v) return false;
  
  console.log("[existsCedula] Verificando cédula:", v);
  
  try {
    const response = await apiConfig.get(`/personas/cedula/${encodeURIComponent(v)}`);
    console.log("[existsCedula] ✅ Cédula encontrada (existe):", response.data);
    return true; 
  } catch (err: any) {
    const status = err?.response?.status;
    console.log("[existsCedula] Status recibido:", status);
    
    if (status === 404) {
      console.log("[existsCedula] ✅ Cédula NO existe (disponible)");
      return false; 
    }
    
  
    console.warn("[existsCedula] ⚠️ Error al verificar cédula:", status, err?.message);
    console.warn("[existsCedula] Permitiendo continuar por error de verificación");
    return false; 
  }
}

export async function existsEmail(email: string): Promise<boolean> {
  const v = (email ?? "").trim();
  if (!v) return false;
  
  console.log("[existsEmail] Verificando email:", v);
  
  try {
    const response = await apiConfig.get(`/personas/email/${encodeURIComponent(v)}`);
    console.log("[existsEmail] ✅ Email encontrado (existe):", response.data);
    return true; 
  } catch (err: any) {
    const status = err?.response?.status;
    console.log("[existsEmail] Status recibido:", status);
    
    if (status === 404) {
      console.log("[existsEmail] ✅ Email NO existe (disponible)");
      return false; 
    }
    
    console.warn("[existsEmail] ⚠️ Error al verificar email:", status, err?.message);
    console.warn("[existsEmail] Permitiendo continuar por error de verificación");
    return false; 
  }
}
