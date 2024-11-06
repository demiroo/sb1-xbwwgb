"use client";

import { useState } from "react";
import { Copy, Heart, Bookmark, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { QuoteActions } from "@/components/quote-actions";
import { CommentDrawer } from "@/components/comment-drawer";
import { supabase } from "@/lib/supabase";

interface QuoteCardProps {
  quote: {
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
  };
  className?: string;
  onQuoteUpdated?: () => void;
}

const categoryGradients: Record<string, string> = {
  ask: "from-rose-500 to-pink-500",
  dostluk: "from-blue-500 to-cyan-500",
  sadakat: "from-violet-500 to-purple-500",
  basari: "from-blue-500 to-cyan-500",
  hayat: "from-emerald-500 to-teal-500",
  vatan: "from-red-500 to-orange-500",
  ataturk: "from-yellow-500 to-amber-500",
  aile: "from-indigo-500 to-blue-500",
  bilgelik: "from-emerald-500 to-cyan-500",
  iletisim: "from-purple-500 to-pink-500",
  mutluluk: "from-orange-500 to-amber-500",
  edebiyat: "from-teal-500 to-green-500"
};

export function QuoteCard({ quote, className, onQuoteUpdated }: QuoteCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(quote.is_liked);
  const [isBookmarked, setIsBookmarked] = useState(quote.is_bookmarked);
  const [likesCount, setLikesCount] = useState(quote.likes_count);
  const [bookmarksCount, setBookmarksCount] = useState(quote.bookmarks_count);

  const gradientClass = categoryGradients[quote.category.toLowerCase()] || "from-gray-500 to-gray-600";
  const isOwner = session?.user?.id === quote.user_id;

  useState(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    }
    getSession();
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
      toast.success("Alıntı panoya kopyalandı!", {
        className: cn(
          "bg-gradient-to-r",
          gradientClass,
          "text-white"
        )
      });

      await supabase.rpc("increment_copies_count", {
        quote_id: quote.id
      });
    } catch (err) {
      toast.error("Kopyalama başarısız oldu");
    }
  };

  const handleLike = async () => {
    if (!session) {
      toast.error("Beğenmek için giriş yapmalısınız");
      return;
    }

    try {
      const { data, error } = await supabase.rpc("toggle_like", {
        p_quote_id: quote.id,
        p_user_id: session.user.id,
      });

      if (error) throw error;

      setIsLiked(data);
      setLikesCount(prev => data ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Bir hata oluştu");
    }
  };

  const handleBookmark = async () => {
    if (!session) {
      toast.error("Kaydetmek için giriş yapmalısınız");
      return;
    }

    try {
      const { data, error } = await supabase.rpc("toggle_bookmark", {
        p_quote_id: quote.id,
        p_user_id: session.user.id,
      });

      if (error) throw error;

      setIsBookmarked(data);
      setBookmarksCount(prev => data ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Bir hata oluştu");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        className={cn(
          "group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg",
          className
        )}
      >
        {isOwner && (
          <QuoteActions 
            quoteId={quote.id} 
            onQuoteUpdated={onQuoteUpdated} 
          />
        )}

        <div className="relative flex flex-col gap-4">
          <span className={cn(
            "w-fit rounded-full px-3 py-1 text-sm font-medium",
            "bg-gradient-to-r bg-clip-text text-transparent",
            gradientClass
          )}>
            {quote.category}
          </span>
          
          <blockquote className="text-lg font-medium leading-relaxed">
            "{quote.text}"
          </blockquote>
          
          <div className="mt-4 flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">— {quote.author}</p>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLike}
                  className={cn(
                    "h-8 w-8 sm:h-9 sm:w-9",
                    isLiked && "text-red-500",
                    "hover:bg-gradient-to-r",
                    gradientClass,
                    "hover:text-white"
                  )}
                >
                  <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", isLiked && "fill-current")} />
                </Button>
                <span className="text-xs sm:text-sm text-muted-foreground">{likesCount}</span>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmark}
                  className={cn(
                    "h-8 w-8 sm:h-9 sm:w-9",
                    isBookmarked && "text-yellow-500"
                  )}
                >
                  <Bookmark className={cn("h-4 w-4 sm:h-5 sm:w-5", isBookmarked && "fill-current")} />
                </Button>
                <span className="text-xs sm:text-sm text-muted-foreground">{bookmarksCount}</span>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowComments(true)}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                >
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <span className="text-xs sm:text-sm text-muted-foreground">{quote.comments_count}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <CommentDrawer
        quoteId={quote.id}
        open={showComments}
        onOpenChange={setShowComments}
      />
    </>
  );
}