import { useEffect, useState, useRef } from "react"
import type { FAQ } from "../models/FAQType";
import { socket } from "../../../shared/lib/socket";

interface FaqPayload {
  action: "created" | "updated" | "deleted";
  data?: FAQ;
  id?: number;
}

export function useFaqRealtime(callback: (payload: FaqPayload) => void) {
  // Guarda la última callback para no re-suscribir el socket al cambiar la referencia
  const cbRef = useRef(callback);
  useEffect(() => { cbRef.current = callback; }, [callback]);

  useEffect(() => {
    const handler = (payload: FaqPayload) => {
      if (payload.action === "created" && payload.data) return cbRef.current(payload);
      if (payload.action === "updated" && payload.data) return cbRef.current(payload);
      if (payload.action === "deleted" && typeof payload.id === "number") return cbRef.current(payload);
    };
  
    socket.on("faq:updated", handler);
  
    // ⬇️  Importante: que esta función NO retorne el socket
    return () => {
      socket.off("faq:updated", handler);
    };
  }, []);
}
export function useFaqToggle() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return { openIndex, toggleFAQ }
}
