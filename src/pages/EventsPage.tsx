import { useState, useEffect, useRef } from "react";
import { useEventRealtime, useEvents } from "../hooks/useEvents";
import { AnimatedEventWrapper } from "../animations/EventChange";

import type { EventData } from "../models/EventType";          // ajusta el tipo si tu model se llama distinto

export default function EventsPage() {
  const { events, isLoading } = useEvents(); // fetch inicial (HTTP público)
  const [rtEvents, setRtEvents] = useState<EventData[]>([]);   // 👈 fuente de verdad para render
  const [currentEvent, setCurrentEvent] = useState(0);
  const [direction, setDirection] = useState(0);
  const seeded = useRef(false);     // 👈 para evitar múltiples seeds

  // Obtener eventId de la URL si existe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const eventId = urlParams.get('eventId');
    
    if (eventId && events && events.length > 0) {
      const eventIndex = events.findIndex(event => event.id === parseInt(eventId));
      if (eventIndex !== -1) {
        setCurrentEvent(eventIndex);
        setRtEvents(events);
        seeded.current = true;
        return;
      }
    }
    
    // seed: cuando llega la data inicial, llénala una sola vez
    if (events && events.length > 0) {
      if (!seeded.current) {
        setRtEvents(events);
        setCurrentEvent(0);
        seeded.current = true;
      }
    }
  }, [events]);

  // realtime
  useEventRealtime<EventData>((payload: any) => {
    if (payload.action === "created" && payload.data) {
      setRtEvents((prev) => [payload.data!, ...prev]);
      setCurrentEvent(0);
      return;
    }
    if (payload.action === "updated" && payload.data) {
      setRtEvents((prev) =>
        prev.map((e) => (e.id === payload.data!.id ? payload.data! : e))
      );
      return;
    }
    if (payload.action === "deleted" && payload.id != null) {
      setRtEvents((prev) => {
        const next = prev.filter((e) => e.id !== Number(payload.id));
        // ajusta el índice si quedó fuera de rango
        if (next.length === 0) {
          setCurrentEvent(0);
        } else if (currentEvent >= next.length) {
          setCurrentEvent(next.length - 1);
        }
        return next;
      });
        const idNum = Number(payload.id);
      setRtEvents(prev => {
        const next = prev.filter(e => e.id !== idNum);
        setCurrentEvent(ci => (next.length === 0 ? 0 : Math.min(ci, next.length - 1)));
        return next;
      });
    }
  });

  const nextEvent = () => {
    if (rtEvents.length === 0) return;
    setDirection(1);
    setCurrentEvent((prev) => (prev + 1) % rtEvents.length);
  };

  const prevEvent = () => {
    if (rtEvents.length === 0) return;
    setDirection(-1);
    setCurrentEvent((prev) => (prev - 1 + rtEvents.length) % rtEvents.length);
  };

  const goToEvent = (index: number) => {
    if (rtEvents.length === 0) return;
    setDirection(index > currentEvent ? 1 : -1);
    setCurrentEvent(index);
  };

  if (isLoading || rtEvents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-[#2E321B]">
        Cargando eventos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFDF4] px-12 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2E321B] mb-6">Próximos Eventos</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#BFD76F] to-[#6F8C1F] mx-auto mb-4" />
          <p className="text-xl text-[#475C1D] max-w-2xl mx-auto">
            Navega entre nuestros eventos y encuentra el perfecto para ti
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <AnimatedEventWrapper
            event={rtEvents[currentEvent]}   // ✅ render con estado en vivo
            onPrev={prevEvent}
            onNext={nextEvent}
            currentIndex={currentEvent}   
            total={rtEvents.length}
            setCurrentIndex={goToEvent}
            direction={direction}
          />
        </div>
      </div>
    </div>
  );
}
