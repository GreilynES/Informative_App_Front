import { MessageCircleQuestion } from "lucide-react"
import { events } from "../models/EventType"

export default function PrincipalPage() {
    const subastaEvent = events.find((event) => event.title === "Próxima Subasta de Ganado")

    const whatsappNumber = "50685011152" 
    const newWhatsappMessage = "¡Hola! Me gustaría obtener más información sobre la Asociación Cámara de Ganaderos Hojancha."
    const encodedWhatsappMessage = encodeURIComponent(newWhatsappMessage)
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedWhatsappMessage}`

  return (
    <div>
      <div className="min-h-screen bg-white-600 flex items-up justify-center ">
          <div className="max-w-7xl w-full bg-white  p-0 md:p-10 relative flex flex-col lg:flex-row gap-20 items-center">
            {/* Left Section */}
            <div className="flex-1 space-y-8 lg:text-left">
              <h1 className="text-5xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Asociación Cámara de Ganaderos Hojancha
              </h1>
              <p className=" md:text-2xl text-lg text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Lorem ipsum dolor sit amet consectetur adipiscing elit tellus mauris, risus quis torquent integer erat eget
                fermentum tortor. Inceptos pellentesque scelerisque pulvinar curae.
              </p>
              <button className="mt-6 px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition-colors duration-200">
                Sobre Nosotros
              </button>
            </div>

            {/* Right Section - Event Card */}
            <div className="flex-1 flex justify-center lg:justify-end items-center">
              <div className="w-full max-w-0,2xl bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-2xl">
                {subastaEvent ? (
                  <div className="p-4">
                    <div className="flex justify-center items-center bg-gray-200 rounded-lg overflow-hidden h-64 mb-4">
                      <img
                        src={subastaEvent.illustration || "/placeholder.svg"}
                        alt={subastaEvent.title}
                        width={384} // Ancho de la imagen
                        height={256} // Alto de la imagen
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h3 className="text-center text-xl font-bold text-gray-900 mb-2">{subastaEvent.title}</h3>
                    <p className="text-center text-gray-600 text-lg font-medium">{subastaEvent.date}</p>
                    <p className="text-center text-gray-500 text-sm mt-2">{subastaEvent.description}</p>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <p>No se encontró el evento de la subasta.</p>
                  </div>
                )}
              </div>
            </div>

          
          </div> 
          {/* Floating "Como puedo ayudarte?" bubble*/}
            <div className="fixed bottom-6 right-6 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-full shadow-md flex items-center space-x-2 text-sm cursor-pointer hover:bg-green-200 transition-colors duration-200">
               <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-full shadow-md flex items-center space-x-2 text-sm cursor-pointer hover:bg-green-200 transition-colors duration-200"
              >
              <MessageCircleQuestion className="w-4 h-4" />
              <span>¿Como puedo ayudarte?</span>
              </a>
            </div> 
        </div>
      </div>
  )
}
