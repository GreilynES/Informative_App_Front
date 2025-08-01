export function ServicesCard({ service, openModal }: any) {
  return (
    <div className="rounded-2xl shadow-sm hover:shadow-md hover:shadow-[#e7c78d]/40 transition-all duration-300 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-[#BFD76F] to-[#6F8C1F]" />
      <div className="bg-white rounded-b-2xl flex flex-col min-h-[318px] max-h-[318px] px-6 py-8">
        <h3 className="text-xl font-semibold text-[#2E321B] mb-3">{service.title}</h3>
        <p className="text-[#475C1D] text-sm mb-4 flex-grow">{service.cardDescription}</p>
        <button
          onClick={() => openModal(service.title, service.modalDescription || "", service.image)}
          className="text-[#D8B769] to-[#A7C957] font-medium text-m hover:underline flex items-center gap-1 mt-auto"
        >
          Más información
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
