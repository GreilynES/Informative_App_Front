import apiConfig from "../../../apiConfig/apiConfig";

// 🔧 Helper local: limpia undefined/null y strings vacíos "" (profundidad recursiva).
// Usa `keepEmptyKeys` para no borrar claves que sí aceptan "" (p. ej., caserio).
function sanitizePayload(obj: any, keepEmptyKeys: string[] = []): any {
  if (Array.isArray(obj)) {
    const arr = obj
      .map((v) => sanitizePayload(v, keepEmptyKeys))
      .filter((v) => v !== undefined);
    return arr;
  }

  if (obj && typeof obj === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined || v === null) continue;
      if (typeof v === "string") {
        const trimmed = v.trim();
        // si la key está en keepEmptyKeys, permitimos ""
        if (trimmed === "" && !keepEmptyKeys.includes(k)) continue;
        out[k] = trimmed;
      } else if (typeof v === "object") {
        const nested = sanitizePayload(v, keepEmptyKeys);
        // si el objeto quedó vacío, lo omitimos
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

export async function createSolicitud(payload: any) {
  
  if (!payload.persona || !payload.datosAsociado) {

  }

  try {
    const cleanData = sanitizePayload(payload, ["caserio"]);
    const data = await apiConfig.post("/solicitudes", cleanData, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (err: any) {
    throw err;
  }
}

// ========== NUEVA FUNCIÓN PARA SUBIR DOCUMENTOS ==========
export async function uploadDocuments(
  solicitudId: number,
  files: {
    cedula?: File;
    planoFinca?: File;
  }
) {

  const formData = new FormData();
  
  if (files.cedula) {
    formData.append('cedula', files.cedula);
  }
  
  if (files.planoFinca) {
    formData.append('planoFinca', files.planoFinca);
  }

  const entries = Array.from(formData.entries()).map(([k]) => k);

  if (entries.length === 0) {
    throw new Error("No hay archivos para subir");
  }

  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(
      `${apiUrl}/solicitudes/${solicitudId}/upload-documents`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    throw err;
  }
}


export async function existsCedula(cedula: string): Promise<boolean> {
  const v = (cedula ?? "").trim();
  if (!v) return false;

  try {
    await apiConfig.get(`/associates/cedula/${encodeURIComponent(v)}`);
    return true;
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 404) return false; // disponible
    return false; // no bloquear por error de red
  }
}


export async function existsEmail(email: string): Promise<boolean> {
  const v = (email ?? "").trim();
  if (!v) return false;
  
  
  try {
    await apiConfig.get(`/personas/email/${encodeURIComponent(v)}`);
    return true; // 200 => existe
  } catch (err: any) {
    const status = err?.response?.status;
    
    if (status === 404) {
      return false; // 404 => no existe, disponible para registro
    }
    return false; // En caso de error, no bloquear al usuario
  }
}

export async function lookupPersonaByCedulaForForms(cedula: string) {
  const v = (cedula ?? "").trim();
  if (!v) return null;

  try {
    const { data } = await apiConfig.get(`/personas/cedula/${encodeURIComponent(v)}`);
    return data; // PersonaFormLookupDto
  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 404) return null;
    throw err;
  }
}

export async function validateSolicitudAsociado(cedula: string) {
  const v = (cedula ?? "").trim();
  if (!v) return { ok: true };

  const { data } = await apiConfig.post("/solicitudes/validate", { cedula: v });
  return data; // { ok: true }
}