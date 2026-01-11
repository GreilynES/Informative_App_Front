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
        >
          <AccordionTrigger className="text-lg sm:text-l font-medium">
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
