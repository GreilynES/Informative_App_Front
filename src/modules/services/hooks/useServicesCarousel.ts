import { useEffect, useMemo, useState } from "react"
import { useServices } from "./useServices"

export function useServicesCarousel() {
  const { services, isLoading } = useServices()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const cardsPerSlide = 3
  const originalLength = services.length

  const infiniteServices = useMemo(() => {
    if (originalLength === 0) return []
    if (originalLength <= cardsPerSlide) return services

    const prefix = services.slice(-cardsPerSlide)
    const suffix = services.slice(0, cardsPerSlide)
    return [...prefix, ...services, ...suffix]
  }, [services, originalLength, cardsPerSlide])

  useEffect(() => {
    if (originalLength > cardsPerSlide && currentSlide === 0) {
      setCurrentSlide(cardsPerSlide)
    } else if (originalLength <= cardsPerSlide) {
      setCurrentSlide(0)
    }
  }, [originalLength, currentSlide, cardsPerSlide])

  const goToPrev = () => {
    if (isTransitioning || originalLength === 0 || originalLength <= cardsPerSlide) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => prev - 1)
  }

  const goToNext = () => {
    if (isTransitioning || originalLength === 0 || originalLength <= cardsPerSlide) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => prev + 1)
  }

  useEffect(() => {
    if (!isTransitioning) return
    if (originalLength <= cardsPerSlide) {
      setIsTransitioning(false)
      return
    }

    const timer = setTimeout(() => {
      setIsTransitioning(false)
      const leftBound = cardsPerSlide
      const rightBound = cardsPerSlide + originalLength - 1

      if (currentSlide < leftBound) {
        setCurrentSlide(rightBound)
      } else if (currentSlide > rightBound) {
        setCurrentSlide(leftBound)
      }
    }, 700)
    return () => clearTimeout(timer)
  }, [currentSlide, isTransitioning, originalLength, cardsPerSlide])

  const getRealSlideIndex = () => {
    if (originalLength === 0 || originalLength <= cardsPerSlide) return 0
    const offset = currentSlide - cardsPerSlide
    return ((offset % originalLength) + originalLength) % originalLength
  }

  const getTranslateX = () => {
    if (originalLength <= cardsPerSlide) return 0
    return -(currentSlide * (100 / cardsPerSlide))
  }

  const getTotalSlides = () => {
    if (originalLength === 0 || originalLength <= cardsPerSlide) return 1
    return originalLength
  }

  const getCardWidth = () => {
    if (originalLength === 0) return "100%"
    if (originalLength === 1) return "100%"
    if (originalLength === 2) return "calc(50% - 12px)"
    return "calc((100% - 48px) / 3)"
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
    getCardWidth,
    isLoading,
  }
}