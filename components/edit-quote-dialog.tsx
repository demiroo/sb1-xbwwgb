"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const formSchema = z.object({
  text: z.string().min(1, "Alıntı metni gereklidir"),
  author: z.string().min(1, "Yazar adı gereklidir"),
  category: z.string().min(1, "Kategori seçimi gereklidir"),
});

interface EditQuoteDialogProps {
  quote?: {
    id: string;
    text: string;
    author: string;
    category: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuoteUpdated?: () => void;
}

export function EditQuoteDialog({
  quote,
  open,
  onOpenChange,
  onQuoteUpdated,
}: EditQuoteDialogProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      author: "",
      category: "",
    },
  });

  useEffect(() => {
    if (quote) {
      form.reset({
        text: quote.text,
        author: quote.author,
        category: quote.category,
      });
    }
  }, [quote, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!quote?.id) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from("quotes")
        .update({
          text: values.text,
          author: values.author,
          category: values.category,
          updated_at: new Date().toISOString(),
        })
        .eq("id", quote.id);

      if (error) throw error;

      toast.success("Alıntı başarıyla güncellendi");
      onOpenChange(false);
      if (onQuoteUpdated) onQuoteUpdated();
    } catch (error) {
      console.error("Error updating quote:", error);
      toast.error("Alıntı güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (!quote) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alıntıyı Düzenle</DialogTitle>
          <DialogDescription>
            Alıntı bilgilerini güncelleyebilirsiniz.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alıntı</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Alıntı metnini girin"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yazar</FormLabel>
                  <FormControl>
                    <Input placeholder="Yazar adını girin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ask">Aşk</SelectItem>
                      <SelectItem value="dostluk">Dostluk</SelectItem>
                      <SelectItem value="hayat">Hayat</SelectItem>
                      <SelectItem value="basari">Başarı</SelectItem>
                      <SelectItem value="ataturk">Atatürk</SelectItem>
                      <SelectItem value="bilgelik">Bilgelik</SelectItem>
                      <SelectItem value="mutluluk">Mutluluk</SelectItem>
                      <SelectItem value="edebiyat">Edebiyat</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Güncelleniyor..." : "Güncelle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}