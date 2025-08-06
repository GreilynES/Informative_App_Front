// hooks/useServicesCarousel.ts
import { useEffect, useState } from "react"
import { getInformativeServices } from "../services/servicesInformativeService"
import { type Service } from "../models/ServicesType"

export function useServicesCarousel(cardsPerSlide: number) {
  const [services, setServices] = useState<Service[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const originalLength = services.length
  const infiniteServices = [...services, ...services, ...services]
  const startIndex = originalLength

  useEffect(() => {
    async function fetchData() {
      const data = await getInformativeServices()
      setServices(data)
      setCurrentSlide(data.length)
    }
    fetchData()
  }, [])

  const goToPrev = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => prev - 1)
  }

  const goToNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => prev + 1)
  }

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        if (currentSlide >= originalLength * 2) {
          setCurrentSlide(originalLength)
        } else if (currentSlide < 0) {
          setCurrentSlide(originalLength - 1)
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [currentSlide, isTransitioning, originalLength])

  const getRealSlideIndex = () => {
    return currentSlide >= originalLength ? currentSlide - originalLength : currentSlide
  }

  const getVisibleServices = () => {
    const visible = []
    for (let i = 0; i < cardsPerSlide; i++) {
      const index = (currentSlide + i) % infiniteServices.length
      if (infiniteServices[index]) {
        visible.push({
          ...infiniteServices[index],
          key: `${infiniteServices[index].title}-${currentSlide}-${i}`,
        })
      }
    }
    return visible
  }

  return {
    currentSlide,
    isTransitioning,
    goToPrev,
    goToNext,
    getVisibleServices,
    getRealSlideIndex,
    setCurrentSlide,
    originalLength,
  }
}
