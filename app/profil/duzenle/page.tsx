"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProfileFormData {
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  website: string;
  location: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    full_name: "",
    avatar_url: "",
    bio: "",
    website: "",
    location: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      router.push("/");
    }
  }, [user, router]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      setFormData({
        username: data?.username || "",
        full_name: data?.full_name || "",
        avatar_url: data?.avatar_url || "",
        bio: data?.bio || "",
        website: data?.website || "",
        location: data?.location || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Profil bilgileri yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Lütfen bir resim seçin');
      }

      const file = event.target.files[0];
      const fileSize = file.size / 1024 / 1024; // Convert to MB

      if (fileSize > 2) {
        throw new Error('Dosya boyutu 2MB\'dan küçük olmalıdır');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const allowedExts = ['jpg', 'jpeg', 'png', 'gif'];

      if (!fileExt || !allowedExts.includes(fileExt)) {
        throw new Error('Sadece JPG, PNG veya GIF dosyaları yükleyebilirsiniz');
      }

      const fileName = `${user?.id}/avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));

      toast.success('Profil resmi güncellendi');
    } catch (error: any) {
      toast.error(error.message || 'Profil resmi yüklenirken bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          id: user?.id,
          ...formData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Profil başarıyla güncellendi");
      router.push("/profil");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Profil güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded" />
              </div>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-10 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.push("/profil")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Profili Düzenle</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profil Resmi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.avatar_url || undefined} />
                  <AvatarFallback>
                    {formData.full_name?.[0] || user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Label 
                  htmlFor="avatar" 
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary hover:bg-primary/90 cursor-pointer transition-colors"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 text-primary-foreground" />
                  )}
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  JPG, PNG veya GIF. Maksimum 2MB.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Önerilen boyut: 400x400 piksel
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kişisel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="Kullanıcı adınız"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">Ad Soyad</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  placeholder="Ad ve soyadınız"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Hakkımda</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Kendinizden bahsedin"
                rows={4}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Konum</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Şehir, Ülke"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button type="submit" className="sm:flex-1" disabled={loading || uploading}>
            {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="sm:flex-1"
            onClick={() => router.push("/profil")}
            disabled={loading || uploading}
          >
            İptal
          </Button>
        </div>
      </form>
    </div>
  );
}