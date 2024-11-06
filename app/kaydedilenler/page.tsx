"use client";

import { useEffect, useState } from "react";
import { QuoteCard } from "@/components/quote-card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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

// Define props interface for QuoteCard component
interface QuoteCardProps {
  quote: Quote;
  onLike: (quoteId: string) => Promise<void>;
  onBookmark: (quoteId: string) => Promise<void>;
}

export default function BookmarksPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/giris");
      return;
    }

    async function fetchBookmarkedQuotes() {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from("quotes")
          .select(
            `
            *,
            quote_likes (user_id),
            quote_bookmarks (user_id)
          `
          )
          .eq("quote_likes.user_id", user.id)
          .eq("quote_bookmarks.user_id", user.id)
          .not("quote_bookmarks", "is", null)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const formattedQuotes = data.map((quote) => ({
          ...quote,
          is_liked: quote.quote_likes?.length > 0,
          is_bookmarked: true,
        }));

        setQuotes(formattedQuotes);
      } catch (error) {
        console.error("Error fetching bookmarked quotes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarkedQuotes();
  }, [user, router]);

  const handleLike = async (quoteId: string): Promise<void> => {
    try {
      const { data: result } = await supabase.rpc("toggle_like", {
        p_quote_id: quoteId,
        p_user_id: user?.id,
      });

      setQuotes(
        quotes.map((quote) => {
          if (quote.id === quoteId) {
            return {
              ...quote,
              is_liked: result,
              likes_count: result
                ? quote.likes_count + 1
                : quote.likes_count - 1,
            };
          }
          return quote;
        })
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleBookmark = async (quoteId: string): Promise<void> => {
    try {
      const { data: result } = await supabase.rpc("toggle_bookmark", {
        p_quote_id: quoteId,
        p_user_id: user?.id,
      });

      if (!result) {
        setQuotes(quotes.filter((quote) => quote.id !== quoteId));
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Kaydedilenler</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Kaydedilenler</h1>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookmarkIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Henüz kaydettiğiniz söz yok
          </h2>
          <p className="text-muted-foreground mb-4">
            Beğendiğiniz sözleri kaydedin ve daha sonra tekrar okuyun
          </p>
          <Button onClick={() => router.push("/")} variant="outline">
            Sözlere Göz At
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Kaydedilenler</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            
           
          />
        ))}
      </div>
    </div>
  );
}
