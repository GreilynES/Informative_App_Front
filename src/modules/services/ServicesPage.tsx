import { useEffect, useMemo, useRef, useState } from "react"
import { initialStateService, type Service } from "./models/ServicesType"
import { useServices } from "./hooks/useServices"
import { ServicesCard } from "./components/serviceCard"
import { ServicesModal } from "./components/serviceModal"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function ServicesPage() {
  const { services, isLoading, error } = useServices()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<Service>(initialStateService)

  // Paginado (6 por página)
  const PAGE_SIZE = 6
  const [page, setPage] = useState(1)

  // Ref para volver al inicio de "Nuestros servicios"
  const servicesTopRef = useRef<HTMLHeadingElement | null>(null)

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(services.length / PAGE_SIZE))
  }, [services.length])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
    if (page < 1) setPage(1)
  }, [page, totalPages])

  const pagedServices = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return services.slice(start, start + PAGE_SIZE)
  }, [services, page])

  // Cada vez que cambia la página, volvemos al inicio del título
  useEffect(() => {
    servicesTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }, [page])

  const openModal = (
    id: number,
    title: string,
    modalDescription: string,
    image: string,
    cardDescription: string
  ) => {
    setModalContent({ id, title, modalDescription, image, cardDescription })
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const go = (n: number) => {
    const safe = Math.min(Math.max(1, n), totalPages)
    setPage(safe)
  }

  // Render de páginas estilo shadcn (1 … current-1 current current+1 … last)
  const pageItems = useMemo(() => {
    if (totalPages <= 1) return []

    const items: Array<
      | { type: "page"; n: number }
      | { type: "ellipsis"; key: string }
    > = []

    const addPage = (n: number) => items.push({ type: "page", n })
    const addEllipsis = (key: string) => items.push({ type: "ellipsis", key })

    // Siempre mostrar primera
    addPage(1)

    if (totalPages === 2) {
      addPage(2)
      return items
    }

    const left = Math.max(2, page - 1)
    const right = Math.min(totalPages - 1, page + 1)

    if (left > 2) addEllipsis("left")

    for (let n = left; n <= right; n++) addPage(n)

    if (right < totalPages - 1) addEllipsis("right")

    // Siempre mostrar última
    addPage(totalPages)

    return items
  }, [page, totalPages])

  return (
    <section className="min-h-full bg-white py-20">
      <div className="container mx-auto px-6 md:px-20">
        <div className="text-center space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Te ofrecemos</p>

          <h1
            ref={servicesTopRef}
            className="text-4xl md:text-5xl font-semibold text-[#2E321B] text-center mb-4"
          >
            Nuestros servicios
          </h1>
        </div>

        <p className="text-center text-base md:text-lg text-gray-600 mb-16 max-w-3xl mx-auto"></p>

        {/* Estados */}
        {isLoading && (
          <p className="text-center text-gray-500">Cargando servicios…</p>
        )}

        {error && (
          <p className="text-center text-red-500">Error al cargar los servicios.</p>
        )}

        {!isLoading && !error && services.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {pagedServices.map((service) => (
                <ServicesCard
                  key={service.id}
                  service={service}
                  openModal={openModal}
                />
              ))}
            </div>

            {/* Paginación */}
            {services.length > PAGE_SIZE && totalPages > 1 && (
              <div className="mt-10 flex justify-center">
            <Pagination>
              <PaginationContent className="w-full justify-center">
                {/* IZQUIERDA: Anterior (o placeholder invisible) */}
                <PaginationItem className="w-[110px] flex justify-start">
                  {page > 1 ? (
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        go(page - 1)
                      }}
                    />
                  ) : (
                    <span className="invisible inline-flex items-center gap-1 px-3 py-2">
                      <span>Previous</span>
                    </span>
                  )}
                </PaginationItem>

                {/* CENTRO: números */}
                <div className="flex items-center gap-1">
                  {pageItems.map((it) => {
                    if (it.type === "ellipsis") {
                      return (
                        <PaginationItem key={it.key}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }

                    const active = it.n === page
                    return (
                      <PaginationItem key={it.n}>
                        <PaginationLink
                          href="#"
                          isActive={active}
                          onClick={(e) => {
                            e.preventDefault()
                            go(it.n)
                          }}
                        >
                          {it.n}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                </div>

                {/* DERECHA: Siguiente (o placeholder invisible) */}
                <PaginationItem className="w-[110px] flex justify-end">
                  {page < totalPages ? (
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        go(page + 1)
                      }}
                    />
                  ) : (
                    <span className="invisible inline-flex items-center gap-1 px-3 py-2">
                      <span>Next</span>
                    </span>
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>


              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <ServicesModal content={modalContent} onClose={closeModal} />
      )}
    </section>
  )
}
