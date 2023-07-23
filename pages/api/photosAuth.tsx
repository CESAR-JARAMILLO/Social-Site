import { supabase } from "@/lib/supabaseClient";

export async function getUserPhotos(user_id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('photos')
    .eq('user_id', user_id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}