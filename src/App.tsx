import { Outlet } from '@tanstack/react-router'
import Navbar from './pages/Navbar'
import Footer from './pages/Footer'
import FloatingWhatsapp from './components/FloatingWhatsapp'

export default function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <FloatingWhatsapp />
    </>
  )
}
