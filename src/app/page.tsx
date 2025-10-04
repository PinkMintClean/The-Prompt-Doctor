'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { GlossaryCategory, SortOrder, SynonymResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { glossaryData as initialGlossaryData } from '@/lib/data';

import { Header } from '@/components/lexica-muse/header';
import { FloatingIndex } from '@/components/lexica-muse/floating-index';
import { PromptBuilder } from '@/components/lexica-muse/prompt-builder';
import { SynonymSearch } from '@/components/lexica-muse/synonym-search';
import { FilterSort } from '@/components/lexica-muse/filter-sort';
import { GlossaryDisplay } from '@/components/lexica-muse/glossary-display';
import { UtilityPanels } from '@/components/lexica-muse/utility-panels';
import { LearningZone } from '@/components/lexica-muse/learning-zone';
import { PromptRephraser } from '@/components/lexica-muse/prompt-rephraser';
import { smartTooltips, ratioKeywordsData } from '@/lib/data';

export default function LexicaMusePage() {
  const [glossaryData, setGlossaryData] = useState<GlossaryCategory[]>(initialGlossaryData);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [autoRatioEnabled, setAutoRatioEnabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [synonymResult, setSynonymResult] = useState<SynonymResult | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('order');
  const [selectedSomatotype, setSelectedSomatotype] = useState<string>('');

  const { toast } = useToast();

  const handleToggleKeyword = useCallback((keyword: string) => {
    setSelectedKeywords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyword)) {
        newSet.delete(keyword);
      } else {
        newSet.add(keyword);
      }
      return newSet;
    });
  }, []);

  const handleSomatotypeSelect = useCallback((somatotype: string) => {
    setSelectedKeywords(prev => {
      const newSet = new Set(prev);
      const somatotypes = ['ectomorph', 'mesomorph', 'endomorph'];
      somatotypes.forEach(s => newSet.delete(s));
      newSet.add(somatotype);
      setSelectedSomatotype(somatotype);
      return newSet;
    });
  }, []);

  const handleClearPrompt = useCallback(() => {
    setSelectedKeywords(new Set());
    setNegativePrompt('');
    setRatios({});
    setSelectedSomatotype('');
    toast({ title: 'Prompt Cleared', description: 'All keywords, ratios, and negative prompts have been reset.' });
  }, [toast]);

  const handleCopyPrompt = useCallback(() => {
    let promptText = Array.from(selectedKeywords).join(', ');
    const ratioParts = Object.entries(ratios)
      .filter(([, value]) => value !== 1.0)
      .map(([part, value]) => `(${part}:${value.toFixed(1)})`);
    
    if (ratioParts.length > 0) {
      promptText += `, ${ratioParts.join(', ')}`;
    }
    
    let finalPrompt = promptText;
    if (negativePrompt) {
      finalPrompt += ` --no ${negativePrompt}`;
    }

    navigator.clipboard.writeText(finalPrompt);
    toast({ title: 'Prompt Copied!', description: 'Your custom prompt is now on your clipboard.' });
  }, [selectedKeywords, ratios, negativePrompt, toast]);

  const handleApplyPreset = useCallback((keywords: string[]) => {
    const somatotypes = ['ectomorph', 'mesomorph', 'endomorph'];
    setSelectedKeywords(prev => {
        const newSet = new Set(prev);
        // Clear existing somatotypes if the preset includes one
        if (keywords.some(k => somatotypes.includes(k))) {
            somatotypes.forEach(s => newSet.delete(s));
        }
        keywords.forEach(kw => newSet.add(kw));

        // Update selectedSomatotype state
        const presetSomatotype = keywords.find(k => somatotypes.includes(k));
        if (presetSomatotype) {
            setSelectedSomatotype(presetSomatotype);
        }

        return newSet;
    });
    toast({ title: 'Preset Applied!', description: `Added ${keywords.length} keywords to your prompt.` });
}, [toast]);


  const handleRandomize = useCallback(() => {
    const newKeywords = new Set<string>();
    const somatotypes = ['ectomorph', 'mesomorph', 'endomorph'];
    newKeywords.add(somatotypes[Math.floor(Math.random() * somatotypes.length)]);
    
    initialGlossaryData.forEach(category => {
        const subcategory = category.subcategories[Math.floor(Math.random() * category.subcategories.length)];
        const group = subcategory.groups[Math.floor(Math.random() * subcategory.groups.length)];
        if (group.keywords.length > 0) {
            const keyword = group.keywords[Math.floor(Math.random() * group.keywords.length)];
            newKeywords.add(keyword);
        }
    });

    setSelectedKeywords(newKeywords);
    handleSomatotypeSelect(newKeywords.values().next().value); // Set the selected somatotype
    toast({ title: "Character Randomized!", description: "A new set of random keywords has been selected." });
  }, [toast, handleSomatotypeSelect]);

  const handleAddKeywords = useCallback((keywords: string[]) => {
    setSelectedKeywords(prev => new Set([...prev, ...keywords]));
  }, []);

  const handleAddNegativeKeywords = useCallback((keywords: string[]) => {
    setNegativePrompt(prev => prev ? `${prev}, ${keywords.join(', ')}` : keywords.join(', '));
  }, []);

  const finalPrompt = useMemo(() => {
    const mainKeywords = Array.from(selectedKeywords);
    
    const activeRatioKeywords = new Set(
        Object.entries(ratios)
            .filter(([, value]) => value !== 1.0)
            .map(([part]) => part)
    );

    const ratioKeywordNames = new Set(Object.values(ratioKeywordsData));

    const keywordsWithRatios = mainKeywords.map(kw => {
        // Find if this keyword corresponds to a ratio part
        const ratioPart = Object.keys(ratioKeywordsData).find(key => ratioKeywordsData[key] === kw.toLowerCase());
        
        if (autoRatioEnabled && ratioPart && ratios[kw.toLowerCase()] && ratios[kw.toLowerCase()] !== 1.0) {
             return `(${kw}:${ratios[kw.toLowerCase()].toFixed(1)})`;
        }

        // If a keyword is a ratio keyword but its ratio is 1.0 (or not set), and auto-ratio is on,
        // it shouldn't be in the prompt with a ratio.
        if (autoRatioEnabled && ratioKeywordNames.has(kw.toLowerCase())) {
           return kw;
        }

        return kw;
    });

    const additionalRatios = autoRatioEnabled ? Object.entries(ratios)
      .filter(([part, value]) => value !== 1.0 && !mainKeywords.includes(part))
      .map(([part, value]) => {
          const capitalizedPart = Object.keys(ratioKeywordsData).find(k => ratioKeywordsData[k] === part) || part;
          return `(${capitalizedPart}:${value.toFixed(1)})`
      }) : [];
      
    return [...keywordsWithRatios, ...additionalRatios].join(', ');
  }, [selectedKeywords, ratios, autoRatioEnabled]);

  useEffect(() => {
    const sortedData = [...initialGlossaryData].map(category => ({
      ...category,
      subcategories: category.subcategories.map(sub => ({
        ...sub,
        groups: sub.groups.map(group => ({
          ...group,
          keywords: [...group.keywords].sort((a, b) => sortOrder === 'alpha' ? a.localeCompare(b) : 0),
        })),
      })),
    }));

    if (sortOrder === 'alpha') {
      sortedData.sort((a, b) => a.category.localeCompare(b.category));
    } else {
      sortedData.sort((a, b) => a.order - b.order);
    }
    setGlossaryData(sortedData);
  }, [sortOrder]);

  return (
    <div className="bg-background text-foreground font-body">
      <Header />
      <FloatingIndex glossaryData={glossaryData} />

      <main className="container mx-auto p-4 lg:p-8 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 lg:max-w-7xl lg:pl-72">
        
        {/* Main Content */}
        <div className="flex flex-col gap-8">
          <PromptBuilder
            prompt={finalPrompt}
            negativePrompt={negativePrompt}
            setNegativePrompt={setNegativePrompt}
            autoRatioEnabled={autoRatioEnabled}
            setAutoRatioEnabled={setAutoRatioEnabled}
            onCopy={handleCopyPrompt}
            onClear={handleClearPrompt}
            onAddKeywords={handleAddKeywords}
            onAddNegativeKeywords={handleAddNegativeKeywords}
          />

          <div className="space-y-8">
             <SynonymSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                synonymResult={synonymResult}
                setSynonymResult={setSynonymResult}
              />

              <FilterSort 
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                onRandomize={handleRandomize}
              />
          </div>

          <GlossaryDisplay
            glossaryData={glossaryData}
            searchTerm={searchTerm}
            synonymResult={synonymResult}
            selectedKeywords={selectedKeywords}
            onToggleKeyword={handleToggleKeyword}
            tooltips={smartTooltips}
          />

          <LearningZone onApplyPreset={handleApplyPreset} />

          <PromptRephraser />

        </div>

        {/* Right Sidebar */}
        <aside className="hidden lg:block lg:sticky top-24 space-y-8">
          <UtilityPanels
            ratios={ratios}
            setRatios={setRatios}
            onApplyPreset={handleApplyPreset}
            selectedSomatotype={selectedSomatotype}
            onSomatotypeSelect={handleSomatotypeSelect}
          />
        </aside>

      </main>
    </div>
  );
}