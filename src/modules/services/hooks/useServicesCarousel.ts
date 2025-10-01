import { useEffect, useMemo, useState } from "react"
import { getInformativeServices } from "../services/servicesInformativeService"
import type { Service } from "../models/ServicesType"
import { socket as socketPublic } from "../../../shared/lib/socket"

export function useServicesCarousel() {
  const [services, setServices] = useState<Service[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const cardsPerSlide = 3
  const originalLength = services.length

  const infiniteServices = useMemo(() => {
    if (originalLength === 0) return []

    // If we have 3 or fewer services, don't create infinite scroll
    if (originalLength <= cardsPerSlide) {
      return services
    }

    // Only create infinite scroll for more than 3 services
    const prefix = services.slice(-cardsPerSlide) // 3 del final
    const suffix = services.slice(0, cardsPerSlide) // 3 del inicio
    return [...prefix, ...services, ...suffix]
  }, [services, originalLength])

  // Cargar datos
  useEffect(() => {
    async function fetchData() {
      const data = await getInformativeServices()
      setServices(data)
      if (data.length > cardsPerSlide) {
        setCurrentSlide(cardsPerSlide)
      } else {
        setCurrentSlide(0)
      }
    }
    fetchData()
  }, [])

  // Realtime (crear/actualizar/eliminar)
  useEffect(() => {
    const handler = (p: {
      action: "created" | "updated" | "deleted"
      data?: Service
      id?: number | string
    }) => {
      if (p.action === "created" && p.data) {
        setServices((prev) => {
          const newServices = [p.data!, ...prev]
          if (prev.length <= cardsPerSlide && newServices.length > cardsPerSlide) {
            setCurrentSlide(cardsPerSlide)
          }
          return newServices
        })
      }
      if (p.action === "updated" && p.data) {
        setServices((prev) => prev.map((s) => (s.id === p.data!.id ? p.data! : s)))
      }
      if (p.action === "deleted" && p.id != null) {
        const idNum = Number(p.id)
        setServices((prev) => {
          const newServices = prev.filter((s) => s.id !== idNum)
          if (prev.length > cardsPerSlide && newServices.length <= cardsPerSlide) {
            setCurrentSlide(0)
          } else if (newServices.length > cardsPerSlide) {
            setCurrentSlide((s) => Math.max(cardsPerSlide, s))
          }
          return newServices
        })
      }
    }

    socketPublic.on("service:updated", handler)
    return () => {
      socketPublic.off("service:updated", handler)
    }
  }, [])

  const goToPrev = () => {
    if (isTransitioning || originalLength === 0) return
    // Don't navigate if we have 3 or fewer services
    if (originalLength <= cardsPerSlide) return

    setIsTransitioning(true)
    setCurrentSlide((prev) => prev - 1)
  }

  const goToNext = () => {
    if (isTransitioning || originalLength === 0) return
    // Don't navigate if we have 3 or fewer services
    if (originalLength <= cardsPerSlide) return

    setIsTransitioning(true)
    setCurrentSlide((prev) => prev + 1)
  }

  // Fin de animación + corrección silenciosa de bordes (sin animar el "salto")
  useEffect(() => {
    if (!isTransitioning) return
    if (originalLength <= cardsPerSlide) {
      setIsTransitioning(false)
      return
    }

    const timer = setTimeout(() => {
      setIsTransitioning(false)

      const baseLen = originalLength
      const leftBound = cardsPerSlide
      const rightBound = cardsPerSlide + baseLen - 1

      if (currentSlide < leftBound) {
        setCurrentSlide(rightBound)
      } else if (currentSlide > rightBound) {
        setCurrentSlide(leftBound)
      }
    }, 700)
    return () => clearTimeout(timer)
  }, [currentSlide, isTransitioning, originalLength])

  const getRealSlideIndex = () => {
    if (originalLength === 0) return 0
    if (originalLength <= cardsPerSlide) return 0

    const offset = currentSlide - cardsPerSlide
    return ((offset % originalLength) + originalLength) % originalLength
  }

  const getTranslateX = () => {
    if (originalLength <= cardsPerSlide) return 0
    return -(currentSlide * (100 / cardsPerSlide))
  }

  const getTotalSlides = () => {
    if (originalLength === 0) return 0
    if (originalLength <= cardsPerSlide) return 1
    return originalLength
  }

  const getCardWidth = () => {
    if (originalLength === 0) return "100%"
    if (originalLength === 1) return "100%"
    if (originalLength === 2) return "calc(50% - 12px)" // Account for gap
    return "calc((100% - 48px) / 3)" // Original 3-card layout
  }

  return {
    currentSlide,
    isTransitioning,
    goToPrev,
    goToNext,
    getRealSlideIndex,
    getTranslateX,
    setCurrentSlide,
    originalLength,
    cardsPerSlide,
    infiniteServices,
    getTotalSlides,
    getCardWidth, // Added new function
  }
}