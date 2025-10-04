'use server';
/**
 * @fileOverview The Prompt Doctor: An AI-powered prompt analysis tool.
 *
 * - analyzePrompt - A function that analyzes a given prompt for inconsistencies and suggests improvements for cohesion and fluency.
 * - AnalyzePromptInput - The input type for the analyzePrompt function, containing the prompt to analyze.
 * - AnalyzePromptOutput - The output type for the analyzePrompt function, containing analysis results and suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePromptInputSchema = z.object({
  prompt: z.string().describe('The prompt to analyze for inconsistencies and improvements.'),
});
export type AnalyzePromptInput = z.infer<typeof AnalyzePromptInputSchema>;

const AnalyzePromptOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis identifying any stylistic or logical contradictions in the prompt.'),
  suggestions: z.string().describe('Specific, actionable suggestions for improving prompt fluency, cohesion, and overall effectiveness for AI interpretation.'),
  suggestedKeywords: z.array(z.string()).describe('An array of new keywords to add to the prompt for better cohesion or detail.'),
  suggestedNegativePrompts: z.array(z.string()).describe('An array of negative prompt keywords to add to avoid common issues based on the input.'),
});
export type AnalyzePromptOutput = z.infer<typeof AnalyzePromptOutputSchema>;

export async function analyzePrompt(input: AnalyzePromptInput): Promise<AnalyzePromptOutput> {
  return analyzePromptFlow(input);
}

const analyzePromptPrompt = ai.definePrompt({
  name: 'analyzePromptPrompt',
  input: {schema: AnalyzePromptInputSchema},
  output: {schema: AnalyzePromptOutputSchema},
  prompt: `You are The Prompt Doctor, an expert AI prompt engineer. Your task is to analyze the given prompt for an image generation AI.

Your diagnosis must be precise and actionable.

1.  **Analysis**: First, identify any stylistic, logical, or contextual contradictions. For example, pointing out that "Victorian Gown" and "Cyberpunk City" might clash. Be direct and clear.
2.  **Suggestions**: Next, provide actionable suggestions to improve the prompt's fluency and effectiveness. This includes recommending better keyword combinations and structural improvements for better AI interpretation.
3.  **Keyword Expansion**: Based on the prompt's theme, suggest a few new keywords that would enhance the scene or character details. Populate the 'suggestedKeywords' array.
4.  **Preventive Negatives**: Based on the prompt's subject, suggest common negative keywords to prevent typical AI artifacts (e.g., if it's a person, suggest 'deformed hands', 'extra limbs'). Populate the 'suggestedNegativePrompts' array.

Prompt to Analyze:
"{{{prompt}}}"
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const analyzePromptFlow = ai.defineFlow(
  {
    name: 'analyzePromptFlow',
    inputSchema: AnalyzePromptInputSchema,
    outputSchema: AnalyzePromptOutputSchema,
  },
  async input => {
    const {output} = await analyzePromptPrompt(input);
    return output!;
  }
);