import { ChevronRight } from "lucide-react"
import { usePrincipalEdit } from "../hooks/usePrincipal"
import { useSubastaEvent } from "../hooks/useSubastaEvent"
import { RippleButton } from "../animations/Buttons"
import { PrincipalCard } from "../components/PrincipalCard"

export default function PrincipalPage() {
  const { data: principal } = usePrincipalEdit()
  const { subastaEvent, isLoading: subastaLoading } = useSubastaEvent()

  if (!principal) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#2E321B] text-xl">
        Cargando información...
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7EC] via-[#EEF4D8] to-[#E7EDC8] flex justify-between items-center">
      <main className="max-w-7xl mx-auto my-0 px-6 sm:px-6 lg:px-16 py-0">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* IZQUIERDA */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-[#2E321B] mb-6">
              Asociación Cámara
              <br />
              de <span className="text-[#6F8C1F]">Ganaderos</span>
              <br />
              Hojancha
            </h1>

            <p className="text-xl text-[#475C1D] max-w-2xl mx-auto">
              {principal.description}
            </p>

            <div className="flex flex-row gap-8">
              <a href="#FooterPage">
                <RippleButton className="px-6 py-2 bg-gradient-to-r from-[#6F8C1F] to-[#475C1D] hover:from-[#5d741c] hover:to-[#384c17] text-white rounded-md font-medium transition-all duration-200">
                  Contáctanos
                </RippleButton>
              </a>
              <a href="#AboutUsPage">
                <RippleButton
                  variant="outline"
                  className="px-6 py-2 border border-[#CDD577] text-[#2E321B] rounded-md font-medium hover:bg-[#F5F7EC] transition-colors duration-200 bg-white flex items-center"
                >
                  Conocer más <ChevronRight className="w-4 h-4 ml-1" />
                </RippleButton>
              </a>
            </div>
          </div>

          {/* DERECHA */}
          <div className="flex justify-center items-center">
            {subastaLoading ? (
              <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
                <p>Cargando evento de subasta...</p>
              </div>
            ) : subastaEvent ? (
              <PrincipalCard event={subastaEvent} />
            ) : (
              <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
                <p>No se encontró el evento de la subasta.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
