'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvestmentPortfolioAnalysisInputSchema = z.object({
  portfolioData: z
    .string()
    .describe("A JSON string containing the user's investment portfolio data, including holdings, quantities, and purchase prices."),
  riskTolerance: z
    .string()
    .describe('The user’s risk tolerance (e.g., low, medium, high).'),
  investmentGoals: z
    .string()
    .describe('The user’s investment goals (e.g., retirement, growth, income).'),
});
export type InvestmentPortfolioAnalysisInput = z.infer<
  typeof InvestmentPortfolioAnalysisInputSchema
>;

const InvestmentPortfolioAnalysisOutputSchema = z.object({
  overallAssessment: z.string().describe('An overall assessment of the portfolio.'),
  riskAnalysis: z.string().describe('An analysis of the portfolio’s risk profile.'),
  recommendations: z
    .array(z.string())
    .describe('An array of recommendations for improving the portfolio.'),
});
export type InvestmentPortfolioAnalysisOutput = z.infer<
  typeof InvestmentPortfolioAnalysisOutputSchema
>;

export async function investmentPortfolioAnalysis(
  input: InvestmentPortfolioAnalysisInput
): Promise<InvestmentPortfolioAnalysisOutput> {
  return investmentPortfolioAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'investmentPortfolioAnalysisPrompt',
  input: {schema: InvestmentPortfolioAnalysisInputSchema},
  output: {schema: InvestmentPortfolioAnalysisOutputSchema},
  prompt: `You are a financial advisor providing investment portfolio analysis.

  Analyze the user's investment portfolio based on the provided data, risk tolerance, and investment goals.
  Provide an overall assessment of the portfolio, an analysis of the risk profile, and recommendations for improvement as an array of strings.

  Portfolio Data: {{{portfolioData}}}
  Risk Tolerance: {{{riskTolerance}}}
  Investment Goals: {{{investmentGoals}}}

  Respond in a professional tone.
  `,
});

const investmentPortfolioAnalysisFlow = ai.defineFlow(
  {
    name: 'investmentPortfolioAnalysisFlow',
    inputSchema: InvestmentPortfolioAnalysisInputSchema,
    outputSchema: InvestmentPortfolioAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
