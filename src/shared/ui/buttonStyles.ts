
export const brand = {
  green: {
    base: "#708C3E",
    hover: "#5d7334",
    softBg: "#E6EDC8",
    border: "#708C3E",
  },
  gray: {
    1: "#6B6B6B",
    2: "#4F4F4F",
    bg: "#ECECEC",
  },
  red: {
    base: "#B85C4C",
    hover: "#8C3A33",
    softBg: "#E6C3B4",
    border: "#E6C3B4",
  },
}

export const btn = {
  // “Primary” de tu app (verde)
  primary:
    "bg-[#708C3E] text-white hover:bg-[#5d7334] shadow-sm",

  // Outline verde (volver/prev)
  outlineGreen:
    "border-[#708C3E] text-[#708C3E] hover:bg-[#E6EDC8] hover:text-[#708C3E] shadow-none",

  // Outline rojo suave (cancelar / volver crítico)
  outlineRed:
    "border-[#E6C3B4] text-[#8C3A33] hover:bg-[#E6C3B4]/40 hover:text-[#8C3A33] shadow-none",

  // Botón “neutral” gris (secundario)
  outlineGray:
    "border-[#DCD6C9] text-[#4F4F4F] hover:bg-[#ECECEC] shadow-none",

  // Estado disabled consistente (cuando querés forzarlo)
  disabledSoft:
    "disabled:bg-[#ECECEC] disabled:text-[#6B6B6B] disabled:hover:bg-[#ECECEC]",
}
