import type { FAQ } from "../../models/FAQType"

interface FaqItemProps {
  faqs: FAQ
  index: number
  isOpen: boolean
  onToggle: (index: number) => void
}

export function FaqItem({ faqs, index, isOpen, onToggle }: FaqItemProps) {
  return (
    <div
      className={`rounded-2xl overflow-hidden border shadow-md transition-all duration-300 ${
        isOpen ? 'bg-[#FDF9EB] border-[#d8b769]' : 'bg-[#FAF7EC] hover:bg-[#FDF9EB] border-[#e4d8ae]'
      }`}
    >
      <button
        onClick={() => onToggle(index)}
        className={`w-full text-left px-6 py-5 flex justify-between items-center transition-all duration-300 ${
          isOpen
            ? 'text-[#5B7D1F] font-semibold'
            : 'text-[#2E321B] hover:text-[#5B7D1F]'
        }`}
      >
        <span className="text-lg font-medium">{faqs.question}</span>
        <span className="text-2xl font-bold">{isOpen ? '−' : '+'}</span>
      </button>

      <div
        className={`px-6 text-lg text-[#2D2D2D] leading-relaxed overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-40 py-4' : 'max-h-0 py-0'
        }`}
      >
        {faqs.answer}
      </div>
    </div>
  )
}
