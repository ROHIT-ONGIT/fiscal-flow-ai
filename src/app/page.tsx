
"use client"

import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, PiggyBank, Scale, TrendingUp, Check, Send, Mail, Phone, MessageSquare, Clock } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import * as React from "react"

const features = [
    {
        icon: <PiggyBank className="h-8 w-8 text-primary" />,
        title: 'AI Budgeting',
        description: 'Create a personalized budget based on your income, expenses, and goals.',
    },
    {
        icon: <TrendingUp className="h-8 w-8 text-primary" />,
        title: 'Cash Flow Forecasting',
        description: 'Forecast your future cash flow and get actionable insights.',
    },
    {
        icon: <Briefcase className="h-8 w-8 text-primary" />,
        title: 'Investment Analysis',
        description: 'Get AI-powered analysis of your investment portfolio.',
    },
    {
        icon: <Scale className="h-8 w-8 text-primary" />,
        title: 'Debt Calculator',
        description: 'Analyze your debt and get a customized payoff plan.',
    }
]

const supportChannels = [
    {
        icon: <Mail className="w-8 h-8 text-primary" />,
        title: "Email Support",
        description: "Get detailed assistance via email",
        contact: "support@fiscalflow.ai",
        response: "Response within 24 hours",
    },
    {
        icon: <Phone className="w-8 h-8 text-primary" />,
        title: "Phone Support",
        description: "Direct line for urgent queries",
        contact: "+1 (800) 123-4567",
        response: "Available 9 AM - 6 PM EST",
    },
    {
        icon: <MessageSquare className="w-8 h-8 text-primary" />,
        title: "Live Chat",
        description: "Instant help from our experts",
        contact: "Available on website",
        response: "Typical response in 5 mins",
    },
    {
        icon: <Clock className="w-8 h-8 text-primary" />,
        title: "24/7 Help Center",
        description: "Browse our knowledge base",
        contact: "help.fiscalflow.ai",
        response: "Updated regularly",
    },
]

const pricingPlans = [
  {
    name: "Basic",
    price: "$0",
    interval: "/month",
    features: [
      "Unified Financial Dashboard",
      "Smart Transaction Categorization",
      "Basic AI Budgeting",
      "Email Support",
    ],
    isPopular: false,
    buttonText: "Get Started",
    buttonVariant: "outline" as "outline" | "default",
  },
  {
    name: "Pro",
    price: "$15",
    interval: "/month",
    features: [
      "Everything in Basic",
      "Advanced AI Budgeting & Insights",
      "Cash Flow Forecasting",
      "Automated Bill Reminders",
      "Priority Email Support",
    ],
    isPopular: true,
    buttonText: "Upgrade to Pro",
    buttonVariant: "default" as "outline" | "default",
  },
  {
    name: "Premium",
    price: "$29",
    interval: "/month",
    features: [
      "Everything in Pro",
      "Investment Portfolio Aggregation & Analysis",
      "Debt Payoff Analysis & Planning",
      "24/7 Priority Support",
      "Custom Visual Reporting",
    ],
    isPopular: false,
    buttonText: "Go Premium",
    buttonVariant: "default" as "outline" | "default",
  },
]

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
    question: "Where can I report a bug or suggest a feature?",
    answer: "We'd love to hear from you! Please scroll down to the 'Feedback' section on this page to submit bug reports, suggest new features, or provide general feedback on your experience.",
  },
]


