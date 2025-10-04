"use client";

import React from "react";
import type { GlossaryCategory } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

interface FloatingIndexProps {
  glossaryData: GlossaryCategory[];
}

export function FloatingIndex({ glossaryData }: FloatingIndexProps) {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const sortedData = [...glossaryData].sort((a, b) => a.order - b.order);

  return (
    <div className="hidden lg:block fixed top-24 left-[max(24px,calc(50%-44rem))] w-64 h-[calc(100vh-6rem)]">
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Glossary Index</CardTitle>
                <ThemeToggle />
            </CardHeader>
            <CardContent className="overflow-y-auto flex-grow">
                <nav className="space-y-2">
                {sortedData.map((category) => {
                    const categoryId = category.category.replace(/[^a-zA-Z0-9]/g, "-");
                    return (
                    <a
                        key={categoryId}
                        href={`#${categoryId}`}
                        onClick={(e) => handleScroll(e, categoryId)}
                        className="block py-1 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors truncate"
                    >
                        {category.category}
                    </a>
                    );
                })}
                </nav>
            </CardContent>
        </Card>
    </div>
  );
}