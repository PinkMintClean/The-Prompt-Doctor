"use client";

import type { GlossaryCategory, SynonymResult } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeywordButton } from "./keyword-button";
import React, { useMemo } from "react";

interface GlossaryDisplayProps {
  glossaryData: GlossaryCategory[];
  searchTerm: string;
  synonymResult: SynonymResult | null;
  selectedKeywords: Set<string>;
  onToggleKeyword: (keyword: string) => void;
  tooltips: Record<string, string>;
}

export function GlossaryDisplay({
  glossaryData,
  searchTerm,
  synonymResult,
  selectedKeywords,
  onToggleKeyword,
  tooltips,
}: GlossaryDisplayProps) {

  const allKeywords = useMemo(() => {
    const keywords: string[] = [];
    glossaryData.forEach(cat => cat.subcategories.forEach(sub => sub.groups.forEach(group => keywords.push(...group.keywords))));
    return Array.from(new Set(keywords));
  }, [glossaryData]);

  if (synonymResult) {
    return (
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400">
        <CardHeader>
          <CardTitle className="text-yellow-800 dark:text-yellow-300">
            🚨 Safety Filter: Synonym Suggestions
          </CardTitle>
          <CardDescription className="text-yellow-700 dark:text-yellow-400">
            The term &quot;{synonymResult.term}&quot; may be flagged. Consider these safer alternatives:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {synonymResult.synonyms.map((keyword) => (
              <KeywordButton
                key={keyword}
                keyword={keyword}
                isSelected={selectedKeywords.has(keyword)}
                onToggle={onToggleKeyword}
                tooltipText={tooltips[keyword]}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (searchTerm.trim()) {
    const filteredKeywords = allKeywords.filter(kw => kw.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
       <Card>
        <CardHeader>
          <CardTitle>Search Results for &quot;{searchTerm}&quot;</CardTitle>
          <CardDescription>{filteredKeywords.length} keywords found.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredKeywords.map((keyword) => (
              <KeywordButton
                key={keyword}
                keyword={keyword}
                isSelected={selectedKeywords.has(keyword)}
                onToggle={onToggleKeyword}
                tooltipText={tooltips[keyword]}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section id="glossary-container" className="space-y-10" aria-labelledby="glossary-content-heading">
      <h2 id="glossary-content-heading" className="sr-only">Glossary Content</h2>
      {glossaryData.map((category) => (
        <Card key={category.category} id={category.category.replace(/[^a-zA-Z0-9]/g, "-")}>
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-primary">{category.category}</CardTitle>
            <CardDescription className="text-base">{category.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {category.subcategories.map((sub) => (
              <Card key={sub.name} className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-xl">{sub.name}</CardTitle>
                   {sub.description && <CardDescription className="text-sm !mt-2">{sub.description}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-4">
                  {sub.groups.map((group) => (
                    <div key={group.group}>
                      <h4 className="text-lg font-medium mb-3 text-accent-foreground">{group.group}</h4>
                       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {group.keywords.map((keyword) => (
                          <KeywordButton
                            key={keyword}
                            keyword={keyword}
                            isSelected={selectedKeywords.has(keyword)}
                            onToggle={onToggleKeyword}
                            tooltipText={tooltips[keyword]}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}