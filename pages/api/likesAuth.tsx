import { supabase } from "@/lib/supabaseClient";

export async function getAllLikes() {
  const { data, error } = await supabase
    .from('likes')
    .select('*');
  
  return { data, error };
}
