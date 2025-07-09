"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, Loader2 } from "lucide-react"

import { debtPayoffAnalysis, DebtPayoffAnalysisOutput } from "@/ai/flows/debt-payoff-analysis"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  totalDebt: z.coerce.number().positive({ message: "Total debt must be a positive number." }),
  annualInterestRate: z.coerce.number().positive({ message: "Interest rate must be a positive number." }),
  monthlyPayment: z.coerce.number().positive({ message: "Monthly payment must be a positive number." }),
})

export function DebtCalculatorClient() {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<DebtPayoffAnalysisOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalDebt: 10000,
      annualInterestRate: 7.5,
      monthlyPayment: 250,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setResult(null)
    try {
      const res = await debtPayoffAnalysis(values)
      setResult(res)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate debt analysis.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="totalDebt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Debt ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="10000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="annualInterestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Interest Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="7.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="monthlyPayment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Payment ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="250" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Analyze Debt
          </Button>
        </form>
      </Form>
      {result && (
        <div className="mt-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Estimated Payoff Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{result.payoffTime}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Total Interest Paid</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {result.totalInterestPaid === -1 
                                ? "N/A"
                                : `$${result.totalInterestPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            }
                        </p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                    <CardDescription>Actionable recommendations to help you pay off your debt faster.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {result.suggestions.map((rec, index) => (
                            <li key={index} className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-3 mt-1 shrink-0" />
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      )}
    </>
  )
}
