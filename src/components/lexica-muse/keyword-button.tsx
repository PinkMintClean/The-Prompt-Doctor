"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface KeywordButtonProps {
  keyword: string;
  isSelected: boolean;
  onToggle: (keyword: string) => void;
  tooltipText?: string;
}

export function KeywordButton({
  keyword,
  isSelected,
  onToggle,
  tooltipText,
}: KeywordButtonProps) {
  const content = (
    <Button
      variant={isSelected ? "default" : "secondary"}
      onClick={() => onToggle(keyword)}
      className={cn(
        "w-full h-auto py-3 text-sm font-medium shadow-sm truncate transition-all duration-200 transform hover:scale-105",
        isSelected && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
      aria-pressed={isSelected}
    >
      {keyword}
    </Button>
  );

  const tooltipContent = tooltipText || `Keyword: ${keyword}. Click to add to prompt.`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}