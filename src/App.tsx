import { Outlet } from '@tanstack/react-router'
import Navbar from './shared/components/Navbar/Navbar'
import FloatingWhatsapp from './shared/utils/FloatingWhatsapp'
import Footer from './shared/components/Footer/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <FloatingWhatsapp />
      <Footer />
    </>
  )
}
