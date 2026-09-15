'use server';

/**
 * @fileOverview Dynamically generates a discount code upon a virtual scratch action.
 *
 * - generateDiscountCode - A function to generate a discount code with a percentage determined by AI.
 * - DiscountCodeInput - The input type for the generateDiscountCode function (currently empty).
 * - DiscountCodeOutput - The return type, containing the discount code and percentage.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiscountCodeInputSchema = z.object({});
export type DiscountCodeInput = z.infer<typeof DiscountCodeInputSchema>;

const DiscountCodeOutputSchema = z.object({
  discountCode: z.string().describe('The generated discount code.'),
  discountPercentage: z.number().describe('The percentage of the discount, between 1 and 99.'),
});
export type DiscountCodeOutput = z.infer<typeof DiscountCodeOutputSchema>;

export async function generateDiscountCode(input: DiscountCodeInput): Promise<DiscountCodeOutput> {
  return generateDiscountCodeFlow(input);
}

const generateDiscountCodePrompt = ai.definePrompt({
  name: 'generateDiscountCodePrompt',
  input: {schema: DiscountCodeInputSchema},
  output: {schema: DiscountCodeOutputSchema},
  prompt: `You are a marketing expert tasked with generating a discount code to incentivize purchases.  Generate a random discount code, and a discount percentage.

  The discount percentage should be between 1 and 99.
  The discount code should be a random string.
  Do not include any introductory or concluding remarks, just the discount code and the discount percentage.
  `,
});

const generateDiscountCodeFlow = ai.defineFlow(
  {
    name: 'generateDiscountCodeFlow',
    inputSchema: DiscountCodeInputSchema,
    outputSchema: DiscountCodeOutputSchema,
  },
  async input => {
    const {output} = await generateDiscountCodePrompt(input);
    return output!;
  }
);
