"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { analyzePromptAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, PlusCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface PromptAnalyzerProps {
  prompt: string;
  onAddKeywords: (keywords: string[]) => void;
  onAddNegativeKeywords: (keywords: string[]) => void;
}

type AnalysisResult = {
  analysis: string;
  suggestions: string;
  suggestedKeywords: string[];
  suggestedNegativePrompts: string[];
};

export function PromptAnalyzer({ 
  prompt, 
  onAddKeywords, 
  onAddNegativeKeywords 
}: PromptAnalyzerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!prompt) {
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Please build a prompt before analyzing.",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setIsOpen(true);

    const response = await analyzePromptAction(prompt);
    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: response.error || "An unknown error occurred.",
      });
      setIsOpen(false);
    }
    setIsLoading(false);
  };
  
  const handleAddSuggestedKeywords = () => {
    if (result?.suggestedKeywords) {
      onAddKeywords(result.suggestedKeywords);
      toast({
        title: "Keywords Added",
        description: "Suggested keywords have been added to your prompt.",
      });
    }
  };

  const handleAddNegativeKeywords = () => {
    if (result?.suggestedNegativePrompts) {
      onAddNegativeKeywords(result.suggestedNegativePrompts);
      toast({
        title: "Negative Keywords Added",
        description: "Suggested negative keywords have been added.",
      });
    }
  };


  return (
    <>
      <Button onClick={handleAnalyze} disabled={isLoading} variant="outline">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        Analyze Prompt
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>The Prompt Doctor's Analysis</DialogTitle>
            <DialogDescription>
              AI-powered feedback to help you refine your prompt.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto space-y-6">
            {isLoading && (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Analyzing your prompt...</span>
              </div>
            )}
            {result && (
              <>
                <Alert>
                  <AlertTitle className="font-bold">Diagnosis</AlertTitle>
                  <AlertDescription>{result.analysis}</AlertDescription>
                </Alert>
                
                <Alert variant="default" className="border-green-500">
                  <AlertTitle className="font-bold text-green-700 dark:text-green-400">Suggestions</AlertTitle>
                  <AlertDescription>{result.suggestions}</AlertDescription>
                </Alert>

                {result.suggestedKeywords?.length > 0 && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">Suggested Keyword Expansions</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {result.suggestedKeywords.map(kw => <Badge key={kw} variant="secondary">{kw}</Badge>)}
                    </div>
                    <Button size="sm" onClick={handleAddSuggestedKeywords}>
                      <PlusCircle className="mr-2 h-4 w-4"/>
                      Add to Prompt
                    </Button>
                  </div>
                )}
                
                {result.suggestedNegativePrompts?.length > 0 && (
                   <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">Suggested Negative Prompts</h4>
                     <div className="flex flex-wrap gap-2 mb-3">
                       {result.suggestedNegativePrompts.map(kw => <Badge key={kw} variant="destructive">{kw}</Badge>)}
                    </div>
                    <Button size="sm" onClick={handleAddNegativeKeywords} variant="destructive">
                       <PlusCircle className="mr-2 h-4 w-4"/>
                       Add to Negative Prompt
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}