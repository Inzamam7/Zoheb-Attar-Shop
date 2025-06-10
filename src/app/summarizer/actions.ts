"use server";

import { summarizeProduct, type SummarizeProductInput } from '@/ai/flows/product-summarizer';

export async function generateSummaryAction(productDetails: string): Promise<{ summary: string | null; error?: string }> {
  if (!productDetails.trim()) {
    return { summary: null, error: "Product details cannot be empty." };
  }

  try {
    const input: SummarizeProductInput = { productDetails };
    const result = await summarizeProduct(input);
    return { summary: result.summary };
  } catch (error) {
    console.error("Error generating summary:", error);
    return { summary: null, error: "Failed to generate summary. Please try again." };
  }
}
