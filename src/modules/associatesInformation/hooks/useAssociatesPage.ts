import { useEffect, useState, useCallback } from "react";
import { fetchAssociatesPage } from "../services/associatesPageService";
import type { InfoPageVM } from "../models/AssociatesVolunteersInfoType";

export function useAssociatesPage() {
  const [data, setData] = useState<InfoPageVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAssociatesPage();
      setData(res);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando la página de Asociados");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
