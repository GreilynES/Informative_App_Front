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

/* ─/* Helpers de flujo */

export const showLoading = (
  text = "Cargando datos...",
  opts?: { note?: string }
) => {
  const note =
    opts?.note ??
    "Por favor, no cierres esta pestaña ni actualices la página mientras finalizamos el proceso."

  const p = Swal.fire({
    title: text,
    html: `<div style="margin-top:10px; font-size:12px; opacity:.9;">
            ${note}
           </div>`,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    background: "transparent",
    customClass: {
      popup: "camara-popup camara-glass",
      title: "camara-title camara-title--on-dark",
      htmlContainer: "camara-text camara-text--on-dark",
      loader: "camara-loader",
      timerProgressBar: "camara-progress",
    },
    didOpen: () => {
      Swal.showLoading()
const loader = Swal.getContainer()?.querySelector(".swal2-loader") as HTMLElement | null;
      if (loader) loader.classList.add("camara-loader")
    },
  })

  // ⛑️ auto-timeout (de seguridad)
  setTimeout(() => {
    if (Swal.isVisible()) Swal.close()
  }, 10000)

  return p
}


export const stopLoadingWithSuccess = async (
  message = "Operación realizada correctamente"
) => {
  Swal.close();

  return Swal.fire({
    icon: "success",
    title: "Listo",
    text: message,
    timer: 1200,
    timerProgressBar: true,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    background: "#FFFCE6", // crema menos amarillo que FAF9F5
    customClass: {
      popup: "camara-popup",
      title: "camara-title",
      htmlContainer: "camara-text",
      icon: "camara-icon-success",
      timerProgressBar: "camara-progress",
    },
  });
};

export const stopLoadingWithError = async (
  message = "Ocurrió un error. Intenta de nuevo."
) => {
  Swal.close();

  return Swal.fire({
    icon: "error",
    title: "No se pudo completar",
    html: `<div style="text-align:left; margin-top:8px;">
            <div style="opacity:.9">${message}</div>
            <div style="margin-top:10px; font-size:12px; opacity:.85;">
              Tip: revisá tu conexión e intentá nuevamente.
            </div>
          </div>`,
    showCancelButton: false,
    confirmButtonText: "Entendido",
    allowOutsideClick: false,
    allowEscapeKey: true,
    background: "#FFFCE6",
    customClass: {
      popup: "camara-popup",
      title: "camara-title",
      htmlContainer: "camara-text",
      confirmButton: "camara-confirm",
      icon: "camara-icon-error",
    },
    buttonsStyling: false, // importante para que tome tus clases
  });
};

/* Específico submit */

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

  let handled = false;

  try {
    const result = await action();
    await stopLoadingWithSuccess(successText);
    handled = true;
    return { ok: true, result };
  } catch (err) {
    await stopLoadingWithError(errorText);
    handled = true;
    return { ok: false, error: err };
  } finally {
    if (!handled && Swal.isVisible()) Swal.close();
  }
};