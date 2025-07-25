import React, { useState } from 'react'
import { faqs } from '../models/FAQType'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white py-24 px-4 flex justify-center items-start">
      <div className="w-full max-w-3xl px-4 sm:px-8 lg:px-0">
        {/* Título */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6">
          Preguntas Frecuentes
        </h2>

        {/* Subtítulo */}
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 text-center">
          Encuentra respuestas a las preguntas más comunes sobre nuestra organización
        </p>

        {/* Lista de FAQs */}
        <div className="space-y-6 divide-y divide-neutral-200">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`border border-neutral-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${
                  isOpen ? 'bg-green-50' : 'bg-white hover:bg-green-50'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full text-left px-6 py-5 transition-all duration-300 flex justify-between items-center ${
                    isOpen
                      ? 'text-green-600 font-semibold'
                      : 'text-gray-900 hover:text-green-600'
                  }`}
                >
                  <span className="text-base font-semibold">{faq.question}</span>
                  <span className="text-xl font-bold">{isOpen ? '−' : '+'}</span>
                </button>

                <div
                  className={`px-6 text-base text-gray-600 leading-relaxed overflow-hidden transition-all duration-300 ${
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
