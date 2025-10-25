import Swal from "sweetalert2";


(function injectSwalCssOnce() {
  const id = "swal2-default-styles";
  if (document.getElementById(id)) return;

  // CSS oficial (por si el bundler no lo incluye o si estás por CDN)
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css";
  document.head.appendChild(link);

  // Utilidad pequeña para botones sin borde/sombra (opcional)
  const style = document.createElement("style");
  style.textContent = `
    .no-border-button { border: 0 !important; box-shadow: none !important; }
  `;
  document.head.appendChild(style);
})();

/* ──────────────────────────────────────────────────────────────────────────── */
/*                              Helpers de flujo                               */
/* ──────────────────────────────────────────────────────────────────────────── */

/**
 * Muestra un modal de CARGA bloqueante.
 * Incluye un auto-timeout de seguridad para que nunca quede pegado.
 */
export const showLoading = (text = "Cargando datos...") => {
  const p = Swal.fire({
    title: text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
    background: "#FAF9F5",
  });
  setTimeout(() => {
    if (Swal.isVisible()) {
      Swal.close();
    }
  }, 8000);

  return p;
};

/**
 * Cierra la carga (si hubiera) y muestra éxito breve.
 */
export const stopLoadingWithSuccess = async (
  message = "Operación realizada correctamente"
) => {
  // cerramos cualquier loading previo
  Swal.close();
  return Swal.fire({
    icon: "success",
    title: "Completado",
    text: message,
    timer: 900,
    timerProgressBar: true,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    background: "#FAF9F5",
  });
};

/**
 * Cierra la carga (si hubiera) y muestra error con confirmación.
 */
export const stopLoadingWithError = async (
  message = "Ocurrió un error. Intenta de nuevo."
) => {
  // cerramos cualquier loading previo
  Swal.close();
  return Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonColor: "#708C3E",
    customClass: { confirmButton: "no-border-button" },
    background: "#FAF9F5",
  });
};



/* ──────────────────────────────────────────────────────────────────────────── */
/*                 ESPECÍFICOS PARA “Enviar solicitud” del paso 7              */
/* ──────────────────────────────────────────────────────────────────────────── */

export const submitSolicitudFlow = async <T>(
  action: () => Promise<T>,
  {
    loadingText = "Enviando solicitud...",
    successText = "Solicitud enviada correctamente.",
    errorText = "No se pudo enviar la solicitud.",
  }: {
    loadingText?: string;
    successText?: string;
    errorText?: string;
  } = {}
) => {
  await showLoading(loadingText);

  // indicador para no cerrar el modal de éxito/error en el finally
  let handled = false;

  try {
    const result = await action();
    await stopLoadingWithSuccess(successText); // cierra loading y muestra éxito
    handled = true;
    return { ok: true, result };
  } catch (err) {
    await stopLoadingWithError(errorText); // cierra loading y muestra error
    handled = true;
    return { ok: false, error: err };
  } finally {
    if (!handled && Swal.isVisible()) {
      Swal.close();
    }
  }
};