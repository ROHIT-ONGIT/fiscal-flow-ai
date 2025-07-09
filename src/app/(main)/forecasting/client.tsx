"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, Loader2 } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

import { forecastCashFlow, CashFlowForecastingOutput } from "@/ai/flows/cash-flow-forecasting"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ChartTooltipContent } from "@/components/ui/chart"
import { ChartContainer } from "@/components/ui/chart"

const formSchema = z.object({
  financialData: z.string().min(20, { message: "Please provide more detailed financial data." }),
  forecastHorizon: z.string().min(2, { message: "Please specify a forecast horizon." }),
  assumptions: z.string().optional(),
})

export function ForecastingClient() {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<CashFlowForecastingOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      financialData: "Monthly Income: $5000. Monthly Expenses: Rent $1500, Groceries $400, Transport $150. Savings: $500 per month.",
      forecastHorizon: "6 months",
      assumptions: "Expecting a 5% raise in 3 months.",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setResult(null)
    try {
      const res = await forecastCashFlow(values)
      setResult(res)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate forecast.",
      })
    } finally {
      setLoading(false)
    }
  }
  
  const chartData = result?.projectedCashFlow || [];

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="financialData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Historical Financial Data</FormLabel>
                <FormControl>
                  <Textarea rows={5} placeholder="Describe your past income, expenses, and savings..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="forecastHorizon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forecast Horizon</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 6 months, 1 year" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="assumptions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assumptions (Optional)</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="e.g., Expecting a raise, planned large purchase..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Forecast Cash Flow
          </Button>
        </form>
      </Form>
      {result && (
        <div className="mt-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Forecast Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{result.forecastSummary}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Projected Cash Flow</CardTitle>
                    <CardDescription>Here is your projected cash flow based on the data provided.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}}>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={chartData}>
                                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value}`} />
                                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                                <Legend />
                                <Line type="monotone" dataKey="cashFlow" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
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
