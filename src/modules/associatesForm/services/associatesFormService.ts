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
  console.log("[Service] ===== VERIFICACIÓN DE PAYLOAD =====");
  console.log("[Service] Payload completo:", JSON.stringify(payload, null, 2));
  console.log("[Service] ¿Tiene 'persona'?", !!payload.persona);
  console.log("[Service] ¿Tiene 'datosAsociado'?", !!payload.datosAsociado);
  console.log("[Service] ¿Tiene 'propietario'?", !!payload.propietario);
  
  if (!payload.persona || !payload.datosAsociado) {
    console.error("[Service] ❌ ERROR: El payload NO tiene la estructura correcta!");
    console.error("[Service] Estructura actual:", Object.keys(payload));
  }

  try {
    const cleanData = sanitizePayload(payload, ["caserio"]);
    const data = await apiConfig.post("/solicitudes", cleanData, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("[Service] ✅ Respuesta del back:", data);
    return data;
  } catch (err: any) {
    console.error("[Service] ❌ Error al enviar solicitud:", err?.message || err);
    console.error("[Service] Response data:", err?.response?.data);
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
  console.log("[Service] uploadDocuments llamado con:", {
    solicitudId,
    cedula: files.cedula?.name,
    planoFinca: files.planoFinca?.name,
  });

  const formData = new FormData();
  
  if (files.cedula) {
    console.log("[Service] Agregando cédula al FormData:", files.cedula.name);
    formData.append('cedula', files.cedula);
  }
  
  if (files.planoFinca) {
    console.log("[Service] Agregando plano al FormData:", files.planoFinca.name);
    formData.append('planoFinca', files.planoFinca);
  }

  const entries = Array.from(formData.entries()).map(([k]) => k);
  console.log("[Service] FormData entries:", entries);

  if (entries.length === 0) {
    console.error("[Service] ❌ FormData está vacío!");
    throw new Error("No hay archivos para subir");
  }

  try {
    // ⚠️ USAR FETCH EN LUGAR DE AXIOS PARA FORMDATA
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(
      `${apiUrl}/solicitudes/${solicitudId}/upload-documents`,
      {
        method: 'POST',
        body: formData,
        // NO agregar Content-Type - fetch lo maneja automáticamente
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[Service] ✅ Documentos subidos:", data);
    return data;
  } catch (err: any) {
    console.error("[Service] ❌ Error al subir documentos:", err?.message || err);
    throw err;
  }
}

/* =========================================================
   NUEVOS HELPERS: verificación de unicidad (cédula / email)
   Convención:
   - 200 => existe
   - 404 => no existe
   - otros => se propaga error (para no enmascarar problemas)
   Ajusta las rutas a las de tu back si difieren.
========================================================= */


  export async function existsCedula(cedula: string): Promise<boolean> {
    const v = (cedula ?? "").trim();
    if (!v) return false;
    try {
      await apiConfig.get(`/personas/cedula/${encodeURIComponent(v)}`);
      return true; // 200 => existe
    } catch (err: any) {
      const st = err?.response?.status;
      if (st === 404) return false; // 404 => no existe
      console.warn("[existsCedula] verificación no concluyente:", st, err?.message);
      return false; // en error de red/500 => NO bloquees al usuario
    }
  }
 
  export async function existsEmail(email: string): Promise<boolean> {
    const v = (email ?? "").trim();
    if (!v) return false;
    try {
      await apiConfig.get(`/personas/email/${encodeURIComponent(v)}`);
      return true;
    } catch (err: any) {
      const st = err?.response?.status;
      if (st === 404) return false;
      console.warn("[existsEmail] verificación no concluyente:", st, err?.message);
      return false;
    }
  }
