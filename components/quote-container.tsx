"use client";

import { useState, useEffect } from "react";
import { QuoteCard } from "@/components/quote-card";
import { Search } from "@/components/search";
import { Loader } from "@/components/loader";
import { EmptyState } from "@/components/empty-state";

interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  user_id: string;
  likes_count: number;
  bookmarks_count: number;
  comments_count: number;
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

interface QuoteContainerProps {
  quotes: Quote[];
  loading: boolean;
  initialCategory?: string | null;
  onLike?: (quoteId: string) => Promise<void>;
  onBookmark?: (quoteId: string) => Promise<void>;
  onQuoteUpdated?: () => void;
}

export function QuoteContainer({ 
  quotes, 
  loading, 
  initialCategory,
  onLike,
  onBookmark,
  onQuoteUpdated
}: QuoteContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);

  useEffect(() => {
    if (initialCategory !== undefined) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch = 
      quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || quote.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container py-8">
        <div className="mx-auto max-w-2xl mb-8">
          <div className="h-10 bg-muted rounded-md animate-pulse" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl mb-8">
        <Search 
          value={searchQuery} 
          onChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      </div>

      {filteredQuotes.length === 0 ? (
        <EmptyState
          title="Sonuç bulunamadı"
          description={
            searchQuery || selectedCategory
              ? "Arama kriterlerinize uygun söz bulunamadı. Lütfen farklı bir arama yapmayı deneyin."
              : "Henüz hiç söz eklenmemiş."
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQuotes.map((quote) => (
            <QuoteCard 
              key={quote.id} 
              quote={quote}
              onLike={onLike}
              onBookmark={onBookmark}
              onQuoteUpdated={onQuoteUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}