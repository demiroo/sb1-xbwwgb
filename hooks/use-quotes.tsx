"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export interface Quote {
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

export function useQuotes(filter?: 'bookmarked' | 'liked') {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from("quotes")
        .select(`
          *,
          quote_likes (
            user_id
          ),
          quote_bookmarks (
            user_id
          )
        `);

      if (filter === 'bookmarked' && user) {
        query = query.eq('quote_bookmarks.user_id', user.id);
      } else if (filter === 'liked' && user) {
        query = query.eq('quote_likes.user_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (!data) {
        setQuotes([]);
        return;
      }

      const formattedQuotes = data.map(quote => ({
        ...quote,
        is_liked: quote.quote_likes?.some(like => like.user_id === user?.id) ?? false,
        is_bookmarked: quote.quote_bookmarks?.some(bookmark => bookmark.user_id === user?.id) ?? false,
        quote_likes: undefined,
        quote_bookmarks: undefined
      }));

      setQuotes(formattedQuotes);
    } catch (error: any) {
      console.error("Error fetching quotes:", error);
      toast.error("Alıntılar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();

    const channel = supabase
      .channel('quotes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quotes'
        },
        fetchQuotes
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_likes'
        },
        fetchQuotes
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_bookmarks'
        },
        fetchQuotes
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, filter]);

  const toggleLike = async (quoteId: string) => {
    if (!user) {
      toast.error("Beğenmek için giriş yapmalısınız");
      return;
    }

    try {
      const { data: result, error } = await supabase.rpc("toggle_like", {
        p_quote_id: quoteId,
        p_user_id: user.id
      });

      if (error) throw error;

      setQuotes(quotes.map(quote => {
        if (quote.id === quoteId) {
          return {
            ...quote,
            is_liked: result,
            likes_count: result ? quote.likes_count + 1 : quote.likes_count - 1
          };
        }
        return quote;
      }));

      await fetchQuotes();
    } catch (error: any) {
      console.error("Error toggling like:", error);
      toast.error("Beğeni işlemi başarısız oldu");
    }
  };

  const toggleBookmark = async (quoteId: string) => {
    if (!user) {
      toast.error("Kaydetmek için giriş yapmalısınız");
      return;
    }

    try {
      const { data: result, error } = await supabase.rpc("toggle_bookmark", {
        p_quote_id: quoteId,
        p_user_id: user.id
      });

      if (error) throw error;

      setQuotes(quotes.map(quote => {
        if (quote.id === quoteId) {
          return {
            ...quote,
            is_bookmarked: result,
            bookmarks_count: result ? quote.bookmarks_count + 1 : quote.bookmarks_count - 1
          };
        }
        return quote;
      }));

      await fetchQuotes();
    } catch (error: any) {
      console.error("Error toggling bookmark:", error);
      toast.error("Kaydetme işlemi başarısız oldu");
    }
  };

  return {
    quotes,
    loading,
    toggleLike,
    toggleBookmark,
    refetch: fetchQuotes
  };
}