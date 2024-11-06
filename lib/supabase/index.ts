import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif'];

    if (!fileExt || !allowedExts.includes(fileExt)) {
      throw new Error('Sadece JPG, PNG veya GIF dosyaları yükleyebilirsiniz');
    }

    const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('gzlszlr')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('gzlszlr')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
}