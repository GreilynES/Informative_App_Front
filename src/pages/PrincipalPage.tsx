import { Calendar, ChevronRight} from "lucide-react"
import { events } from "../models/EventType"
import { RippleButton } from "../animations/Buttons"
import { principalType } from "../models/PrincipalType"

export default function PrincipalPage() {
  const subastaEvent = events.find((event) => event.title.toLowerCase().includes("subasta"))

  return (
    <div className="min-h-screen bg-green-50 flex justify-between items-center">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Section - Hero Content */}
          <div className="space-y-8">
            {/* Organization Badge */}
      
            {/* Main Title - With Ganaderos in green */}
           <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Asociación Cámara
              <br />
              de <span className="text-green-600">Ganaderos</span>
              <br />
              Hojancha
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {principalType.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-row gap-8">
              <a href="#FooterPage">
                <RippleButton className="px-6 py-2 bg-green-600 hover:bg-green-600 text-white rounded-md font-medium transition-all duration-200">
                Contáctanos
                </RippleButton>
              </a>
               <a href="#AboutUsPage">
                <RippleButton
                variant="outline"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-transparent transition-colors duration-200 bg-gray-50 flex items-center"
              >
               Conocer más <ChevronRight className="w-4 h-4 ml-1" />
              </RippleButton>
              </a>
            </div>
          </div>

          {/* Right Section - Tilted Event Card */}
           <div className=" flex justify-center items-center">
            {subastaEvent ? (
              <div className=" relative">
                {/* Pin Design - Thumbtack - moved to corner */}
                <div className="absolute -top-4 left-2 z-20">
                  <div className="relative">
                    {/* Pin body - cylindrical look */}
                    <div className="w-4 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full shadow-lg relative">
                      {/* Pin head - flat circular top */}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-green-300 to-green-500 rounded-full shadow-md border-2 border-green-600">
                        <div className="absolute top-1 left-1 w-2 h-2 bg-green-200 rounded-full opacity-70"></div>
                      </div>
                      {/* Pin tip */}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-400 rounded-b-full"></div>
                    </div>
                  </div>
                </div>

                {/* Single Card Container - no border */}
                <div
                  className="w-[430px] h-[360px] bg-white shadow-2xl transform rounded-lg rotate-3 hover:rotate-0 transition-transform duration-500 ease-in-out relative"
                  style={{
                    transformOrigin: "top left",
                  }}
                >
                  {/* Event photo */}
                  <div className="p-4">
                    <img
                      src={
                        subastaEvent.illustration || "/placeholder.svg?height=180&width=350&query=cattle auction event"
                      }
                      alt="Subasta de ganado"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>

                  {/* Event information at the bottom */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center space-x-2 text-green-600 text-m font-medium mb-2">
                      <Calendar className="w-6 h-6" />
                      <span>{subastaEvent.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{subastaEvent.title}</h3>
                    <p className="text-xg text-gray-600">{subastaEvent.description}</p>
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
