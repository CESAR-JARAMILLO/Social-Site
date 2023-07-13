import { supabase } from "@/lib/supabaseClient";

export async function createPost(content: string) {
  const { data: user, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error: insertError } = await supabase
    .from('posts')
    .insert([
      { content, user_id: user.user.id },
    ]);

  if (insertError) {
    throw insertError;
  }

  return data;
}


