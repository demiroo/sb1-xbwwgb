"use client";

import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategoryDropdown } from "@/components/category-dropdown";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function Search({ value, onChange, selectedCategory, onCategorySelect }: SearchProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Alıntı veya yazar ara..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <CategoryDropdown 
        selectedCategory={selectedCategory} 
        onSelect={onCategorySelect} 
      />
    </div>
  );
}