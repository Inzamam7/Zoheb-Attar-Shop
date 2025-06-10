// Product summarizer file.
'use server';

/**
 * @fileOverview A product summarization AI agent.
 *
 * - summarizeProduct - A function that handles the product summarization process.
 * - SummarizeProductInput - The input type for the summarizeProduct function.
 * - SummarizeProductOutput - The return type for the summarizeProduct function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeProductInputSchema = z.object({
  productDetails: z
    .string()
    .describe('Detailed description of the product, its features, and benefits.'),
});
export type SummarizeProductInput = z.infer<typeof SummarizeProductInputSchema>;

const SummarizeProductOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the product details, highlighting key features and benefits.'),
});
export type SummarizeProductOutput = z.infer<typeof SummarizeProductOutputSchema>;

export async function summarizeProduct(input: SummarizeProductInput): Promise<SummarizeProductOutput> {
  return summarizeProductFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeProductPrompt',
  input: {schema: SummarizeProductInputSchema},
  output: {schema: SummarizeProductOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in creating concise product summaries.

  Given the following product details, generate a short and engaging summary that highlights the key features and benefits for potential customers.

  Product Details:
  {{productDetails}}`,
});

const summarizeProductFlow = ai.defineFlow(
  {
    name: 'summarizeProductFlow',
    inputSchema: SummarizeProductInputSchema,
    outputSchema: SummarizeProductOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
