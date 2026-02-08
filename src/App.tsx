import { Outlet } from "@tanstack/react-router"
import Navbar from "./shared/components/Navbar/Navbar"
import FloatingWhatsapp from "./shared/utils/FloatingWhatsapp"
import Footer from "./shared/components/Footer/Footer"

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col overflow-x-clip">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <FloatingWhatsapp />
      <Footer />
    </div>
  )
}
