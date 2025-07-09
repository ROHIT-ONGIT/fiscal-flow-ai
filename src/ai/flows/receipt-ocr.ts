'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReceiptOcrInputSchema = z.object({
  receiptImage: z
    .string()
    .describe(
      "A receipt image encoded as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ReceiptOcrInput = z.infer<typeof ReceiptOcrInputSchema>;

const ReceiptOcrOutputSchema = z.object({
  merchant: z.string().describe('The name of the store or merchant.'),
  total: z.number().describe('The final total amount paid.'),
  date: z
    .string()
    .describe(
      'The transaction date found on the receipt in YYYY-MM-DD format.'
    ),
});
export type ReceiptOcrOutput = z.infer<typeof ReceiptOcrOutputSchema>;

export async function receiptOcr(
  input: ReceiptOcrInput
): Promise<ReceiptOcrOutput> {
  return receiptOcrFlow(input);
}

const prompt = ai.definePrompt({
  name: 'receiptOcrPrompt',
  input: {schema: ReceiptOcrInputSchema},
  output: {schema: ReceiptOcrOutputSchema},
  prompt: `You are an expert at reading receipts. Analyze the following receipt image and extract the merchant name, the final total amount, and the transaction date.
  
  Receipt Image: {{media url=receiptImage}}
  `,
});

const receiptOcrFlow = ai.defineFlow(
  {
    name: 'receiptOcrFlow',
    inputSchema: ReceiptOcrInputSchema,
    outputSchema: ReceiptOcrOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
