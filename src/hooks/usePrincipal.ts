import { useEffect, useState } from 'react';
import { getPrincipalData } from '../services/principalService';
import type { PrincipalType } from '../models/PrincipalType';


export function usePrincipal() {
  const [data, setData] = useState<PrincipalType | null>(null);

  useEffect(() => {
    getPrincipalData().then(res => {
      if (res.length > 0) setData(res[0]); // si devuelve array
    });
  }, []);

  return { data };
}
