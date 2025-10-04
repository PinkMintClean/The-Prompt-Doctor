"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ratioKeywordsData } from "@/lib/data";
import { Minus, Plus } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface RatioScalerProps {
  ratios: Record<string, number>;
  setRatios: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const getRatioFeedback = (part: string, value: number): string => {
  const isBodyPart = ["glutes", "thighs", "hips", "waist", "bust", "shoulders", "arms", "legs", "feet"].includes(part);

  if (isBodyPart) {
    if (value < 0.8) return "Very Small / Slender";
    if (value < 1.0) return "Small / Petite";
    if (value === 1.0) return "Default / Average";
    if (value <= 1.2) return "Medium / Full";
    if (value <= 1.5) return "Large / Voluminous";
    return "Very Large / Exaggerated";
  }

  // For facial features
  if (value < 0.9) return "Subtle / Delicate";
  if (value === 1.0) return "Default / Balanced";
  if (value > 1.1) return "Prominent / Defined";
  return "Default";
};


export function RatioScaler({ ratios, setRatios }: RatioScalerProps) {
  const adjustRatio = (part: string, delta: number) => {
    setRatios((prevRatios) => ({
      ...prevRatios,
      [part]: Math.max(0.1, +((prevRatios[part] || 1.0) + delta).toFixed(1)),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Proportion Visualizer &amp; Ratio Scaling</CardTitle>
        <CardDescription>
          Adjust values to emphasize features. Value is injected as (keyword:ratio). **(Default: 1.0)**
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(ratioKeywordsData).map(([name, part]) => (
            <TooltipProvider key={part}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="bg-muted p-3 rounded-lg text-center border"
                  >
                    <h4 className="font-bold text-sm mb-1">{name}</h4>
                    <div className="text-md font-mono text-accent mb-2">
                      {(ratios[part] || 1.0).toFixed(1)}
                    </div>
                    <div className="flex justify-center space-x-1">
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-6 w-6"
                        onClick={() => adjustRatio(part, -0.1)}
                        aria-label={`Decrease ${name} ratio`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="default"
                        className="h-6 w-6"
                        onClick={() => adjustRatio(part, 0.1)}
                        aria-label={`Increase ${name} ratio`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getRatioFeedback(part, ratios[part] || 1.0)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}