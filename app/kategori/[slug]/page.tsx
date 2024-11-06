"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { QuoteContainer } from "@/components/quote-container";
import { categories } from "@/lib/categories";

export default function CategoryPage() {
  const params = useParams();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const category = categories.find((c) => c.slug === params.slug);

  useEffect(() => {
    async function fetchQuotes() {
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
          .eq("category", params.slug)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const formattedQuotes = data.map((quote) => ({
          ...quote,
          is_liked: quote.quote_likes?.length > 0,
          is_bookmarked: quote.quote_bookmarks?.length > 0,
        }));

        setQuotes(formattedQuotes);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, [params.slug]);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{category?.name || "Kategori"}</h1>
        <p className="text-muted-foreground mt-2">{category?.description}</p>
      </div>
      <QuoteContainer
        quotes={quotes}
        loading={loading}
        initialCategory={params.slug as string}
      />
    </div>
  );
}
