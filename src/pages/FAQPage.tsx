import React, { useState } from 'react'
import { faqs } from '../models/FAQType'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen py-24 px-4 flex justify-center items-start bg-gradient-to-b from-[#F5F7EC] via-[#EEF4D8] to-[#E7EDC8]">
      <div className="w-full max-w-3xl px-4 sm:px-8 lg:px-0">
        {/* Título */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#2E321B] mb-6">
          Preguntas Frecuentes
        </h2>

        {/* Subtítulo */}
        <p className="text-xl text-[#495F1F] max-w-2xl mx-auto mb-12 text-center">
          Encuentra respuestas a las preguntas más comunes sobre nuestra organización
        </p>

        {/* Lista de FAQs */}
        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
  key={index}
  className={`rounded-2xl overflow-hidden border shadow-md transition-all duration-300 ${
    isOpen ? 'bg-[#FDF9EB] border-[#d8b769]' : 'bg-[#FAF7EC] hover:bg-[#FDF9EB] border-[#e4d8ae]'
  }`}
>
  <button
    onClick={() => toggleFAQ(index)}
    className={`w-full text-left px-6 py-5 flex justify-between items-center transition-all duration-300 ${
      isOpen
        ? 'text-[#6D8B37] font-semibold'
        : 'text-[#2E321B] hover:text-[#6D8B37]'
    }`}
  >
    <span className="text-lg font-medium">{faq.question}</span>
    <span className="text-2xl font-bold">{isOpen ? '−' : '+'}</span>
  </button>

  <div
    className={`px-6 text-base text-[#3B4D21] leading-relaxed overflow-hidden transition-all duration-300 ${
      isOpen ? 'max-h-40 py-4' : 'max-h-0 py-0'
    }`}
  >
    {faq.answer}
  </div>
</div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
