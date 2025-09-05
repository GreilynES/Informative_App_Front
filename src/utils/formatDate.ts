// utils/formatDate.ts
function isValidDate(d: Date) {
    return d instanceof Date && !Number.isNaN(d.getTime());
  }
  
  /** Intenta parsear distintos formatos comunes */
  export function parseToDate(value: unknown): Date | null {
    if (!value) return null;
  
    // Ya es Date
    if (value instanceof Date) return isValidDate(value) ? value : null;
  
    // Timestamp numérico (ms o s)
    if (typeof value === "number") {
      const ms = value > 1e12 ? value : value * 1000; // heurística
      const d = new Date(ms);
      return isValidDate(d) ? d : null;
    }
  
    // Cadena
    if (typeof value === "string") {
      const s = value.trim();
      if (!s) return null;
  
      // dd/mm/yyyy
      const ddmmyyyy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const m1 = s.match(ddmmyyyy);
      if (m1) {
        const day = Number(m1[1]);
        const month = Number(m1[2]);
        const year = Number(m1[3]);
        const d = new Date(year, month - 1, day);
        return isValidDate(d) ? d : null;
      }
  
      // ISO o yyyy-mm-dd (con o sin tiempo)
      // Ej: 2025-05-15, 2025-05-15T00:00:00Z
      const isoLike = /^\d{4}-\d{2}-\d{2}/.test(s);
      if (isoLike) {
        const d = new Date(s);
        return isValidDate(d) ? d : null;
      }
    }
  
    return null;
  }
  
  /** Capitaliza la primera letra (miércoles -> Miércoles) */
  function capitalizeFirst(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }
  
  /**
   * Formatea la fecha a: "Miércoles 15 de mayo de 2025" (estándar)
   * o "Miércoles 15 de mayo, 2025" si pasas { commaBeforeYear: true }
   */
  export function formatDateToWords(
    value: unknown,
    opts?: { locale?: string; capitalize?: boolean; commaBeforeYear?: boolean }
  ): string {
    const locale = opts?.locale ?? "es-CR";
    const capitalize = opts?.capitalize ?? true;
    const commaBeforeYear = opts?.commaBeforeYear ?? false;
  
    const d = parseToDate(value);
    if (!d) return "Fecha inválida";
  
    // Partimos en piezas para poder controlar el “de” o la coma antes del año
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(d);
    const day = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(d);
    const month = new Intl.DateTimeFormat(locale, { month: "long" }).format(d);
    const year = new Intl.DateTimeFormat(locale, { year: "numeric" }).format(d);
  
    const base = commaBeforeYear
      ? `${weekday} ${day} de ${month}, ${year}`   // "miércoles 15 de mayo, 2025"
      : `${weekday} ${day} de ${month} de ${year}`; // "miércoles 15 de mayo de 2025"
  
    return capitalize ? capitalizeFirst(base) : base;
  }
  