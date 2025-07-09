"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Banknote } from "lucide-react"

export function ConnectBankCard() {
    const { toast } = useToast()

    const handleConnect = () => {
        toast({
            title: "Coming Soon!",
            description: "Bank account integration is a planned feature. Stay tuned!",
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Connect Your Bank Account</CardTitle>
                <CardDescription>
                    Sync transactions automatically and get a complete financial overview.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleConnect}>
                    <Banknote className="mr-2 h-4 w-4" />
                    Connect Account
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                    This feature is coming soon. For now, you can add transactions manually on the Transactions page.
                </p>
            </CardContent>
        </Card>
    )
}
