import { useEffect, useState } from "react"
import type { FAQ } from "./models/FAQType"
import { useFaqRealtime } from "./hooks/faqHook"
import { getFaqs } from "./services/faqService"
import { FAQCard } from "./components/FAQCard"
import { ScrollReveal } from "@/shared/animations/Scroll"

import { PageState } from "@/shared/ui/PageState"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

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
        setIsLoading(true)
        setError(null)
        const data = await getFaqs()
        if (isMounted) setFaqs(data)
      } catch (err) {
        console.error("Error cargando FAQs:", err)
        if (isMounted) setError(err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadFaqs()

    return () => {
      isMounted = false
    }
  }, [])

  const isEmpty = !isLoading && !error && faqs.length === 0

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto max-w-5xl px-4 py-30">
        <header className="mb-20 text-center">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Estamos para ayudarte
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-[#2E321B] text-center mb-4">
              Preguntas frecuentes
            </h1>
          </div>
        </header>

        <PageState
          isLoading={isLoading}
          isEmpty={isEmpty}
          withContainer={false}
          emptyTitle="No hay preguntas frecuentes todavía"
          emptyDescription="Cuando publiquemos información, aparecerá aquí."
          skeleton={
            <div className="mx-auto max-w-3xl space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-5">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-11/12" />
                </Card>
              ))}
            </div>
          }
        >
          {error ? (
            <div className="mx-auto max-w-3xl">
              <Card className="p-6 sm:p-8">
                <p className="text-base font-medium text-[#2E321B]">
                  No pudimos cargar las preguntas frecuentes
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Intenta nuevamente en unos minutos.
                </p>
              </Card>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-4">
              {faqs.map((faq, index) => (
                <ScrollReveal 
                  key={faq.id ?? index}
                  duration={700} 
                  distance={40}
                  delay={index * 50}
                >
                  <div>
                    <FAQCard faqs={[faq]} />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </PageState>
      </div>
    </div>
  )
}