import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ForecastingClient } from "./client"

export default function ForecastingPage() {
  return (
    <div>
        <Card>
            <CardHeader>
              <CardTitle>Cash Flow Forecasting</CardTitle>
              <CardDescription>
                Use historical data to forecast your future cash flow and get personalized recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ForecastingClient />
            </CardContent>
          </Card>
    </div>
  )
}
