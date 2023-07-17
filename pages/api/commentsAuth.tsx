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
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId);

    if (error) {
      console.error('Error fetching comments:', error.message);
      return { data: null, error };
    }

    if (!data) {
      const noDataError = new Error('No data returned when fetching comments');
      console.error(noDataError.message);
      return { data: null, error: noDataError };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { data: null, error };
  }
}
