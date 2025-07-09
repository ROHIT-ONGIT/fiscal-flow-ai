"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, Loader2 } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from "recharts"

import { aiBudgetingSuggestions, AiBudgetingSuggestionsOutput } from "@/ai/flows/ai-budgeting-suggestions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ChartTooltipContent, ChartContainer } from "@/components/ui/chart"

const formSchema = z.object({
  income: z.coerce.number().positive({ message: "Income must be a positive number." }),
  expenses: z.string().min(10, { message: "Please provide your expenses." }),
  savingsGoals: z.string().min(10, { message: "Please provide your savings goals." }),
})

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function BudgetingClient() {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<AiBudgetingSuggestionsOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 5000,
      expenses: `{ "Rent": 1500, "Groceries": 400, "Transport": 200, "Entertainment": 150, "Utilities": 100 }`,
      savingsGoals: `[{ "name": "Vacation", "targetAmount": 3000, "timeline": "6" }, { "name": "New Laptop", "targetAmount": 1500, "timeline": "4" }]`,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setResult(null)
    try {
      const expenses = JSON.parse(values.expenses)
      const savingsGoals = JSON.parse(values.savingsGoals)
      
      const res = await aiBudgetingSuggestions({
        income: values.income,
        expenses,
        savingsGoals,
      })
      setResult(res)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate budget. Please check your JSON formatting.",
      })
    } finally {
      setLoading(false)
    }
  }

  const suggestedBudgetData = result ? result.suggestedBudget.map(item => ({ name: item.category, value: item.amount })) : [];
  const savingsAllocationData = result ? result.savingsAllocation.map(item => ({ name: item.goal, value: item.amount })) : [];

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Income</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 5000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expenses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expenses (JSON format)</FormLabel>
                <FormControl>
                  <Textarea rows={6} placeholder='e.g., { "Rent": 1500, "Groceries": 400 }' {...field} />
                </FormControl>
                <FormDescription>Provide your monthly expenses as a JSON object.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="savingsGoals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Savings Goals (JSON format)</FormLabel>
                <FormControl>
                  <Textarea rows={6} placeholder='e.g., [{ "name": "Vacation", "targetAmount": 3000, "timeline": "6" }]' {...field} />
                </FormControl>
                 <FormDescription>Provide your savings goals as an array of JSON objects.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Budget
          </Button>
        </form>
      </Form>
      {result && (
        <div className="mt-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Suggested Budget</CardTitle>
                        <CardDescription>Based on your inputs, here is a suggested monthly budget.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <ChartContainer config={{}}>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={suggestedBudgetData}>
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip cursor={{ fill: 'hsl(var(--secondary))' }} content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Savings Allocation</CardTitle>
                        <CardDescription>Monthly allocation towards your savings goals.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <ChartContainer config={{}}>
                          <ResponsiveContainer width="100%" height={350}>
                              <PieChart>
                                  <Pie data={savingsAllocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                                      {savingsAllocationData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                      ))}
                                  </Pie>
                                  <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                              </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>AI Insights</CardTitle>
                    <CardDescription>Actionable recommendations to improve your financial health.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {result.insights.map((insight, index) => (
                            <li key={index} className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-3 mt-1 shrink-0" />
                                <span>{insight}</span>
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
