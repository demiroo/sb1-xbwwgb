"use client";

import { useEffect, useState } from "react";
import { QuoteCard } from "@/components/quote-card";
import { supabase } from "@/lib/supabase";
import { Loader } from "@/components/loader";

export default function MostLikedQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMostLikedQuotes() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        const { data, error } = await supabase
          .from("quotes")
          .select(`
            *,
            quote_likes!left(user_id)!filter(user_id.eq.${session?.user?.id}),
            quote_bookmarks!left(user_id)!filter(user_id.eq.${session?.user?.id})
          `)
          .order("likes_count", { ascending: false })
          .limit(50);

        if (error) throw error;

        const formattedQuotes = data.map(quote => ({
          ...quote,
          is_liked: quote.quote_likes?.length > 0,
          is_bookmarked: quote.quote_bookmarks?.length > 0
        }));

        setQuotes(formattedQuotes);
      } catch (error) {
        console.error("Error fetching most liked quotes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMostLikedQuotes();
  }, []);

  if (loading) return <Loader />;

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-8">En Çok Beğenilen Sözler</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.map((quote) => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>
    </main>
  );
}