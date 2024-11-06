import { Heart, Users, Leaf, Trophy, Star, Book, Smile, Feather } from "lucide-react";

export const categories = [
  { name: "Aşk", slug: "ask", icon: Heart, color: "text-rose-500", description: "Aşk üzerine söylenmiş en güzel sözler" },
  { name: "Dostluk", slug: "dostluk", icon: Users, color: "text-blue-500", description: "Dostluğun değerini anlatan özlü sözler" },
  { name: "Hayat", slug: "hayat", icon: Leaf, color: "text-green-500", description: "Hayata dair düşündüren sözler" },
  { name: "Başarı", slug: "basari", icon: Trophy, color: "text-yellow-500", description: "Başarıya ilham veren sözler" },
  { name: "Atatürk", slug: "ataturk", icon: Star, color: "text-red-500", description: "Atatürk'ün unutulmaz sözleri" },
  { name: "Bilgelik", slug: "bilgelik", icon: Book, color: "text-purple-500", description: "Bilge kişilerden öğütler" },
  { name: "Mutluluk", slug: "mutluluk", icon: Smile, color: "text-orange-500", description: "Mutluluğun sırrını anlatan sözler" },
  { name: "Edebiyat", slug: "edebiyat", icon: Feather, color: "text-indigo-500", description: "Edebi değeri olan alıntılar" },
] as const;