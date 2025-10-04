"use server";

import { analyzePrompt } from "@/ai/flows/ai-powered-prompt-analysis";
import { getSafeSynonyms } from "@/ai/flows/synonym-recommendation";
import { rephrasePrompt } from "@/ai/flows/prompt-rephraser";

export async function getSynonymsAction(term: string) {
  try {
    const synonyms = await getSafeSynonyms({ term });
    return { success: true, data: synonyms };
  } catch (error) {
    console.error("Error getting synonyms:", error);
    return { success: false, error: "Failed to fetch synonyms." };
  }
}

export async function analyzePromptAction(prompt: string) {
  if (!prompt) {
    return { success: false, error: "Prompt cannot be empty." };
  }
  try {
    const analysis = await analyzePrompt({ prompt });
    return { success: true, data: analysis };
  } catch (error) {
    console.error("Error analyzing prompt:", error);
    return { success: false, error: "Failed to analyze prompt." };
  }
}

export async function rephrasePromptAction(prompt: string) {
  if (!prompt) {
    return { success: false, error: "Prompt to rephrase cannot be empty." };
  }
  try {
    const result = await rephrasePrompt({ prompt });
    return { success: true, data: result };
  } catch (error) {
    console.error("Error rephrasing prompt:", error);
    return { success: false, error: "Failed to rephrase prompt." };
  }
}