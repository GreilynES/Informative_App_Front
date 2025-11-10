export function ServicesCard({ service, openModal }: any) {
  return (
    <div className="rounded-2xl shadow-sm hover:shadow-md hover:shadow-[#e7c78d]/40 transition-all duration-300 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-[#BFD76F] to-[#6F8C1F]" />
      <div className="bg-white rounded-b-2xl flex flex-col min-h-[318px] break-words leading-relaxed px-6 py-8 p-6 md:p-8 max-h-[70vh] overflow-auto">
        <h3 className="text-xl font-semibold text-[#2E321B] mb-3 break-words whitespace-normal">{service.title}</h3>
        <div className="text-[#2E321B] text-base leading-relaxed whitespace-pre-wrap break-all">
            {service.cardDescription}
          </div>
          <button
              onClick={() =>
                openModal(
                  service.id,
                  service.title,
                  service.modalDescription ?? "",
                  service.image ?? "",
                  service.cardDescription ?? ""
                )
              }
              className="text-[#D8B769] font-medium hover:underline flex items-center gap-1 mt-auto"
            >
              Más información
            </button>
      </div>
    </div>
  )
}