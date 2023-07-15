import { supabase } from "@/lib/supabaseClient";

export async function createComment(postId: string, comment: string) {
  const { data: user, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error: insertError } = await supabase
    .from('comments')
    .insert([
      { post_id: postId, comment, user_id: user.user.id },
    ]);

  if (insertError) {
    throw insertError;
  }

  return data;
}
