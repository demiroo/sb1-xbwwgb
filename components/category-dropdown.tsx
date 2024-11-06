"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryDropdownProps {
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

const categories = [
  { slug: "ask", name: "Aşk" },
  { slug: "dostluk", name: "Dostluk" },
  { slug: "hayat", name: "Hayat" },
  { slug: "basari", name: "Başarı" },
  { slug: "ataturk", name: "Atatürk" },
  { slug: "bilgelik", name: "Bilgelik" },
  { slug: "mutluluk", name: "Mutluluk" },
  { slug: "edebiyat", name: "Edebiyat" },
];

export function CategoryDropdown({ selectedCategory, onSelect }: CategoryDropdownProps) {
  return (
    <Select
      value={selectedCategory || "all"}
      onValueChange={(value) => onSelect(value === "all" ? null : value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Kategori" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Kategoriler</SelectLabel>
          <SelectItem value="all">Tümü</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.slug} value={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}