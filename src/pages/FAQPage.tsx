import React, { useState } from 'react'
import { faqs } from '../models/FAQType'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-green-800 mb-24">
          Preguntas frecuentes
        </h2>

        <div className="space-y-10">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => toggleFAQ(index)}
              className="bg-white border border-green-800 rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <span className="text-2xl text-green-800">
                  {openIndex === index ? '' : '+'}
                </span>
              </div>
              {openIndex === index && (
                <p className="mt-3 text-gray-700 text-base leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
