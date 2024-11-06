"use client";

import { useEffect, useState } from "react";
import { QuoteCard } from "@/components/quote-card";
import { supabase } from "@/lib/supabase";
import { Loader } from "@/components/loader";

export default function MostBookmarkedQuotes() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMostBookmarkedQuotes() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const { data, error } = await supabase
          .from("quotes")
          .select(
            `
            *,
            quote_likes (user_id),
            quote_bookmarks (user_id)
          `
          )
          .eq("quote_likes.user_id", session?.user?.id)
          .eq("quote_bookmarks.user_id", session?.user?.id)
          .order("bookmarks_count", { ascending: false })
          .limit(50);

        if (error) throw error;

        const formattedQuotes = data.map((quote) => ({
          ...quote,
          is_liked: quote.quote_likes?.length > 0,
          is_bookmarked: quote.quote_bookmarks?.length > 0,
        }));

        setQuotes(formattedQuotes);
      } catch (error) {
        console.error("Error fetching most bookmarked quotes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMostBookmarkedQuotes();
  }, []);

  if (loading) return <Loader />;

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-8">En Çok Kaydedilen Sözler</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.map((quote) => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>
    </main>
  );
}
