import { useEffect, useState } from "react";
import type { AboutUsSection } from "../models/AboutUsType";
import { socket} from "../../../shared/lib/socket";
import { getAboutUs } from "../services/aboutUsService";

type AboutUsPayload = {
  action: "created" | "updated" | "deleted";
  data?: AboutUsSection;
  id?: number | string;
};

export const useAboutUs = () => {
  const [data, setData] = useState<AboutUsSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch inicial
  useEffect(() => {
    const fetchData = async () => {
      const result = await getAboutUs();
      setData(result);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Realtime (WS público)
  useEffect(() => {
    const handler = (payload: AboutUsPayload) => {
      if (payload.action === "created" && payload.data) {
        setData((prev) => [payload.data!, ...prev]);
      }
      if (payload.action === "updated" && payload.data) {
        setData((prev) =>
          prev.map((item) =>
            item.id === payload.data!.id ? payload.data! : item
          )
        );
      }
      if (payload.action === "deleted" && payload.id != null) {
        const idNum = Number(payload.id);
        setData((prev) => prev.filter((item) => item.id !== idNum));
      }
    };

    socket.on("aboutUs:updated", handler);
    return () => {
      socket.off("aboutUs:updated", handler);
    };
  }, []);

  return { data, isLoading };
};
