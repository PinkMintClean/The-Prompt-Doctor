"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Trash2 } from "lucide-react";
import { PromptAnalyzer } from "./prompt-analyzer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PromptBuilderProps {
  prompt: string;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  autoRatioEnabled: boolean;
  setAutoRatioEnabled: (value: boolean) => void;
  onCopy: () => void;
  onClear: () => void;
  onAddKeywords: (keywords: string[]) => void;
  onAddNegativeKeywords: (keywords: string[]) => void;
}

export function PromptBuilder({
  prompt,
  negativePrompt,
  setNegativePrompt,
  autoRatioEnabled,
  setAutoRatioEnabled,
  onCopy,
  onClear,
  onAddKeywords,
  onAddNegativeKeywords,
}: PromptBuilderProps) {
  const charCount = prompt.length;
  const tokenEstimate = Math.ceil(charCount / 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Custom Prompt (Real-Time Builder)</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={prompt}
          readOnly
          rows={4}
          className="w-full p-4 mb-4 border rounded-lg focus:ring-accent focus:border-accent bg-background resize-none"
          placeholder="Select keywords below to build your prompt, or type custom ones..."
          aria-live="polite"
        />

        <div className="flex justify-between items-center text-sm font-medium text-muted-foreground mb-4">
          <span>Characters: {charCount}</span>
          <span>Estimated Tokens: {tokenEstimate}</span>
        </div>

        <div className="mb-4">
          <Label htmlFor="negative-prompt">Negative Prompt (what to avoid)</Label>
          <Textarea
            id="negative-prompt"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            rows={2}
            className="w-full p-4 mt-2 border rounded-lg focus:ring-accent focus:border-accent bg-background resize-none"
            placeholder="e.g., extra limbs, blurry background, bad anatomy..."
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Button onClick={onCopy} className="flex-1 min-w-[150px]">
            <Copy className="mr-2 h-4 w-4" />
            Copy Prompt
          </Button>
          <Button
            onClick={onClear}
            variant="destructive"
            className="flex-1 min-w-[150px]"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Prompt
          </Button>
          <PromptAnalyzer 
            prompt={prompt} 
            onAddKeywords={onAddKeywords}
            onAddNegativeKeywords={onAddNegativeKeywords}
          />
           <div className="flex items-center space-x-2">
            <Switch id="auto-ratio" checked={autoRatioEnabled} onCheckedChange={setAutoRatioEnabled} />
            <Label htmlFor="auto-ratio">Auto-Apply Body Ratios</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}