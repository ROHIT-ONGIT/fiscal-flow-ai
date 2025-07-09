"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function FeedbackPage() {
  const { toast } = useToast()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [feedbackType, setFeedbackType] = React.useState("bug")
  const [message, setMessage] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message) {
      toast({
        variant: "destructive",
        title: "Message Required",
        description: "Please enter a message before submitting.",
      })
      return
    }
    
    setIsSubmitting(true)

    // In a real app, you would send this data to a backend endpoint.
    // For this portfolio project, we'll simulate the submission.
    setTimeout(() => {
      console.log({
        name,
        email,
        feedbackType,
        message,
      })
      toast({
        title: "Feedback Submitted!",
        description: "Thank you for helping us improve FiscalFlow AI.",
      })
      
      setName("")
      setEmail("")
      setFeedbackType("bug")
      setMessage("")
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="flex justify-center items-start py-8">
      <Card className="w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
            <CardDescription>
              We value your feedback! Let us know how we can improve FiscalFlow AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label>Feedback Type</Label>
              <RadioGroup value={feedbackType} onValueChange={setFeedbackType} className="flex gap-4" disabled={isSubmitting}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bug" id="bug" />
                  <Label htmlFor="bug" className="font-normal">Bug Report</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="feature" id="feature" />
                  <Label htmlFor="feature" className="font-normal">Feature Request</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="general" id="general" />
                  <Label htmlFor="general" className="font-normal">General Feedback</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-message">Message</Label>
              <Textarea
                id="feedback-message"
                placeholder="Tell us what you're thinking..."
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
