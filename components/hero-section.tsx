"use client";

import { useState } from "react";
import { Search } from "@/components/search";
import { AnimatedWordCloud } from "@/components/animated-word-cloud";

interface HeroSectionProps {
  onCategorySelect: (category: string) => void;
  onSearch: (query: string) => void;
}

export function HeroSection({ onCategorySelect, onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      onCategorySelect(category);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <section className="w-full pt-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Binlerce özlü söz, alıntı ve atasözü arasında arama yapın, favori sözlerinizi kaydedin ve paylaşın.
            </p>
          </div>
          <div className="w-full max-w-2xl">
            <Search
              value={searchQuery}
              onChange={handleSearch}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </div>
          <AnimatedWordCloud onCategorySelect={onCategorySelect} />
        </div>
      </div>
    </section>
  );
}