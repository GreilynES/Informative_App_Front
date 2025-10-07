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

//PARA SUBIR DOCUMENTOS
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

  // Verificar que el FormData tiene datos
  const entries = Array.from(formData.entries()).map(([k, ]) => k);
  console.log("[Service] FormData entries:", entries);

  if (entries.length === 0) {
    console.error("[Service] ❌ FormData está vacío!");
    throw new Error("No hay archivos para subir");
  }

  try {
    const response = await apiConfig.post(
      `/solicitudes/${solicitudId}/upload-documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log("[Service] ✅ Documentos subidos:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("[Service] ❌ Error al subir documentos:", err?.message || err);
    console.error("[Service] Response:", err?.response?.data);
    throw err;
  }

}