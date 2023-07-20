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

export async function getCommentsByPostId(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles: user_id (full_name, avatar_url)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: false });

  if (error) return { error };
  return { data };
}


export async function updateComment(commentId: string, newText: string) {
  const { data, error } = await supabase
    .from('comments')
    .update({ comment: newText }) 
    .eq('id', commentId);
  
  if (error) {
    console.error('Error updating comment:', error.message);
  }

  return { data, error };
}

export async function deleteComment(commentId: string) {
  const { data, error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  console.log('Deleted comment:', commentId);

  return { data, error };
}