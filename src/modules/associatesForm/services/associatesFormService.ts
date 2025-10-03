import apiConfig from "../../../apiConfig/apiConfig";

export async function createSolicitud(payload: any) {
  console.log("[Service] ===== VERIFICACIÓN DE PAYLOAD =====");
  console.log("[Service] Payload completo:", JSON.stringify(payload, null, 2));
  console.log("[Service] ¿Tiene 'persona'?", !!payload.persona);
  console.log("[Service] ¿Tiene 'datosAsociado'?", !!payload.datosAsociado);
  
  if (!payload.persona || !payload.datosAsociado) {
    console.error("[Service] ❌ ERROR: El payload NO tiene la estructura correcta!");
    console.error("[Service] Estructura actual:", Object.keys(payload));
  }

  try {
    const data = await apiConfig.post("/solicitudes", payload, {
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