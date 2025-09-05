// src/pages/FAQPage.tsx
import { useEffect, useState } from "react"
import { FaqItem } from "../components/Faq/FAQCard"
import { useFaqToggle } from "../hooks/faqHook"
import { getFaqs } from "../services/faqService"
import type { FAQ } from "../models/FAQType"
import { useFaqRealtime } from "../hooks/faqHook"
  

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const { openIndex, toggleFAQ } = useFaqToggle()

  useFaqRealtime((payload) => {
    if (payload.action === 'created' && payload.data) {
      setFaqs((prev) => [payload.data!, ...prev]);
    }
    if (payload.action === 'updated' && payload.data) {
      setFaqs((prev) => prev.map(f => f.id === payload.data!.id ? payload.data! : f));
    }
    if (payload.action === 'deleted' && payload.id) {
      setFaqs((prev) => prev.filter(f => f.id !== payload.id));
    }
  });

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const data = await getFaqs()
        setFaqs(data)
      } catch (error) {
        console.error("Error al cargar FAQs:", error)
      }
    }

    fetchFaqs()
  }, [])

  return (
    <div className="min-h-screen py-24 px-4 flex justify-center items-start bg-gradient-to-b from-[#F5F7EC] via-[#DCECB8] to-[#9BAF6A]">
      <div className="w-full max-w-3xl px-4 sm:px-8 lg:px-0">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#2E321B] mb-6">
          Preguntas Frecuentes
        </h2>

        <p className="text-xl text-[#495F1F] max-w-2xl mx-auto mb-12 text-center">
          Encuentra respuestas a las preguntas más comunes sobre nuestra organización
        </p>

        <div className="mb-12 space-y-6">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              faqs={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={toggleFAQ}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
