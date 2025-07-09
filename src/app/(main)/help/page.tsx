import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const faqs = [
  {
    question: "How do I add a new transaction?",
    answer: "Navigate to the 'Transactions' page. Click the 'Add Transaction' button in the top right corner. Fill out the form in the dialog box and click 'Save Transaction'.",
  },
  {
    question: "Can I connect my bank account?",
    answer: "Direct bank account integration via services like Plaid is a planned feature and will be available in a future update. For now, you can add transactions manually.",
  },
  {
    question: "How does the AI budgeting work?",
    answer: "The AI budgeting tool analyzes your provided income, expenses, and savings goals. It then generates a personalized budget with suggested spending limits for different categories to help you reach your goals.",
  },
  {
    question: "Is my financial data secure?",
    answer: "Yes, we take data security very seriously. All your data is encrypted and stored securely. We do not share your personal financial information with third parties.",
  },
  {
    question: "How can I upgrade my plan?",
    answer: "You can upgrade your plan by visiting the 'Pricing' page. Select the plan you wish to upgrade to and follow the on-screen instructions. Payment processing will be implemented soon.",
  },
    {
    question: "Where can I report a bug or suggest a feature?",
    answer: "We'd love to hear from you! Please visit the 'Feedback' page to submit bug reports, suggest new features, or provide general feedback on your experience.",
  },
]

export default function HelpPage() {
  return (
    <div className="flex justify-center items-start py-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Frequently Asked Questions</CardTitle>
          <CardDescription>
            Find answers to common questions about FiscalFlow AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
