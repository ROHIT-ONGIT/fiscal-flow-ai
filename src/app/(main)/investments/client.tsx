"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, Loader2 } from "lucide-react"

import { investmentPortfolioAnalysis, InvestmentPortfolioAnalysisOutput } from "@/ai/flows/investment-portfolio-analysis"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  portfolioData: z.string().min(20, {
    message: "Portfolio data must be at least 20 characters.",
  }),
  riskTolerance: z.string({
    required_error: "Please select your risk tolerance.",
  }),
  investmentGoals: z.string().min(10, {
    message: "Investment goals must be at least 10 characters.",
  }),
})

export function InvestmentsClient() {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<InvestmentPortfolioAnalysisOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      portfolioData: `[{ "symbol": "AAPL", "quantity": 10, "purchasePrice": 150 }, { "symbol": "GOOGL", "quantity": 5, "purchasePrice": 2800 }, { "symbol": "TSLA", "quantity": 8, "purchasePrice": 700 }]`,
      riskTolerance: "medium",
      investmentGoals: "Long-term growth and retirement savings.",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setResult(null)
    try {
      const res = await investmentPortfolioAnalysis(values)
      setResult(res)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze portfolio.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="portfolioData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portfolio Data (JSON format)</FormLabel>
                <FormControl>
                  <Textarea rows={7} placeholder='e.g., [{ "symbol": "AAPL", "quantity": 10, "purchasePrice": 150 }]' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="riskTolerance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Tolerance</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your risk tolerance" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="investmentGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Goals</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Retirement, growth, income" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Analyze Portfolio
          </Button>
        </form>
      </Form>
      {result && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{result.overallAssessment}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{result.riskAnalysis}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
               <ul className="space-y-3">
                    {result.recommendations.map((rec, index) => (
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
