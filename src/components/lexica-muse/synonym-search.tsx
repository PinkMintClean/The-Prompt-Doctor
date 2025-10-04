"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { explicitTermsForSynonymSearch } from "@/lib/data";
import type { SynonymResult } from "@/lib/types";
import { getSynonymsAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface SynonymSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  synonymResult: SynonymResult | null;
  setSynonymResult: (result: SynonymResult | null) => void;
}

export function SynonymSearch({
  searchTerm,
  setSearchTerm,
  setSynonymResult,
}: SynonymSearchProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSynonymResult(null);

    const lowerTerm = term.toLowerCase().trim();
    if (lowerTerm.length < 3) return;
    
    if (explicitTermsForSynonymSearch.includes(lowerTerm)) {
      startTransition(async () => {
        const result = await getSynonymsAction(lowerTerm);
        if (result.success && result.data) {
          setSynonymResult({ term: lowerTerm, synonyms: result.data });
        } else {
          toast({
            variant: "destructive",
            title: "Synonym Search Failed",
            description: result.error,
          });
        }
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyword Search & Synonym Finder</CardTitle>
        <CardDescription>
          Search the glossary for specific terms, or type a potentially flagged word to find safer alternatives.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-4 border text-lg focus:ring-accent focus:border-accent"
            placeholder="Search for keywords like 'pixie' or 'mesomorph'..."
            aria-label="Keyword Search and Synonym Finder"
          />
          {isPending && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}