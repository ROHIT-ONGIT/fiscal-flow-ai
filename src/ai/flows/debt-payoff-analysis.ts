'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DebtPayoffAnalysisInputSchema = z.object({
  totalDebt: z.number().describe('The total amount of the debt.'),
  annualInterestRate: z
    .number()
    .describe(
      'The annual interest rate (as a percentage, e.g., 5 for 5%).'
    ),
  monthlyPayment: z
    .number()
    .describe('The amount paid towards the debt each month.'),
});
export type DebtPayoffAnalysisInput = z.infer<
  typeof DebtPayoffAnalysisInputSchema
>;

const DebtPayoffAnalysisOutputSchema = z.object({
  payoffTime: z
    .string()
    .describe(
      "The estimated time to pay off the debt, e.g., '3 years and 5 months' or 'Never at this rate'."
    ),
  totalInterestPaid: z
    .number()
    .describe(
      'The total amount of interest paid over the life of the loan. Returns -1 if the debt will never be paid off.'
    ),
  suggestions: z
    .array(z.string())
    .describe(
      'Actionable suggestions for paying off the debt faster or addressing an unsustainable payment plan.'
    ),
});
export type DebtPayoffAnalysisOutput = z.infer<
  typeof DebtPayoffAnalysisOutputSchema
>;

export async function debtPayoffAnalysis(
  input: DebtPayoffAnalysisInput
): Promise<DebtPayoffAnalysisOutput> {
  return debtPayoffAnalysisFlow(input);
}

const promptContextSchema = z.object({
    ...DebtPayoffAnalysisInputSchema.shape,
    isSustainable: z.boolean(),
    payoffTime: z.string().optional(),
    totalInterestPaid: z.number().optional(),
});

const debtPrompt = ai.definePrompt({
    name: 'debtPayoffPrompt',
    input: { schema: promptContextSchema },
    output: { schema: DebtPayoffAnalysisOutputSchema },
    prompt: `You are a financial advisor. A user has provided their debt information.
    
    Debt Amount: \${{{totalDebt}}}
    Annual Interest Rate: {{{annualInterestRate}}}%
    Monthly Payment: \${{{monthlyPayment}}}

    {{#if isSustainable}}
    Based on calculations, they will pay off their debt in approximately {{{payoffTime}}} and pay a total of \${{{totalInterestPaid}}} in interest.
    
    Return the calculated payoff time and total interest paid in the response. Then, provide a few actionable and encouraging suggestions for how they could pay this debt off faster and save money on interest. For example, suggest increasing the monthly payment by a small amount and show the impact, or making bi-weekly payments.
    {{else}}
    The current monthly payment is not enough to cover the interest, meaning the debt will never be paid off at this rate.

    Explain this clearly but gently. Set 'payoffTime' to 'Never at this rate' and 'totalInterestPaid' to -1. Then, provide actionable suggestions on how to remedy the situation, like increasing payments, refinancing, or debt consolidation.
    {{/if}}

    Structure your entire response according to the output JSON schema.
    `,
});


const debtPayoffAnalysisFlow = ai.defineFlow(
  {
    name: 'debtPayoffAnalysisFlow',
    inputSchema: DebtPayoffAnalysisInputSchema,
    outputSchema: DebtPayoffAnalysisOutputSchema,
  },
  async (input) => {
    const { totalDebt, annualInterestRate, monthlyPayment } = input;
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const monthlyInterestAccrued = totalDebt * monthlyInterestRate;

    if (monthlyPayment <= monthlyInterestAccrued) {
        const { output } = await debtPrompt({ ...input, isSustainable: false });
        return output!;
    }

    const numberOfMonths = -(Math.log(1 - (totalDebt * monthlyInterestRate) / monthlyPayment) / Math.log(1 + monthlyInterestRate));
    const totalInterest = (numberOfMonths * monthlyPayment) - totalDebt;

    const years = Math.floor(numberOfMonths / 12);
    const months = Math.ceil(numberOfMonths % 12);
    let payoffTime = "";
    if (years > 0) {
        payoffTime += `${years} year${years > 1 ? 's' : ''}`;
    }
    if (months > 0) {
        payoffTime += `${years > 0 ? ' and ' : ''}${months} month${months > 1 ? 's' : ''}`;
    }

    const { output } = await debtPrompt({
        ...input,
        isSustainable: true,
        payoffTime,
        totalInterestPaid: parseFloat(totalInterest.toFixed(2)),
    });
    
    return {
        payoffTime: output?.payoffTime || payoffTime,
        totalInterestPaid: output?.totalInterestPaid ?? parseFloat(totalInterest.toFixed(2)),
        suggestions: output?.suggestions || ["Could not generate suggestions."],
    };
  }
);
