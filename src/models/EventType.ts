export interface Event {
  id: number
  title: string
  date: string
  description: string
  illustration: string
}

//Esto se debe hacer en otra parte pero por ahora lo dejamos aquí
export const events: Event[] = [
{
    id: 1,
    title: "Próxima Subasta de Ganado",
    date: "20-22 Febrero, 2024",
    description: "Subasta de ganado bovino. Ventas directas de alta calidad.",
    illustration: "https://res.cloudinary.com/dqaseydi6/image/upload/v1754000082/20250731_1611_Vacas_en_Pastizal_remix_01k1h8g76fe17tf7ejrj4f9f3x_nel9yb.png",
  },
  {
    id: 2,
    title: "Conferencia Anual de Innovación",
    date: "19-21 Marzo, 2024",
    description: "Mantente al día con nuestros eventos y actividades programadas.",
    illustration: "https://res.cloudinary.com/dqaseydi6/image/upload/v1752781748/IMG-20250717-WA0078_1_pxinsi.jpg",
  },
  {
    id: 3,
    title: "Taller de Mejoramiento Genético",
    date: "15-17 Abril, 2024",
    description: "Aprende las mejores técnicas de mejoramiento genético bovino.",
    illustration: "https://res.cloudinary.com/dqaseydi6/image/upload/v1752781748/IMG-20250717-WA0078_1_pxinsi.jpg",
  },
]