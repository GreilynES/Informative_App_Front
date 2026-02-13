import type { FAQ } from "../models/FAQType"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQCardProps {
  faqs: FAQ[]
}

export function FAQCard({ faqs }: FAQCardProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={faq.id ?? index}
          value={(faq.id ?? `item-${index + 1}`).toString()}
          className="animate-in fade-in slide-in-from-left-5 duration-700"
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'backwards'
          }}
        >
          <AccordionTrigger className="text-lg sm:text-l font-medium text-[#2E321B]">
            {faq.question}
          </AccordionTrigger>

          <AccordionContent className="text-base sm:text-base leading-relaxed text-gray-700">
            {faq.answer}
          </AccordionContent>

        </AccordionItem>
      ))}
    </Accordion>
  )
}