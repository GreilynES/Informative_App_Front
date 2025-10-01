import { useEffect, useState, useCallback } from "react";
import type { InfoPageVM } from "../../associatesInformation/models/AssociatesVolunteersInfoType";
import { fetchVolunteersPage } from "../services/volunteersPageServices";

export function useVolunteersPage() {
  const [data, setData] = useState<InfoPageVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchVolunteersPage();
      setData(res);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando la página de Voluntarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
