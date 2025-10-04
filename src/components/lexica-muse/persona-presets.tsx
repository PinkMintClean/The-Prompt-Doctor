"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { presetsData } from "@/lib/data";
import { Sparkles } from "lucide-react";

interface PersonaPresetsProps {
  onApplyPreset: (keywords: string[]) => void;
}

export function PersonaPresets({ onApplyPreset }: PersonaPresetsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Persona Presets</CardTitle>
        <CardDescription>Click a preset to instantly add a foundational set of keywords.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {presetsData.map((preset) => (
            <Button
              key={preset.name}
              onClick={() => onApplyPreset(preset.keywords)}
              variant="outline"
              className="bg-green-500 text-white hover:bg-green-600 hover:text-white"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {preset.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}