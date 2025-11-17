import { useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import type { Service } from "../models/ServicesType"

interface ServicesModalProps {
  content: Service
  onClose: () => void
}

export function ServicesModal({ content, onClose }: ServicesModalProps) {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    // Guardar el overflow y position actuales
    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position
    const scrollY = window.scrollY
    
    // Bloquear scroll
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    
    // Restaurar scroll cuando se desmonte el componente
    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.position = originalPosition
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

  const modalContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con imagen */}
        {content.image && (
          <div className="relative h-64 w-full overflow-hidden rounded-t-2xl">
            <img
              src={content.image}
              alt={content.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
          aria-label="Cerrar modal"
        >
          <X className="w-6 h-6 text-[#2E321B]" />
        </button>

        {/* Contenido */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-[#2E321B] mb-6">
            {content.title}
          </h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-[#2E321B] leading-relaxed whitespace-pre-wrap">
              {content.modalDescription}
            </p>
          </div>

          {/* Botón cerrar inferior */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-[#6F8C1F] to-[#475C1D] hover:from-[#5d741c] hover:to-[#384c17] text-white rounded-lg font-medium transition-all duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}