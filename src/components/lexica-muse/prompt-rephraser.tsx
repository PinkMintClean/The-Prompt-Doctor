"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Copy } from "lucide-react";
import { rephrasePromptAction } from "./actions";

export function PromptRephraser() {
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [rephrasedPrompt, setRephrasedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRephrase = async () => {
    if (!originalPrompt.trim()) {
      toast({
        variant: "destructive",
        title: "Input Needed",
        description: "Please enter a prompt to rephrase.",
      });
      return;
    }

    setIsLoading(true);
    setRephrasedPrompt("");

    const response = await rephrasePromptAction(originalPrompt);

    if (response.success && response.data) {
      setRephrasedPrompt(response.data.rephrasedPrompt);
      toast({
        title: "Prompt Rephrased!",
        description: "Your new and improved prompt is ready.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Rephrasing Failed",
        description: response.error || "An unknown error occurred.",
      });
    }
    setIsLoading(false);
  };

  const handleCopy = () => {
    if (rephrasedPrompt) {
      navigator.clipboard.writeText(rephrasedPrompt);
      toast({
        title: "Copied!",
        description: "The rephrased prompt has been copied to your clipboard.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt Rephraser & Upgrader</CardTitle>
        <CardDescription>
          Paste an existing prompt and let the AI rewrite it to be more vivid,
          descriptive, and effective for image generation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="original-prompt">Your Original Prompt</Label>
          <Textarea
            id="original-prompt"
            value={originalPrompt}
            onChange={(e) => setOriginalPrompt(e.target.value)}
            placeholder="e.g., a girl in a red dress"
            className="mt-2"
            rows={3}
          />
        </div>
        <Button onClick={handleRephrase} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Rephrase & Upgrade Prompt
        </Button>
        {rephrasedPrompt && (
          <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
            <h4 className="font-semibold">Your Upgraded Prompt:</h4>
            <p className="text-sm font-mono p-3 bg-background rounded-md">
              {rephrasedPrompt}
            </p>
            <Button onClick={handleCopy} variant="secondary" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copy Upgraded Prompt
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Add this to your imports if you don't have it already
import { Label } from "@/components/ui/label";