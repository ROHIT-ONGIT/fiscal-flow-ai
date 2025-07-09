'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiBudgetingSuggestionsInputSchema = z.object({
  income: z.number().describe('Monthly income of the user.'),
  expenses: z.record(z.string(), z.number()).describe('A map of expense categories and their amounts.'),
  savingsGoals: z.array(z.object({
    name: z.string().describe('The name of the saving goal.'),
    targetAmount: z.number().describe('The target amount for the saving goal.'),
    timeline: z.string().describe('The timeline to reach the goal in months.'),
  })).describe('An array of savings goals with target amounts and timelines.'),
});
export type AiBudgetingSuggestionsInput = z.infer<typeof AiBudgetingSuggestionsInputSchema>;

const AiBudgetingSuggestionsOutputSchema = z.object({
  suggestedBudget: z.array(z.object({
    category: z.string().describe("The name of the budget category."),
    amount: z.number().describe("The suggested budget amount for this category."),
  })).describe('An array of budget categories and their suggested amounts.'),
  savingsAllocation: z.array(z.object({
    goal: z.string().describe("The name of the savings goal."),
    amount: z.number().describe("The suggested monthly allocation for this goal."),
  })).describe('An array of savings goals and their suggested monthly allocation amounts.'),
  insights: z.array(z.string()).describe('Actionable insights and recommendations to improve financial health.'),
});
export type AiBudgetingSuggestionsOutput = z.infer<typeof AiBudgetingSuggestionsOutputSchema>;

export async function aiBudgetingSuggestions(input: AiBudgetingSuggestionsInput): Promise<AiBudgetingSuggestionsOutput> {
  return aiBudgetingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiBudgetingSuggestionsPrompt',
  input: {schema: AiBudgetingSuggestionsInputSchema},
  output: {schema: AiBudgetingSuggestionsOutputSchema},
  prompt: `You are an AI financial advisor. Analyze the user's financial situation and provide personalized budget suggestions, savings allocations, and actionable insights.

  Income: {{income}}
  Expenses:
  {{#each expenses}}
    - {{@key}}: {{this}}
  {{/each}}
  Savings Goals:
  {{#each savingsGoals}}
    - {{name}}: Target Amount = {{targetAmount}}, Timeline = {{timeline}} months
  {{/each}}

  Based on this information, suggest a budget for each expense category, allocate funds to savings goals, and provide insights to improve the user's financial health.
  `,
});

const aiBudgetingSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiBudgetingSuggestionsFlow',
    inputSchema: AiBudgetingSuggestionsInputSchema,
    outputSchema: AiBudgetingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
