import { useEffect, useState } from "react"
import type { FAQ } from "./models/FAQType"
import { useFaqRealtime } from "./hooks/faqHook"
import { getFaqs } from "./services/faqService"
import { FAQCard } from "./components/FAQCard"

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])

  // Realtime (created / updated / deleted)
  useFaqRealtime((payload) => {
    if (payload.action === "created" && payload.data) {
      setFaqs((prev) => [payload.data!, ...prev])
      return
    }

    if (payload.action === "updated" && payload.data) {
      setFaqs((prev) =>
        prev.map((f) => (f.id === payload.data!.id ? payload.data! : f))
      )
      return
    }

    if (payload.action === "deleted") {
      const deletedId = payload.id
      if (typeof deletedId === "number") {
        setFaqs((prev) => prev.filter((f) => f.id !== deletedId))
      }
    }
  })

  // Carga inicial
  useEffect(() => {
    let isMounted = true

    const loadFaqs = async () => {
      try {
        const data = await getFaqs()
        if (isMounted) setFaqs(data)
      } catch (error) {
        console.error("Error cargando FAQs:", error)
      }
    }

    loadFaqs()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-full white-to-br from-[#F5F7EC] via-[#EEF4D8] to-[#E7EDC8]">
      <div className="mx-auto max-w-5xl px-4 py-30">
        <header className="mb-20 text-center">
          <div className="text-center space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Estamos para ayudarte</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[#2E321B] text-center mb-4">
            Preguntas frecuentes
          </h1>
          </div>
        </header>

        <div className="mx-auto max-w-3xl">
          <FAQCard faqs={faqs} />
        </div>
      </div>
    </div>
  )
}
