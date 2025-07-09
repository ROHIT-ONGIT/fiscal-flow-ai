"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {

  return (
    <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-[1fr_250px]">
            <div className="flex flex-col gap-4">
                <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                    Update your personal information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name">Name</label>
                        <Input id="name" defaultValue={"Jane Doe"} />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email">Email</label>
                        <Input id="email" type="email" defaultValue={"jane.doe@example.com"} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Save Profile</Button>
                </CardFooter>
                </Card>
                <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                    Manage your account password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline">
                      Change Password
                    </Button>
                </CardContent>
                </Card>
            </div>
            <div className="flex flex-col gap-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                        Manage your notification preferences.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="bill-reminders" defaultChecked />
                            <label htmlFor="bill-reminders" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Bill Reminders
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="unusual-activity" defaultChecked />
                            <label htmlFor="unusual-activity" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Unusual Activity
                            </label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="promotions" />
                            <label htmlFor="promotions" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Promotions & Updates
                            </label>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">Save Preferences</Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Danger Zone</CardTitle>
                        <CardDescription>
                        These actions are irreversible.
                        </CardDescription>
                    </CardHeader>
                     <CardContent>
                         <Button variant="destructive" className="w-full">Delete Account</Button>
                     </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}
