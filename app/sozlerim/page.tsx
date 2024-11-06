"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { QuoteCard } from "@/components/quote-card";
import { EmptyState } from "@/components/empty-state";
import { Loader } from "@/components/loader";

export default function MyQuotes() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from("quotes")
          .select(`
            *,
            user_profiles!quotes_user_id_fkey (username, avatar_url)
          `)
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setQuotes(data || []);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Sözlerim</h1>
      {quotes.length === 0 ? (
        <EmptyState
          title="Henüz hiç sözünüz yok"
          description="Yeni bir söz ekleyerek başlayın"
          action={{
            label: "Söz Ekle",
            href: "/ekle"
          }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map((quote) => (
            <QuoteCard 
              key={quote.id} 
              quote={quote} 
              onDelete={() => {
                setQuotes(quotes.filter(q => q.id !== quote.id));
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}