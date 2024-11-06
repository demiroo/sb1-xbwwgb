"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_profile: UserProfile;
}

interface CommentDrawerProps {
  quoteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommentDrawer({
  quoteId,
  open,
  onOpenChange,
}: CommentDrawerProps) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select(
          `
          id,
          content,
          created_at,
          user_id,
          user_profiles (
            id,
            username,
            full_name,
            avatar_url
          )
        `
        )
        .eq("quote_id", quoteId)
        .order("created_at", { ascending: false });

      if (commentsError) throw commentsError;

      const formattedComments: Comment[] = (commentsData || []).map(
        (comment) => ({
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          user_id: comment.user_id,
          user_profile: comment.user_profiles as unknown as UserProfile,
        })
      );

      setComments(formattedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Yorumlar yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && quoteId) {
      fetchComments();
    }
  }, [open, quoteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setIsSubmitting(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Yorum yapmak için giriş yapmalısınız");
        return;
      }

      const { error: insertError } = await supabase.from("comments").insert({
        quote_id: quoteId,
        user_id: session.user.id,
        content: comment.trim(),
      });

      if (insertError) throw insertError;

      toast.success("Yorumunuz eklendi");
      setComment("");
      await fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Yorum eklenirken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (profile: UserProfile) => {
    if (profile.full_name) return profile.full_name[0].toUpperCase();
    if (profile.username) return profile.username[0].toUpperCase();
    return "?";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] sm:h-[600px]">
        <SheetHeader className="mb-4">
          <SheetTitle>Yorumlar</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <form onSubmit={handleSubmit} className="space-y-4 mb-4">
            <Textarea
              placeholder="Yorumunuzu yazın..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <Button type="submit" disabled={isSubmitting || !comment.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                "Gönder"
              )}
            </Button>
          </form>

          <Separator className="my-4" />

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              Henüz yorum yapılmamış
            </div>
          ) : (
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={comment.user_profile?.avatar_url || undefined}
                      />
                      <AvatarFallback>
                        {getInitials(comment.user_profile)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {comment.user_profile?.full_name ||
                            comment.user_profile?.username ||
                            "Anonim"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                            locale: tr,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
