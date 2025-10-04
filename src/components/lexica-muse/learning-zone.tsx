"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Code } from "lucide-react";

interface LearningZoneProps {
  onApplyPreset: (keywords: string[]) => void;
}

const examples = [
    {
        title: "Example 1: The Johnny Bravo Look",
        prompt: "mesomorph, broad shoulders, massive traps, (bulky arms:1.5), (slim legs:0.5), pompadour, blue eyes, [dynamic pose], [photorealistic]",
        keywords: ['mesomorph', 'broad shoulders', 'massive traps', 'bulky arms', 'slim legs', 'pompadour', 'blue eyes', 'dynamic pose', 'photorealistic']
    },
    {
        title: "Example 2: Diverse Character (Dialysis Patient)",
        prompt: "endomorph, full figure, dialysis access site (fistula/graft), slim neck, soft skin, African heritage, deep skin tone, [natural light], [close-up]",
        keywords: ['endomorph', 'full figure', 'dialysis access site (fistula/graft)', 'slim neck', 'soft skin', 'African heritage', 'deep skin tone', 'natural light', 'close-up']
    }
]

export function LearningZone({ onApplyPreset }: LearningZoneProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning &amp; Engagement Zone</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-semibold">
              Interactive Example Prompts
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-6">
                {examples.map(ex => (
                    <div key={ex.title} className="space-y-2 p-4 border rounded-lg">
                        <h4 className="font-bold">{ex.title}</h4>
                        <p className="font-mono text-sm bg-muted p-3 rounded-md text-muted-foreground">{ex.prompt}</p>
                        <Button variant="link" size="sm" onClick={() => onApplyPreset(ex.keywords)} className="p-0 h-auto">
                            <Code className="mr-2 h-4 w-4" />
                            Click to load this prompt
                        </Button>
                    </div>
                ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xl font-semibold">
              Feedback &amp; Contributions (Future Features)
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                To implement **User Contributions**, **Feedback Mechanism**, or **Accurate Token Estimation**, a secure **Backend API** and database (like Firebase) are required. The integrity of our vast glossary depends on this security layer, which is part of the future roadmap!
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}