export function ServicesModal({ content, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl p-8 w-full max-w-2xl md:max-w-3xl lg:max-w-4xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={content.image || "/placeholder.svg"}
          alt={content.title}
          className="w-full h-48 object-cover rounded-lg mb-6"
        />
        <h3 className="text-2xl font-bold mb-4 text-[#2E321B]">{content.title}</h3>
        <div className="text-[#2E321B] text-base leading-relaxed whitespace-pre-wrap break-all">
            {content.modalDescription}
          </div>
        <div className="text-right">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-[#7A944B] to-[#475C1D] text-white font-semibold px-6 py-2 rounded-lg shadow hover:brightness-110 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}