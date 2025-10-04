'use server';

/**
 * @fileOverview Provides safe synonyms for potentially flagged terms to avoid AI content filters.
 *
 * - getSafeSynonyms - A function that suggests safe synonyms for a given term.
 * - GetSafeSynonymsInput - The input type for the getSafeSynonyms function.
 * - GetSafeSynonymsOutput - The return type for the getSafeSynonyms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetSafeSynonymsInputSchema = z.object({
  term: z.string().describe('The term to find safe synonyms for.'),
});
export type GetSafeSynonymsInput = z.infer<typeof GetSafeSynonymsInputSchema>;

const GetSafeSynonymsOutputSchema = z.array(z.string()).describe('An array of safe synonyms for the given term.');
export type GetSafeSynonymsOutput = z.infer<typeof GetSafeSynonymsOutputSchema>;

export async function getSafeSynonyms(input: GetSafeSynonymsInput): Promise<GetSafeSynonymsOutput> {
  return getSafeSynonymsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSafeSynonymsPrompt',
  input: {schema: GetSafeSynonymsInputSchema},
  output: {schema: GetSafeSynonymsOutputSchema},
  prompt: `You are a helpful AI assistant. Given a potentially unsafe term, your task is to provide a list of safe synonyms that can be used instead.  The synonyms should have the same meaning as the original term but should not trigger any content filters.

Term: {{{term}}}

Safe Synonyms:`, //Strict Mode
});

const getSafeSynonymsFlow = ai.defineFlow(
  {
    name: 'getSafeSynonymsFlow',
    inputSchema: GetSafeSynonymsInputSchema,
    outputSchema: GetSafeSynonymsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);