export default function LandingPage() {
  const { toast } = useToast()

  const [feedbackName, setFeedbackName] = React.useState('');
  const [feedbackEmail, setFeedbackEmail] = React.useState('');
  const [feedbackType, setFeedbackType] = React.useState('bug');
  const [feedbackMessage, setFeedbackMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);


  const handleUpgradeClick = (planName: string) => {
    toast({
      title: "Feature Coming Soon!",
      description: `Thank you for your interest in the ${planName} plan. Payment integration is currently in development.`,
    })
  }

  const handleFeedbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!feedbackMessage) {
        toast({
            variant: "destructive",
            title: "Message Required",
            description: "Please enter a message before submitting."
        })
        return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
        console.log({
            name: feedbackName,
            email: feedbackEmail,
            type: feedbackType,
            message: feedbackMessage
        });
        toast({
          title: "Feedback Submitted!",
          description: "Thank you for helping us improve FiscalFlow AI.",
        })
        setFeedbackName('');
        setFeedbackEmail('');
        setFeedbackType('bug');
        setFeedbackMessage('');
        setIsSubmitting(false);
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-headline">FiscalFlow AI</span>
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              <Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</Link>
              <Link href="#support" className="text-muted-foreground transition-colors hover:text-foreground">Support</Link>
              <Link href="#pricing" className="text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
              <Link href="#feedback" className="text-muted-foreground transition-colors hover:text-foreground">Feedback</Link>
              <Link href="#faq" className="text-muted-foreground transition-colors hover:text-foreground">FAQ</Link>
            </nav>
            <Button asChild>
              <Link href="/dashboard">
                Enter App <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="relative w-full pt-24 pb-12 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-primary/10 rounded-full blur-3xl -z-10" />

          <div className="container relative z-10 flex flex-col items-center justify-center gap-6 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl font-headline">
              Your Personal Financial <span className="text-primary">Super-brain</span>
            </h1>
            <p className="max-w-3xl text-lg text-muted-foreground md:text-xl">
              Harness the power of AI to manage your budget, track expenses, analyze investments, and achieve your financial goals effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Get Started For Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">All-In-One Financial Toolkit</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                From budgeting to investing, get a complete and intelligent overview of your financial life.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 gap-8 pt-12 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col items-start p-6 text-left bg-card rounded-xl border border-border/10 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="p-3 rounded-md bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-bold font-headline">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Getting Started is Easy</h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Three simple steps to take control of your finances.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 text-2xl font-bold rounded-full bg-primary text-primary-foreground">1</div>
                <h3 className="text-xl font-bold font-headline">Connect Your Accounts</h3>
                <p className="mt-2 text-muted-foreground">Securely link your financial accounts for a complete picture. (Feature coming soon!)</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 text-2xl font-bold rounded-full bg-primary text-primary-foreground">2</div>
                <h3 className="text-xl font-bold font-headline">Set Your Goals</h3>
                <p className="mt-2 text-muted-foreground">Tell our AI what you want to achieve, from saving for a vacation to planning for retirement.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 text-2xl font-bold rounded-full bg-primary text-primary-foreground">3</div>
                <h3 className="text-xl font-bold font-headline">Receive Insights</h3>
                <p className="mt-2 text-muted-foreground">Get personalized recommendations, budget plans, and forecasts to help you succeed.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="support" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">Support</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">We're Here to Help 👋</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Get assistance anytime, anywhere. Our dedicated support team is ready to help you.
                </p>
            </div>
            <div className="grid w-full grid-cols-1 gap-8 pt-12 sm:grid-cols-2 lg:grid-cols-4">
              {supportChannels.map((channel) => (
                <Card key={channel.title} className="text-left shadow-sm hover:shadow-lg transition-shadow">
                    <CardHeader className="items-start">
                         <div className="p-3 rounded-md bg-primary/10 -mt-8 -ml-2">
                           {channel.icon}
                         </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <h3 className="text-lg font-bold font-headline">{channel.title}</h3>
                        <p className="text-muted-foreground text-sm">{channel.description}</p>
                        <p className="text-primary font-semibold text-sm pt-2">{channel.contact}</p>
                        <p className="text-muted-foreground text-xs">{channel.response}</p>
                    </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
            <div className="container flex flex-col items-center gap-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                    Simple, Transparent Pricing
                    </h2>
                    <p className="max-w-xl mx-auto mt-4 text-lg text-muted-foreground">
                    Choose the perfect plan for your financial journey. No hidden fees, no surprises.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3 lg:items-start w-full max-w-5xl">
                    {pricingPlans.map((plan) => (
                    <Card key={plan.name} className={cn("relative flex flex-col h-full bg-background", plan.isPopular && "border-2 border-primary shadow-lg")}>
                        {plan.isPopular && (
                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                            <div className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-primary text-primary-foreground">
                            Most Popular
                            </div>
                        </div>
                        )}
                        <CardHeader className="items-center text-center">
                        <CardTitle className="text-2xl font-headline">{plan.name}</CardTitle>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold">{plan.price}</span>
                            <span className="text-muted-foreground">{plan.interval}</span>
                        </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                        <ul className="space-y-3">
                            {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <Check className="w-5 h-5 mr-3 text-green-500 shrink-0" />
                                <span>{feature}</span>
                            </li>
                            ))}
                        </ul>
                        </CardContent>
                        <CardFooter>
                          {plan.name === 'Basic' ? (
                              <Button asChild className="w-full" variant={plan.buttonVariant}>
                                  <Link href="/dashboard">{plan.buttonText}</Link>
                              </Button>
                          ) : (
                              <Button 
                                  className="w-full" 
                                  variant={plan.buttonVariant}
                                  onClick={() => handleUpgradeClick(plan.name)}
                              >
                                  {plan.buttonText}
                              </Button>
                          )}
                        </CardFooter>
                    </Card>
                    ))}
                </div>
            </div>
        </section>
        
        <section id="feedback" className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <div className="container">
              <form onSubmit={handleFeedbackSubmit}>
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader>
                    <CardTitle>Submit Feedback</CardTitle>
                    <CardDescription>
                        We value your feedback! Let us know how we can improve FiscalFlow AI.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="landing-name">Name (Optional)</Label>
                        <Input id="landing-name" placeholder="John Doe" value={feedbackName} onChange={(e) => setFeedbackName(e.target.value)} disabled={isSubmitting} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="landing-email">Email (Optional)</Label>
                        <Input id="landing-email" type="email" placeholder="john.doe@example.com" value={feedbackEmail} onChange={(e) => setFeedbackEmail(e.target.value)} disabled={isSubmitting} />
                    </div>
                    <div className="space-y-2">
                        <Label>Feedback Type</Label>
                        <RadioGroup value={feedbackType} onValueChange={setFeedbackType} className="flex gap-4" disabled={isSubmitting}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="bug" id="landing-bug" />
                            <Label htmlFor="landing-bug" className="font-normal">Bug Report</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="feature" id="landing-feature" />
                            <Label htmlFor="landing-feature" className="font-normal">Feature Request</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="general" id="landing-general" />
                            <Label htmlFor="landing-general" className="font-normal">General Feedback</Label>
                        </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="landing-feedback-message">Message</Label>
                        <Textarea
                          id="landing-feedback-message"
                          placeholder="Tell us what you're thinking..."
                          rows={6}
                          value={feedbackMessage}
                          onChange={(e) => setFeedbackMessage(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                    </div>
                    </CardContent>
                    <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        <Send className="mr-2 h-4 w-4" />
                        {isSubmitting ? "Submitting..." : "Submit Feedback"}
                    </Button>
                    </CardFooter>
                </Card>
              </form>
            </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
             <div className="container">
                <Card className="w-full max-w-4xl mx-auto bg-background">
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
        </section>

      </main>
      
       <footer className="py-8 md:px-8 md:py-12 border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
                <Icons.logo className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">FiscalFlow AI</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground sm:gap-6">
                <Link href="#support" className="transition-colors hover:text-foreground">Support</Link>
                <Link href="#pricing" className="transition-colors hover:text-foreground">Pricing</Link>
                <Link href="#feedback" className="transition-colors hover:text-foreground">Feedback</Link>
                <Link href="#faq" className="transition-colors hover:text-foreground">FAQ</Link>
            </nav>
            <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} FiscalFlow AI. All rights reserved.
            </p>
        </div>
    </footer>
    </div>
  );
}
