"use client";

import { useEffect, useState } from "react";
import { QuoteCard } from "@/components/quote-card";
import { supabase } from "@/lib/supabase";

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

interface FeaturedQuotesProps {
  selectedCategory?: string | null;
  searchQuery?: string;
}

export function FeaturedQuotes({ selectedCategory, searchQuery }: FeaturedQuotesProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        let query = supabase
          .from('quotes')
          .select(`
            *,
            quote_likes!left(user_id)!filter(user_id.eq.${session?.user?.id}),
            quote_bookmarks!left(user_id)!filter(user_id.eq.${session?.user?.id})
          `)
          .order('created_at', { ascending: false });

        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }

        const { data: quotes, error } = await query;

        if (error) throw error;

        const formattedQuotes = quotes.map(quote => ({
          ...quote,
          is_liked: quote.quote_likes?.length > 0,
          is_bookmarked: quote.quote_bookmarks?.length > 0
        }));

        setQuotes(formattedQuotes);
        setFilteredQuotes(formattedQuotes);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, [selectedCategory]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = quotes.filter(quote => 
        quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredQuotes(filtered);
    } else {
      setFilteredQuotes(quotes);
    }
  }, [searchQuery, quotes]);

  if (loading) {
    return (
      <section className="py-8">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (filteredQuotes.length === 0) {
    return (
      <div className="container px-4 md:px-6 py-8 text-center">
        <p className="text-muted-foreground">Aramanızla eşleşen söz bulunamadı.</p>
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
            />
          ))}
        </div>
      </div>
    </section>
  );
}