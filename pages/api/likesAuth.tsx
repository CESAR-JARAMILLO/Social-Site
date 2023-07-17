import { supabase } from "@/lib/supabaseClient";

export async function getAllLikes() {
  const { data, error } = await supabase
    .from('likes')
    .select('*');

  return { data, error };
}

export async function createLike(user_id: string, post_id: string) {
  const { data, error } = await supabase
    .from('likes')
    .insert([
      { user_id: user_id, post_id: post_id }
    ]);
  
  return { data, error };
}

export async function removeLike(user_id: string, post_id: string) {
  const { data, error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', user_id)
    .eq('post_id', post_id);

  return { data, error };
}