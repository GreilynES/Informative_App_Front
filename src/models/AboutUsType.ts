export interface AboutUsSection {
  id: number
  title: string
  description: string
}

export const aboutUs: AboutUsSection[] = [ 
 {
    id: 1,
    title: "Nuestra Historia",
    description:
      "La Cámara de Ganaderos es una organización que representa los intereses del sector pecuario, promoviendo el desarrollo sostenible, la innovación y la colaboración entre productores, profesionales y comunidades rurales."
  },
  {
    id: 2,
    title: "Nuestra Misión",
    description:
      "Impulsar el bienestar animal, la productividad ganadera y el desarrollo rural mediante acciones técnicas, educativas y de representación gremial."
  },
  {
    id: 3,
    title: "Nuestra Visión",
    description:
      "Ser la entidad líder en apoyo al sector ganadero nacional, reconocida por su compromiso, innovación y contribución al desarrollo sostenible."
  }
]