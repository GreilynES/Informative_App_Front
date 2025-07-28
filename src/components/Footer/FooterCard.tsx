import { Phone, Mail, Facebook, Clock4 } from "lucide-react"

type FooterContact = {
  phone: string
  email: string
  facebook: {
    name: string
    url: string
  }
}

type FooterLink = {
  name: string
  href: string
}

type FooterSchedule = {
  title: string
  location: string
  days: string
  hours?: string
}

export const contact: FooterContact = {
  phone: "83770589",
  email: "camaradeganaderos@gmail.com",
  facebook: {
    name: "Cámara de Ganaderos de Hojancha",
    url: "https://www.facebook.com/Cámara Ganaderos Hojancha",
  },
}

export const quickLinks: FooterLink[] = [
  { name: "Sobre Nosotros", href: "#AboutUsPage" },
  { name: "Eventos", href: "#EventsPage" },
  { name: "Servicios", href: "#ServicesPage" },
  { name: "Formularios", href: "#FormsPage" },
]

export const schedule: FooterSchedule = {
  title: "Administrativo",
  location: "Hojancha: Lunes a Sábado",
  days: "7:00 am - 5:00 pm",
}

export const footerIcons = {
  phone: Phone,
  mail: Mail,
  facebook: Facebook,
  clock: Clock4,
}
