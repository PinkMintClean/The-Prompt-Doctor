"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SomatotypeSelectorProps {
  selected: string;
  onSelect: (somatotype: string) => void;
}

const somatotypes = ["ectomorph", "mesomorph", "endomorph"];

export function SomatotypeSelector({ selected, onSelect }: SomatotypeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Body Type Selector (Somatotype)</CardTitle>
        <CardDescription>Select the foundational body shape (Mutually Exclusive).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {somatotypes.map((type) => (
            <Button
              key={type}
              onClick={() => onSelect(type)}
              variant={selected === type ? "default" : "secondary"}
              className={cn(
                "py-3 px-4 transition-colors",
                selected === type && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
              aria-pressed={selected === type}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}