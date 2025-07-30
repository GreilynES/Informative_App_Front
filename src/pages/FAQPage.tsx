import { FaqItem } from "../components/Faq/FAQCard"
import { useFaqToggle } from "../hooks/faqHook"
import { getFaqs } from "../services/faqService"

export default function FAQPage() {
  const faqs = getFaqs()
  const { openIndex, toggleFAQ } = useFaqToggle()

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
          {faqs.map((faqs, index) => (
            <FaqItem
              key={index}
              faqs={faqs}
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
