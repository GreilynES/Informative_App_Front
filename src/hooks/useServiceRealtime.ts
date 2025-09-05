import { useEffect, useRef } from "react"
import { socket } from "../lib/socket"

export type ServicePayload<T> = {
  action: "created" | "updated" | "deleted";
  data?: T;
  id?: number | string;
};

export function useServiceRealtime<T>(onChange: (p: ServicePayload<T>) => void) {
  const cbRef = useRef(onChange);
  useEffect(() => { cbRef.current = onChange; }, [onChange]);

  useEffect(() => {
    const handler = (payload: ServicePayload<T>) => {
      if (payload.action === "created" && payload.data) return cbRef.current(payload);
      if (payload.action === "updated" && payload.data) return cbRef.current(payload);
      if (payload.action === "deleted" && payload.id != null) {
        const idNum = Number(payload.id);
        if (!Number.isNaN(idNum)) return cbRef.current({ ...payload, id: idNum });
      }
    };  
  
    socket.on("service:updated", handler);
    return () => { socket.off("service:updated", handler); };
  }, []); 
}
