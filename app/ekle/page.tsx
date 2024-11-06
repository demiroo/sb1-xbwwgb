"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Quote as QuoteIcon } from "lucide-react";
import { categories } from "@/lib/categories";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  text: z.string()
    .min(10, "Söz en az 10 karakter olmalıdır")
    .max(500, "Söz en fazla 500 karakter olabilir"),
  author: z.string()
    .min(2, "Yazar adı en az 2 karakter olmalıdır")
    .max(100, "Yazar adı en fazla 100 karakter olabilir"),
  category: z.string().min(1, "Kategori seçmelisiniz"),
});

export default function AddQuote() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      author: "",
      category: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Söz eklemek için giriş yapmalısınız");
        return;
      }

      const { error } = await supabase
        .from("quotes")
        .insert({
          text: values.text.trim(),
          author: values.author.trim(),
          category: values.category,
          user_id: session.user.id,
        });

      if (error) throw error;

      toast.success("Söz başarıyla eklendi");
      router.push("/sozlerim");
    } catch (error) {
      console.error("Error adding quote:", error);
      toast.error("Söz eklenirken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCharCount(text.length);
    form.setValue("text", text);
  };

  const category = categories.find(c => c.slug === form.watch("category"));
  const gradientClass = category ? `from-${category.color.split("-")[1]}-500 to-${category.color.split("-")[1]}-600` : "from-gray-500 to-gray-600";

  return (
    <main className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Yeni Söz Ekle</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QuoteIcon className="h-5 w-5" />
                  Söz Detayları
                </CardTitle>
                <CardDescription>
                  Eklemek istediğiniz sözün detaylarını girin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Söz</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Sözünüzü buraya yazın..."
                            className={cn(
                              "min-h-[120px] resize-none pr-12",
                              "focus:ring-2 focus:ring-offset-2",
                              category && `focus:ring-${category.color.split("-")[1]}-500`
                            )}
                            {...field}
                            onChange={handleTextChange}
                          />
                          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                            {charCount}/500
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Eklemek istediğiniz sözü yazın
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yazar</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Sözün yazarı..." 
                            {...field}
                            className={cn(
                              "focus:ring-2 focus:ring-offset-2",
                              category && `focus:ring-${category.color.split("-")[1]}-500`
                            )}
                          />
                        </FormControl>
                        <FormDescription>
                          Sözün sahibinin adını yazın
                        </FormDescription>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={cn(
                              "focus:ring-2 focus:ring-offset-2",
                              category && `focus:ring-${category.color.split("-")[1]}-500`
                            )}>
                              <SelectValue placeholder="Bir kategori seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem 
                                key={category.slug} 
                                value={category.slug}
                                className="flex items-center gap-2"
                              >
                                <category.icon className={cn("h-4 w-4", category.color)} />
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Sözün hangi kategoriye ait olduğunu seçin
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "flex-1",
                  "bg-gradient-to-r",
                  gradientClass,
                  "hover:opacity-90"
                )}
              >
                {isSubmitting ? "Ekleniyor..." : "Sözü Ekle"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="flex-1"
              >
                İptal
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}