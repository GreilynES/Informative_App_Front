import { Calendar, ChevronRight } from "lucide-react"
import { events } from "../models/EventType"
import { RippleButton } from "../animations/Buttons"
import { principalType } from "../models/PrincipalType"

export default function PrincipalPage() {
  const subastaEvent = events.find((event) =>
    event.title.toLowerCase().includes("subasta")
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7EC] via-[#EEF4D8] to-[#E7EDC8] flex justify-between items-center">
      <main className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-16 py-12">
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
              {principalType.description}
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
                  Conocer más
                  <ChevronRight className="w-4 h-4 ml-1" />
                </RippleButton>
              </a>
            </div>
          </div>

          {/* DERECHA */}
          <div className="flex justify-center items-center">
            {subastaEvent ? (
              <div className="relative">
                {/* Pin */}
                <div className="absolute -top-4 left-2 z-30">
                  <div className="relative">
                    <div className="w-4 h-8 bg-gradient-to-br from-[#475C1D] to-[#6F8C1F] rounded-full shadow-lg relative">
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-[#475C1D] to-[#6F8C1F] rounded-full shadow-md border border-[#6F8C1F]">
                        <div className="absolute top-1 left-1 w-2 h-2 bg-[#F5F7EC] rounded-full opacity-70"></div>
                      </div>
                      <div className="absolute z-0 -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-[#99997f] rounded-b-full"></div>
                    </div>
                  </div>
                </div>

                {/* Card */}
                <div
                  className="w-[430px] h-[360px] bg-white shadow-2xl transform rounded-lg rotate-3 hover:rotate-0 transition-transform duration-500 ease-in-out relative"
                  style={{ transformOrigin: "top left" }}
                >
                  <div className="p-4">
                    <img
                      src={
                        subastaEvent.illustration ||
                        "/placeholder.svg?height=180&width=350&query=cattle auction event"
                      }
                      alt="Subasta de ganado"
                      className="w-full h-60 object-cover rounded-lg"
                    />
                  </div>

                  <div className="px-4 pb-4">
                    <div className="flex items-center space-x-2 text-[#6F8C1F] text-base font-medium mb-2">
                      <Calendar className="w-5 h-5" />
                      <span>{subastaEvent.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#2E321B] mb-1">
                      {subastaEvent.title}
                    </h3>
                    <p className="text-xs text-[#475C1D]">{subastaEvent.description}</p>
                  </div>
                </div>
              </div>
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
