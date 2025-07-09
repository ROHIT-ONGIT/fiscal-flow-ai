
"use client"

import { Check, Gem } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

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
    buttonText: "Current Plan",
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

export default function PricingPage() {
  const { toast } = useToast()

  const handleUpgradeClick = (planName: string) => {
    toast({
      title: "Feature Coming Soon!",
      description: `Thank you for your interest in the ${planName} plan. Payment integration is currently in development.`,
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight font-headline">
          Simple, Transparent Pricing
        </h1>
        <p className="max-w-xl mx-auto mt-4 text-lg text-muted-foreground">
          Choose the perfect plan for your financial journey. No hidden fees, no surprises.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3 lg:items-start">
        {pricingPlans.map((plan) => (
          <Card key={plan.name} className={cn("relative flex flex-col h-full", plan.isPopular && "border-2 border-primary shadow-lg")}>
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
              <Button 
                className="w-full" 
                variant={plan.buttonVariant} 
                disabled={plan.buttonVariant === 'outline'}
                onClick={() => {
                  if (plan.buttonVariant !== 'outline') {
                    handleUpgradeClick(plan.name)
                  }
                }}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
