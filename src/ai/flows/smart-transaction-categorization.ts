'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartTransactionCategorizationInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction.'),
  userCategories: z
    .string()
    .array()
    .describe('A list of user defined categories for transactions.'),
});
export type SmartTransactionCategorizationInput =
  z.infer<typeof SmartTransactionCategorizationInputSchema>;

const SmartTransactionCategorizationOutputSchema = z.object({
  predictedCategory: z
    .string()
    .describe('The predicted category for the transaction.'),
});
export type SmartTransactionCategorizationOutput =
  z.infer<typeof SmartTransactionCategorizationOutputSchema>;

export async function smartTransactionCategorization(
  input: SmartTransactionCategorizationInput
): Promise<SmartTransactionCategorizationOutput> {
  return smartTransactionCategorizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartTransactionCategorizationPrompt',
  input: {schema: SmartTransactionCategorizationInputSchema},
  output: {schema: SmartTransactionCategorizationOutputSchema},
  prompt: `You are a personal finance expert. Given a transaction description, you will categorize the transaction into one of the following user-defined categories.

Transaction Description: {{{transactionDescription}}}
User Categories: {{#each userCategories}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

What is the most likely category for this transaction? Respond only with the category name.`,
});

const smartTransactionCategorizationFlow = ai.defineFlow(
  {
    name: 'smartTransactionCategorizationFlow',
    inputSchema: SmartTransactionCategorizationInputSchema,
    outputSchema: SmartTransactionCategorizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
