export type FooterType = {
  contact: {
    phone: string
    email: string
    facebook: {
      name: string
      url: string
    }
  }
  links: {
    name: string
    href: string
  }[]
  schedule: {
    title: string
    location: string
    days: string
    hours?: string
  }
}

export const footerConfig: FooterType = {
  contact: {
    phone: "83770589",
    email: "camaradeganaderos@gmail.com",
    facebook: {
      name: "Cámara de Ganaderos de Hojancha",
      url: "https://www.facebook.com/share/16xnNwXgPK",
    },
  },
  links: [
    { name: "Sobre Nosotros", href: "#AboutUsPage" },
    { name: "Eventos", href: "#EventsPage" },
    { name: "Servicios", href: "#ServicesPage" },
    { name: "Formularios", href: "#FormsPage" },
  ],
  schedule: {
    title: "Administrativo",
    location: "Hojancha: Lunes a Sábado",
    days: "7:00 am - 5:00 pm",
  },
}
