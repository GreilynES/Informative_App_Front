import { useEffect, useState } from "react";
import { getInformativeServices } from "../services/servicesInformativeService";
import { type Service } from "../models/ServicesType";
import { socket as socketPublic } from "../lib/socket";

export function useServicesCarousel(cardsPerSlide: number) {
  const [services, setServices] = useState<Service[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Para el carrusel infinito
  const originalLength = services.length;
  const infiniteServices = [...services, ...services, ...services];
  const startIndex = originalLength;

  // Fetch inicial (HTTP público)
  useEffect(() => {
    async function fetchData() {
      const data = await getInformativeServices();
      setServices(data);
      setCurrentSlide(data.length); // arrancamos en el centro del carrusel infinito
    }
    fetchData();
  }, []);

  // 🔴 Realtime por WebSocket (crear/actualizar/eliminar)
  useEffect(() => {
    const handler = (p: {
      action: "created" | "updated" | "deleted";
      data?: Service;
      id?: number | string;
    }) => {
      if (p.action === "created" && p.data) {
        setServices((prev) => [p.data!, ...prev]);
        setCurrentSlide((s) => Math.max(s, 1));
      }
      if (p.action === "updated" && p.data) {
        setServices((prev) =>
          prev.map((s) => (s.id === p.data!.id ? p.data! : s))
        );
      }
      if (p.action === "deleted" && p.id != null) {
        const idNum = Number(p.id);
        setServices((prev) => prev.filter((s) => s.id !== idNum));
        // Aseguramos que el índice actual quede dentro del rango
        setCurrentSlide((s) => Math.max(0, Math.min(s, Math.max(0, s - 1))));
      }
    };

    socketPublic.on("service:updated", handler);
    return () => {
      socketPublic.off("service:updated", handler);
    };
  }, []);

  // Navegación del carrusel
  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  // Reseteo del “infinite scroll” cuando termina la transición
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        if (currentSlide >= originalLength * 2) {
          setCurrentSlide(originalLength);
        } else if (currentSlide < 0) {
          setCurrentSlide(originalLength - 1);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, isTransitioning, originalLength]);

  // Índice real (sin el padding del infinito)
  const getRealSlideIndex = () => {
    return currentSlide >= originalLength
      ? currentSlide - originalLength
      : currentSlide;
  };

  // Servicios visibles en el slide actual
  const getVisibleServices = () => {
    const visible: Array<Service & { key: string }> = [];
    for (let i = 0; i < cardsPerSlide; i++) {
      const index = (currentSlide + i) % infiniteServices.length;
      if (infiniteServices[index]) {
        visible.push({
          ...infiniteServices[index],
          key: `${infiniteServices[index].title}-${currentSlide}-${i}`,
        });
      }
    }
    return visible;
  };

  return {
    // estado
    currentSlide,
    isTransitioning,
    // acciones
    goToPrev,
    goToNext,
    // selectores
    getVisibleServices,
    getRealSlideIndex,
    // setters útiles
    setCurrentSlide,
    // metadata
    originalLength,
    startIndex,
  };
}
