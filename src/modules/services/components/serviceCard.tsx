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

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex flex-col p-8 h-full">
        {/* Icono */}
        <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
          <Icon className="h-5 w-5 text-[#6F8C1F]" />
        </div>

        {/* Título */}
        <h3 className="text-2xl font-semibold text-[#2E321B]">
          {service.title}
        </h3>

        {/* Descripción */}
        <p className="mt-4 text-base leading-relaxed text-gray-600 whitespace-pre-wrap">
          {service.cardDescription}
        </p>

        {/* CTA */}
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
          className="mt-6 w-fit text-sm font-medium text-[#6F8C1F] hover:underline"
        >
          Más información →
        </button>

        {/* Bloque inferior (imagen o placeholder) */}
        <div className="mt-10 overflow-hidden rounded-2xl bg-gray-100">
          {service.image ? (
            <img
              src={service.image}
              alt={service.title}
              className="h-44 w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-44 w-full bg-gray-200" />
          )}
        </div>
      </div>
    </article>
  )
}
