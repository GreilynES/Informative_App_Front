import { useEffect, useMemo, useState } from "react"
import { CheckCircle, FileText, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { btn } from "@/shared/ui/buttonStyles"

interface RequirementsSectionProps {
  requirements: string[]
  showForm: boolean
  setShowForm: (show: boolean) => void
}

export function RequirementsSection({ requirements, showForm, setShowForm }: RequirementsSectionProps) {
  const [showModal, setShowModal] = useState(false)

  // Docs fijos para asociados (los del modal viejo)
  const docs = useMemo(
    () => [
      "Fotocopia de la cédula",
      "Copia del acta de finca o contrato de arriendo de finca",
    ],
    []
  )

  const openModal = () => setShowModal(true)

  const continueToForm = () => {
    setShowModal(false)
    setShowForm(true)

    // Scroll suave al form (después de render)
    setTimeout(() => {
      const el = document.getElementById("associate-form")
      el?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  useEffect(() => {
    return () => setShowModal(false)
  }, [])

  return (
    <div className="bg-white/80 rounded-xl p-6 sm:p-8 shadow-md border border-[#DCD6C9] max-w-6xl mx-auto mb-10 sm:mb-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#708C3E] text-center mb-6 sm:mb-8">
        Requisitos
      </h2>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {requirements.map((req, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#708C3E] mt-0.5 flex-shrink-0" />
            <p className="text-sm sm:text-base text-gray-700">{req}</p>
          </div>
        ))}
      </div>

      {!showForm && (
        <div className="mt-8 sm:mt-10">
          {/* ✅ Botón full responsive */}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={openModal}
              className={`${btn.primary} ${btn.disabledSoft} w-full sm:w-auto h-12 sm:h-14 px-36 rounded-lg text-sm sm:text-base`}
            >
              Desplegar formulario
            </Button>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-gray-500 text-center">
            Te mostraremos un aviso con los documentos requeridos antes de continuar.
          </p>
        </div>
      )}

      {/* ✅ Modal (Dialog shadcn) */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent
          className="
            w-[calc(100%-24px)] sm:max-w-xl
            p-0 overflow-hidden
            border border-[#DCD6C9]
            rounded-2xl
          "
        >
          {/* Header fijo */}
          <div className="p-5 sm:p-6 border-b border-[#DCD6C9] bg-white">
            <DialogHeader>
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#708C3E] rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>

                <div className="min-w-0">
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-[#708C3E]">
                    Documentos requeridos
                  </DialogTitle>

                  <DialogDescription className="text-sm sm:text-base text-gray-600 mt-1">
                    Antes de continuar, asegurate de tener disponibles los siguientes documentos.
                  </DialogDescription>

                  <div className="mt-2">
                    <Badge className="bg-[#E6EDC8] text-[#4A4A4A] border border-[#DCD6C9] hover:bg-[#E6EDC8]">
                      Asociados
                    </Badge>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Body scrolleable */}
          <ScrollArea className="max-h-[60vh]">
            <div className="p-5 sm:p-6 bg-white space-y-4">
              <div className="bg-[#F5F7EC] p-4 rounded-xl border border-[#DCD6C9]">
                <ul className="space-y-3">
                  {docs.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-sm sm:text-base text-gray-700">
                        <strong className="font-semibold">{d}</strong>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Comisión */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-amber-800">Comisión de asociado</p>
                    <p className="text-amber-700 text-sm sm:text-base mt-1">
                      Si tu solicitud es aceptada, deberás pagar una comisión única de{" "}
                      <strong>₡5,000 colones</strong> para completar tu registro como asociado.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-500">
                Si no tenés alguno, podés volver y reunirlos antes de completar la solicitud.
              </p>
            </div>
          </ScrollArea>

          {/* Footer fijo */}
          <div className="p-5 sm:p-6 border-t border-[#DCD6C9] bg-white">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
                className={`${btn.outlineGray} ${btn.disabledSoft} w-full sm:w-auto`}
              >
                Volver
              </Button>

              <Button
                type="button"
                onClick={continueToForm}
                className={`${btn.primary} ${btn.disabledSoft} w-full sm:w-auto`}
              >
                Entendido, continuar con el formulario
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
