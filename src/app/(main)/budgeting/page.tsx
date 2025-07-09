import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BudgetingClient } from "./client"

export default function BudgetingPage() {
  return (
    <div>
        <Card>
            <CardHeader>
              <CardTitle>AI Budgeting Tool</CardTitle>
              <CardDescription>
                Let our AI analyze your income, expenses, and goals to create a personalized budget for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetingClient />
            </CardContent>
          </Card>
    </div>
  )
}
