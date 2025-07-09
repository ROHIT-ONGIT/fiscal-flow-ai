'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CashFlowForecastingInputSchema = z.object({
  financialData: z
    .string()
    .describe(
      'Historical financial data, including income, expenses, and savings, formatted as a string.'
    ),
  forecastHorizon: z
    .string()
    .describe(
      'How far into the future to forecast, e.g., "3 months", "1 year".'
    ),
  assumptions: z
    .string()
    .optional()
    .describe(
      'Any assumptions about future income or expenses that should be considered in the forecast.'
    ),
});
export type CashFlowForecastingInput = z.infer<typeof CashFlowForecastingInputSchema>;

const CashFlowForecastingOutputSchema = z.object({
  forecastSummary: z
    .string()
    .describe(
      'A summary of the cash flow forecast, including key trends and potential issues.'
    ),
  projectedCashFlow: z.array(z.object({
    month: z.string().describe("The month of the forecast (e.g., 'Jan', 'Feb')."),
    cashFlow: z.number().describe("The projected cash flow amount for that month."),
  })).describe(
      'The projected cash flow for the specified forecast horizon, as an array of data points.'
    ),
  recommendations: z
    .array(z.string())
    .describe(
      'An array of personalized recommendations for improving cash flow and avoiding financial issues.'
    ),
});
export type CashFlowForecastingOutput = z.infer<typeof CashFlowForecastingOutputSchema>;

export async function forecastCashFlow(input: CashFlowForecastingInput): Promise<CashFlowForecastingOutput> {
  return cashFlowForecastingFlow(input);
}

const cashFlowForecastingPrompt = ai.definePrompt({
  name: 'cashFlowForecastingPrompt',
  input: {schema: CashFlowForecastingInputSchema},
  output: {schema: CashFlowForecastingOutputSchema},
  prompt: `You are an expert financial advisor specializing in cash flow forecasting.

  You will analyze historical financial data and forecast future cash flow.
  Consider any assumptions provided by the user.

  Provide a summary of the forecast, the projected cash flow as a structured array, and an array of personalized recommendations.

  Historical Financial Data: {{{financialData}}}
  Forecast Horizon: {{{forecastHorizon}}}
  Assumptions: {{{assumptions}}}
  \n`,
});

const cashFlowForecastingFlow = ai.defineFlow(
  {
    name: 'cashFlowForecastingFlow',
    inputSchema: CashFlowForecastingInputSchema,
    outputSchema: CashFlowForecastingOutputSchema,
  },
  async input => {
    const {output} = await cashFlowForecastingPrompt(input);
    return output!;
  }
);
