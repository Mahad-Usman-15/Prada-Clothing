import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqs } from "./data"
export default  function Function() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full px-2 py-2"
      defaultValue="item-1"
      
    >
        <h1 className="text-2xl font-normal ">Latest FAQs</h1>
        {
faqs.map((faq)=>(
  <AccordionItem key={faq.id} value={`value-${faq.id}`} >
        <AccordionTrigger>{faq.AccordionTrigger}</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            {faq.Accordion}
          </p>
        </AccordionContent>
      </AccordionItem>
))
    }
    </Accordion>
  )
}



