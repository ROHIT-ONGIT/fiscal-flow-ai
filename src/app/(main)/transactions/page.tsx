
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, PlusCircle, Loader2, Wand2, FileUp, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
// Remove direct MongoDB import - use API routes instead
// import { addTransaction, getTransactions, deleteTransaction } from "@/services/transactionsMongo"
import { useAuth } from "@/hooks/use-auth-mongo"
import type { Transaction } from "@/types/transaction"
import { Skeleton } from "@/components/ui/skeleton"
import { smartTransactionCategorization, SmartTransactionCategorizationOutput } from "@/ai/flows/smart-transaction-categorization"
import { receiptOcr } from "@/ai/flows/receipt-ocr"
import { Textarea } from "@/components/ui/textarea"


const transactionFormSchema = z.object({
  description: z.string().min(1, "Description is required."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  date: z.date({ required_error: "A date is required." }),
  category: z.string().min(1, "Category is required."),
  type: z.enum(["income", "expense"], { required_error: "Please select a type." }),
})

const smartCategorizeSchema = z.object({
  transactionDescription: z.string().min(10, {
    message: "Transaction description must be at least 10 characters.",
  }),
})

const categories = ["Groceries", "Dining", "Shopping", "Transport", "Bills", "Health", "Travel", "Entertainment", "Rent", "Utilities", "Income", "Other"]

export default function TransactionsPage() {
  const { toast } = useToast()
  const auth = useAuth()
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  // State for Smart Categorization
  const [categorizeLoading, setCategorizeLoading] = React.useState(false)
  const [categorizeResult, setCategorizeResult] = React.useState<SmartTransactionCategorizationOutput | null>(null)

  // State for OCR
  const [ocrLoading, setOcrLoading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // State for Delete confirmation
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [transactionToDelete, setTransactionToDelete] = React.useState<Transaction | null>(null);

  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      description: "",
      amount: undefined,
      date: new Date(),
      category: "",
      type: "expense",
    },
  })

  const categorizeForm = useForm<z.infer<typeof smartCategorizeSchema>>({
    resolver: zodResolver(smartCategorizeSchema),
    defaultValues: {
      transactionDescription: "STARBUCKS COFFEE #54321 SEATTLE WA",
    },
  })
  
  const fetchTransactions = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/transactions')
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }
      const data = await response.json()
      setTransactions(data || [])
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
      toast({
        variant: "destructive",
        title: "Error fetching transactions",
        description: "There might be an issue with the database connection.",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])


  async function onTransactionSubmit(values: z.infer<typeof transactionFormSchema>) {
    setIsSubmitting(true);
    
    // We create a temporary transaction for the optimistic update.
    // The real ID will come from Firestore.
    const tempId = `temp-${Date.now()}`;
    const newTransaction: Transaction = {
        id: tempId,
        status: 'Pending',
        ...values,
    };

    // Optimistic UI update
    setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setAddDialogOpen(false);
    
    try {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, status: 'Completed' })
        });
        
        if (!response.ok) {
          throw new Error('Failed to add transaction');
        }
        
        toast({
            title: "Transaction Added",
            description: "Your new transaction has been successfully saved.",
        });
        // On success, refresh the entire list from the server to get the real data.
        fetchTransactions(); 
        // TODO: Refresh user profile to update balance and stats if needed.
    } catch (error) {
        console.error("Failed to add transaction:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not add the transaction.",
        });
        // If the API call fails, roll back the optimistic update.
        setTransactions(prev => prev.filter(t => t.id !== tempId));
    } finally {
        setIsSubmitting(false);
        form.reset({
            description: "",
            amount: undefined,
            date: new Date(),
            category: "",
            type: "expense",
        });
    }
}


  async function onCategorizeSubmit(values: z.infer<typeof smartCategorizeSchema>) {
    setCategorizeLoading(true)
    setCategorizeResult(null)
    try {
      const res = await smartTransactionCategorization({ 
          ...values, 
          userCategories: categories 
      })
      setCategorizeResult(res)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to categorize transaction.",
      })
    } finally {
      setCategorizeLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleScanReceipt = async () => {
    if (!selectedFile) {
      toast({ title: "Please select a receipt image first.", variant: "destructive" });
      return;
    }
    setOcrLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = async () => {
        const imageDataUri = reader.result as string;
        const result = await receiptOcr({ receiptImage: imageDataUri });

        form.setValue("description", result.merchant);
        form.setValue("amount", result.total);
        const date = new Date(result.date);
        date.setDate(date.getDate() + 1);
        form.setValue("date", date);
        form.setValue("type", "expense");
        form.resetField("category");

        setAddDialogOpen(true);
        toast({ title: "Receipt Scanned!", description: "Please review the details and save." });
      };
      reader.onerror = (error) => {
          console.error("File Reader Error:", error);
          toast({ variant: "destructive", title: "File Error", description: "Could not read the selected file." });
      }
    } catch (error) {
      console.error("Failed to scan receipt:", error);
      toast({ variant: "destructive", title: "Scan Failed", description: "Could not extract details from the receipt." });
    } finally {
      setOcrLoading(false);
    }
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
      if (!transactionToDelete) return;

      const originalTransactions = [...transactions];
      
      // Optimistic UI update
      setTransactions(prev => prev.filter(t => t.id !== transactionToDelete!.id));
      setDeleteDialogOpen(false);

      try {
          const response = await fetch(`/api/transactions`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: transactionToDelete.id })
          });
          
          if (!response.ok) {
            throw new Error('Failed to delete transaction');
          }
          
          toast({
              title: "Transaction Deleted",
              description: `"${transactionToDelete.description}" has been removed.`,
          });
          // Refresh user profile to update balance and stats
          await refreshUserProfile();
      } catch (error) {
          console.error("Failed to delete transaction:", error);
          toast({
              variant: "destructive",
              title: "Error",
              description: "Could not delete transaction.",
          });
          // Rollback
          setTransactions(originalTransactions);
      } finally {
          setTransactionToDelete(null);
      }
  };

  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the transaction for "{transactionToDelete?.description}".
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setTransactionToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Transactions</CardTitle>
          <CardDescription>
            Categorize transactions, scan receipts, and manage your spending with the power of AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Tabs defaultValue="categorize" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="categorize">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Smart Categorize
                </TabsTrigger>
                <TabsTrigger value="scan">
                    <FileUp className="mr-2 h-4 w-4" />
                    Scan Receipt (OCR)
                </TabsTrigger>
              </TabsList>
              <TabsContent value="categorize" className="mt-4">
                <Form {...categorizeForm}>
                  <form onSubmit={categorizeForm.handleSubmit(onCategorizeSubmit)} className="space-y-8">
                    <FormField
                      control={categorizeForm.control}
                      name="transactionDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="e.g., AMAZON MKTPLACE PMTS AMZN.CO" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={categorizeLoading}>
                      {categorizeLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Categorize
                    </Button>
                  </form>
                </Form>
                {categorizeResult && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>AI Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Predicted Category: <span className="font-semibold text-primary">{categorizeResult.predictedCategory}</span></p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="scan" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Receipt Scanner</CardTitle>
                        <CardDescription>Upload an image of your receipt to automatically extract transaction details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Input id="receipt" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} />
                            <Button onClick={handleScanReceipt} disabled={ocrLoading || !selectedFile}>
                                {ocrLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                                Scan Receipt
                            </Button>
                        </div>
                    </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                Recent transactions from your accounts.
                </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-auto gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                  <DialogDescription>
                    Enter the details of your transaction below. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onTransactionSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Dinner with friends" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Transaction Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex space-x-4"
                              >
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value="expense" id="expense" />
                                  </FormControl>
                                  <FormLabel htmlFor="expense" className="font-normal">Expense</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value="income" id="income" />
                                  </FormControl>
                                  <FormLabel htmlFor="income" className="font-normal">Income</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="100.00"
                                {...field}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Transaction
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : transactions.length > 0 ? (
              transactions.map(transaction => (
                  <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>
                          <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell>
                          <Badge variant={transaction.status === 'Completed' ? 'default' : transaction.status === 'Pending' ? 'secondary' : 'destructive'}>
                              {transaction.status}
                          </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(transaction.date), "PP")}</TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          "font-medium",
                          transaction.type === 'income' ? 'text-green-500' : 'text-red-600 dark:text-red-500'
                        )}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(transaction)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete transaction</span>
                          </Button>
                      </TableCell>
                  </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No transactions found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Refreshes the user profile, e.g., to update balance and stats after transaction changes.
// Currently a placeholder as refreshProfile does not exist on AuthContextType.
async function refreshUserProfile() {
  // Implement profile refresh logic here if available in the future.
}

