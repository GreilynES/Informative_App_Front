import {
  CheckSquare,
  Clock,
  PieChart,
  Users,
  Repeat,
  Zap,
  type LucideIcon,
} from "lucide-react"

function getServiceIcon(serviceId: number): LucideIcon {
  const icons: LucideIcon[] = [Clock, CheckSquare, PieChart, Users, Repeat, Zap]
  return icons[(Math.max(0, serviceId - 1)) % icons.length]
}

export function ServicesCard({ service, openModal }: any) {
  const Icon = getServiceIcon(service.id)

  const handleOpen = () => {
    openModal(
      service.id,
      service.title,
      service.modalDescription ?? "",
      service.image ?? "",
      service.cardDescription ?? ""
    )
  }

  return (
    <article
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleOpen()
        }
      }}
      className="
        group
        relative
        flex
        flex-col
        overflow-hidden
        rounded-3xl
        border
        border-gray-200
        bg-white
        shadow-sm
        transition-all
        duration-700
        ease-out
        hover:-translate-y-2
        hover:shadow-lg

        /* ✅ ALTURA FIJA + RESPONSIVE (más bajita) */
        h-[500px] sm:h-[520px] lg:h-[540px]
      "
    >
      {/* Línea superior reactiva */}
      <div
        className="
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-[#D9E2B6]
          to-transparent
          transition-all
          duration-500
          ease-out
          group-hover:h-[3px]
          group-hover:via-[#8FAF3C]
        "
      />

      {/* ✅ Mantiene layout fijo y empuja imagen al fondo */}
      <div className="flex flex-col p-8 h-full">
        {/* Icono */}
        <div
          className="
            mb-6
            inline-flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-gray-100
            transition-colors
            duration-500
            ease-out
            group-hover:bg-[#F5F7EC]
          "
        >
          <Icon className="h-5 w-5 text-[#6F8C1F]" />
        </div>

        {/* Título */}
        <h3 className="text-2xl font-semibold text-[#2E321B]">
          {service.title}
        </h3>

        {/* ✅ Descripción con límite para que no cambie el alto */}
        <p className="mt-4 text-base leading-relaxed text-gray-600 whitespace-pre-wrap line-clamp-4 sm:line-clamp-5">
          {service.cardDescription}
        </p>

        {/* CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleOpen()
          }}
          className="
            mt-6
            w-fit
            text-sm
            font-medium
            text-[#6F8C1F]
            transition-colors
            duration-300
            hover:underline
          "
        >
          Más información →
        </button>

        {/* ✅ Empuja el bloque inferior al fondo SIEMPRE */}
        <div className="mt-auto pt-6 overflow-hidden rounded-2xl bg-gray-100">
          {service.image ? (
            <img
              src={service.image}
              alt={service.title}
              className="h-36 sm:h-40 w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-36 sm:h-40 w-full bg-gray-200" />
          )}
        </div>
      </div>
    </article>
  )
}
