'use server';
/**
 * @fileOverview The Prompt Rephraser: An AI tool to upgrade and rewrite prompts.
 *
 * - rephrasePrompt - A function that analyzes a given prompt and rewrites it using more vivid, descriptive, and effective language.
 * - RephrasePromptInput - The input type for the rephrasePrompt function.
 * - RephrasePromptOutput - The output type for the rephrasePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RephrasePromptInputSchema = z.object({
  prompt: z.string().describe('The prompt to be rephrased and upgraded.'),
});
export type RephrasePromptInput = z.infer<typeof RephrasePromptInputSchema>;

const RephrasePromptOutputSchema = z.object({
    rephrasedPrompt: z.string().describe('The new, upgraded prompt with more descriptive and effective keywords.'),
});
export type RephrasePromptOutput = z.infer<typeof RephrasePromptOutputSchema>;

export async function rephrasePrompt(input: RephrasePromptInput): Promise<RephrasePromptOutput> {
  return rephrasePromptFlow(input);
}

const rephrasePromptObject = ai.definePrompt({
  name: 'rephrasePrompt',
  input: {schema: RephrasePromptInputSchema},
  output: {schema: RephrasePromptOutputSchema},
  prompt: `You are a prompt engineering expert specializing in image generation AI. Your task is to take the user's prompt and rewrite it to be more vivid, descriptive, and effective.

- Replace simple words with more evocative synonyms.
- Add details that would enhance the visual result.
- Structure the prompt logically.
- Maintain the core concept of the original prompt.

Original Prompt:
"{{{prompt}}}"

Rephrased and Upgraded Prompt:`,
});

const rephrasePromptFlow = ai.defineFlow(
  {
    name: 'rephrasePromptFlow',
    inputSchema: RephrasePromptInputSchema,
    outputSchema: RephrasePromptOutputSchema,
  },
  async input => {
    const {output} = await rephrasePromptObject(input);
    return output!;
  }
);