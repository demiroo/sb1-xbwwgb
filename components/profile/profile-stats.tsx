"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote, Heart, Bookmark, MessageSquare } from "lucide-react";

interface ProfileStatsProps {
  profile: any;
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  const stats = [
    {
      title: "Toplam Söz",
      value: profile?.total_quotes || 0,
      icon: Quote,
    },
    {
      title: "Toplam Beğeni",
      value: profile?.total_likes || 0,
      icon: Heart,
    },
    {
      title: "Kaydedilenler",
      value: profile?.total_bookmarks || 0,
      icon: Bookmark,
    },
    {
      title: "Yorumlar",
      value: profile?.total_comments || 0,
      icon: MessageSquare,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}