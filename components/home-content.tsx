"use client";

import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { FeaturedQuotes } from "@/components/featured-quotes";
import { Footer } from "@/components/footer";

export function HomeContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <main>
      <HeroSection 
        onCategorySelect={handleCategorySelect} 
        onSearch={handleSearch}
      />
      <FeaturedQuotes 
        selectedCategory={selectedCategory} 
        searchQuery={searchQuery}
      />
      <Footer />
    </main>
  );
}