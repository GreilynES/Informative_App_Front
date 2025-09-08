// components/Services/serviceModal.tsx
import type { Service } from "../../models/ServicesType"
import { useState } from "react"

export function ServicesModal({
  content,
  onClose,
}: {
  content: Service
  onClose: () => void
}) {
  const [imgOk, setImgOk] = useState(true)

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8 max-h-[70vh] overflow-auto">
          {/* Imagen arriba, con contenedor fijo. Si falla la carga, mostramos un placeholder del mismo alto (NO ocultamos la sección). */}
          <div className="w-full h-48 rounded-lg overflow-hidden mb-6 bg-[#F5F7EC] flex items-center justify-center">
            {content.image && imgOk ? (
              <img
                src={content.image}
                alt="Imagen del servicio"
                className="w-full h-full object-cover"
                onError={() => setImgOk(false)}
              />
            ) : (
              <span className="text-sm text-[#475C1D]/70 px-4 text-center">
                Imagen no disponible
              </span>
            )}
          </div>

          <p
            className="text-[#2E321B] text-base leading-relaxed whitespace-pre-wrap"
            style={{
              overflowWrap: "anywhere",   // fuerza saltos incluso sin espacios
              wordBreak: "break-word",    // refuerzo extra para navegadores
              maxWidth: "100%",           // nunca excede el ancho del modal
            }}
          >
            {content.modalDescription}
          </p>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-[#475C1D] text-white font-semibold hover:bg-[#2E321B] transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* cierra clickeando fuera */}
      <button
        aria-label="Cerrar modal"
        className="fixed inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  )
}
