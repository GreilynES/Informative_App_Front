import { MessageCircleQuestionIcon} from "lucide-react"
import { events } from "../models/EventType"
import { RippleButton } from "../animations/Buttons"
import { principalType } from "../models/PrincipalType"

export default function PrincipalPage() {
  const subastaEvent = events.find((event) => event.title.toLowerCase().includes("subasta"))

    const whatsappNumber = "50685011152" 
    const newWhatsappMessage = "¡Hola! Me gustaría obtener más información sobre la Asociación Cámara de Ganaderos Hojancha."
    const encodedWhatsappMessage = encodeURIComponent(newWhatsappMessage)
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedWhatsappMessage}`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-7xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row items-center lg:items-stretch">
        {/* Left Section - Hero Content */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center text-center lg:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            {principalType.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
            {principalType.description}
          </p>
          <RippleButton className="mt-6 px-8 py-3 text-lg self-center lg:self-start bg-black text-white rounded-xl shadow-lg hover:bg-gray-800 transition-colors duration-200">
            <a href="#Footer">Contactanos</a>
          </RippleButton>
        </div>

        {/* Right Section - Event Card */}
        <div className="flex-1 flex justify-center items-center p-8 md:p-12 lg:p-16 bg-gray-100">
          {subastaEvent ? (
            <div className="w-full max-w-md shadow-xl rounded-lg overflow-hidden border border-gray-200 bg-white">
              <div className="p-0">
                <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
                   <img
                        src={subastaEvent.illustration || "/placeholder.svg"}
                        alt={subastaEvent.title}
                        width={384} // Ancho de la imagen
                        height={256} // Alto de la imagen
                        className="object-cover w-full h-full"
                      />
                </div>
              </div>
              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{subastaEvent.title}</h2>
                <p className="text-lg font-medium text-gray-600 mb-3">{subastaEvent.date}</p>
                <p className="text-base text-gray-700 leading-relaxed">{subastaEvent.description}</p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md shadow-lg rounded-lg bg-white border border-gray-200">
              <div className="p-6 text-center text-gray-500">
                <p>No se encontró el evento de la subasta.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating "Como puedo ayudarte?" bubble */}
      <div className="fixed bottom-6 right-6 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-full shadow-md flex items-center space-x-2 text-sm cursor-pointer hover:bg-green-200 transition-colors duration-200">
               <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-full shadow-md flex items-center space-x-2 text-sm cursor-pointer hover:bg-green-200 transition-colors duration-200"
              >
              <MessageCircleQuestionIcon className="w-4 h-4" />
              <span>¿Como puedo ayudarte?</span>
              </a>
      </div> 
    </div>
  )
}
