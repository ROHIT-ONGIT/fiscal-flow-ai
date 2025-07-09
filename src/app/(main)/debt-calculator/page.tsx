import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DebtCalculatorClient } from "./client"

export default function DebtCalculatorPage() {
  return (
    <div>
        <Card>
            <CardHeader>
              <CardTitle>Debt Payoff Calculator</CardTitle>
              <CardDescription>
                Enter your debt details below to get an AI-powered payoff plan and suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DebtCalculatorClient />
            </CardContent>
          </Card>
    </div>
  )
}
