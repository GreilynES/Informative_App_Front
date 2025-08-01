import type { ReactNode } from "react"

export type PrincipalType = {
  date: ReactNode
  illustration: string
  title: string
  description: string
}

export const principalType: PrincipalType = {
  title: "Asociación Cámara de Ganaderos Hojancha",
  description: "Lorem ipsum dolor sit amet consectetur adipiscing elit tellus mauris, risus quis torquent integer erat eget fermentum tortor. Inceptos pellentesque scelerisque pulvinar curae.",
  date: undefined,
  illustration: ""
}