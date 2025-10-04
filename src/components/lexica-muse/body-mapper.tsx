"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BodyMapperProps {
  onSectionClick: (sectionId: string) => void;
  className?: string;
}

export function BodyMapper({ onSectionClick, className }: BodyMapperProps) {
  const sections = [
    { id: "hair-styling", label: "Hair & Styling" },
    { id: "facial-features", label: "Facial Features" },
    { id: "upper-body", label: "Upper Body" },
    { id: "lower-body", label: "Lower Body" },
  ];

  return (
    <div className={cn("p-4 bg-muted/50 rounded-lg", className)}>
      <h3 className="text-lg font-semibold mb-4 text-center">Body Section Navigator</h3>
      <div className="grid grid-cols-2 gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionClick(section.id.replace(/[^a-zA-Z0-9]/g, "-"))}
            className="p-3 bg-background hover:bg-accent hover:text-accent-foreground rounded-md shadow-sm transition-colors text-sm font-medium"
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
}