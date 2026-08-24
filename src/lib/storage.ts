import { supabase } from './supabase';

export async function uploadAvatar(uri: string, userId?: string): Promise<string> {
  const resolvedUserId = userId ?? (await supabase.auth.getUser()).data.user?.id;
  if (!resolvedUserId) return uri;

  const response = await fetch(uri);
  if (!response.ok) throw new Error('Unable to read the selected image.');

  const body = await response.arrayBuffer();
  const path = `${resolvedUserId}/${Date.now()}.jpg`;
  const { error } = await supabase.storage.from('avatars').upload(path, body, {
    contentType: 'image/jpeg',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}