"use client";

import { BodyMapper } from "./body-mapper";
import { PersonaPresets } from "./persona-presets";
import { RatioScaler } from "./ratio-scaler";
import { SomatotypeSelector } from "./somatotype-selector";

interface UtilityPanelsProps {
  ratios: Record<string, number>;
  setRatios: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onApplyPreset: (keywords: string[]) => void;
  selectedSomatotype: string;
  onSomatotypeSelect: (somatotype: string) => void;
}

export function UtilityPanels({
  ratios,
  setRatios,
  onApplyPreset,
  selectedSomatotype,
  onSomatotypeSelect,
}: UtilityPanelsProps) {
  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="space-y-8">
      <PersonaPresets onApplyPreset={onApplyPreset} />
      <BodyMapper onSectionClick={handleSectionClick} />
      <SomatotypeSelector selected={selectedSomatotype} onSelect={onSomatotypeSelect} />
      <RatioScaler ratios={ratios} setRatios={setRatios} />
    </section>
  );
}