"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useQuotes } from "@/hooks/use-quotes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { QuoteCard } from "@/components/quote-card";
import { Heart, Bookmark, Quote } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, loading: profileLoading, refetch: refetchProfile } = useProfile();
  const { quotes: userQuotes, loading: userQuotesLoading, toggleLike: handleLike, toggleBookmark: handleBookmark } = useQuotes();
  const { quotes: likedQuotes, loading: likedQuotesLoading } = useQuotes('liked');
  const { quotes: bookmarkedQuotes, loading: bookmarkedQuotesLoading } = useQuotes('bookmarked');
  const [activeTab, setActiveTab] = useState("quotes");

  const loading = profileLoading || userQuotesLoading || likedQuotesLoading || bookmarkedQuotesLoading;

  // Filter user's own quotes
  const myQuotes = userQuotes.filter(quote => quote.user_id === user?.id);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Profil</h1>
        <p className="text-muted-foreground">
          Profilinizi görüntülemek için lütfen giriş yapın.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-muted"></div>
            <div className="space-y-2 text-center md:text-left">
              <div className="h-6 w-48 bg-muted rounded"></div>
              <div className="h-4 w-32 bg-muted rounded"></div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback>
              {profile?.full_name?.[0] || user.email?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">
              {profile?.full_name || profile?.username || user.email?.split('@')[0]}
            </h1>
            <p className="text-muted-foreground">
              {user.email}
            </p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2">
                <Quote className="h-4 w-4" />
                <span>{myQuotes.length} Alıntı</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{likedQuotes.length} Beğeni</span>
              </div>
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                <span>{bookmarkedQuotes.length} Kayıt</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" asChild>
              <Link href="/profil/duzenle">Profili Düzenle</Link>
            </Button>
          </div>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-6"
      >
        <TabsList className="w-full justify-start">
          <TabsTrigger value="quotes" className="flex items-center gap-2">
            <Quote className="h-4 w-4" />
            Alıntılar ({myQuotes.length})
          </TabsTrigger>
          <TabsTrigger value="liked" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Beğenilenler ({likedQuotes.length})
          </TabsTrigger>
          <TabsTrigger value="bookmarked" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Kaydedilenler ({bookmarkedQuotes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">
          {myQuotes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Henüz paylaştığınız bir alıntı bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myQuotes.map((quote) => (
                <QuoteCard 
                  key={quote.id} 
                  quote={quote} 
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="liked">
          {likedQuotes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Henüz beğendiğiniz bir alıntı bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {likedQuotes.map((quote) => (
                <QuoteCard 
                  key={quote.id} 
                  quote={quote} 
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookmarked">
          {bookmarkedQuotes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Henüz kaydettiğiniz bir alıntı bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookmarkedQuotes.map((quote) => (
                <QuoteCard 
                  key={quote.id} 
                  quote={quote} 
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}