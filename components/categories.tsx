"use client";

import { useRouter } from "next/navigation";
import { Book, Heart, Users, Leaf, Trophy, Star, Smile, Feather } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Aşk", slug: "ask", icon: Heart, color: "text-rose-500", description: "Aşk üzerine söylenmiş en güzel sözler" },
  { name: "Dostluk", slug: "dostluk", icon: Users, color: "text-blue-500", description: "Dostluğun değerini anlatan özlü sözler" },
  { name: "Hayat", slug: "hayat", icon: Leaf, color: "text-green-500", description: "Hayata dair düşündüren sözler" },
  { name: "Başarı", slug: "basari", icon: Trophy, color: "text-yellow-500", description: "Başarıya ilham veren sözler" },
  { name: "Atatürk", slug: "ataturk", icon: Star, color: "text-red-500", description: "Atatürk'ün unutulmaz sözleri" },
  { name: "Bilgelik", slug: "bilgelik", icon: Book, color: "text-purple-500", description: "Bilge kişilerden öğütler" },
  { name: "Mutluluk", slug: "mutluluk", icon: Smile, color: "text-orange-500", description: "Mutluluğun sırrını anlatan sözler" },
  { name: "Edebiyat", slug: "edebiyat", icon: Feather, color: "text-indigo-500", description: "Edebi değeri olan alıntılar" },
];

export function Categories() {
  const router = useRouter();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Kategoriler</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              İlgi alanınıza göre sözleri keşfedin
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.slug} 
                className="group cursor-pointer transition-colors hover:border-primary"
                onClick={() => router.push(`/kategori/${category.slug}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className={cn("h-5 w-5", category.color)} />
                    {category.name}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Keşfet →
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}