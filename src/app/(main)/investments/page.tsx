import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { InvestmentsClient } from "./client"

export default function InvestmentsPage() {
  return (
    <div>
        <Card>
            <CardHeader>
              <CardTitle>Investment Portfolio Analysis</CardTitle>
              <CardDescription>
                Get AI-powered insights into your investment portfolio. Enter your portfolio details, risk tolerance, and goals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvestmentsClient />
            </CardContent>
          </Card>
    </div>
  )
}
