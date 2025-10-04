"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortOrder } from "@/lib/types";
import { Dices } from "lucide-react";

interface FilterSortProps {
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  onRandomize: () => void;
}

export function FilterSort({
  sortOrder,
  setSortOrder,
  onRandomize,
}: FilterSortProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter &amp; Sort Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="sort-dropdown">Sort By:</Label>
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as SortOrder)}
            >
              <SelectTrigger id="sort-dropdown" className="w-full">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order">Anatomical Flow (Default)</SelectItem>
                <SelectItem value="alpha">Alphabetical (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Button
              onClick={onRandomize}
              className="w-full bg-indigo-500 hover:bg-indigo-600"
            >
              <Dices className="mr-2 h-4 w-4" />
              Random Character Generator
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}