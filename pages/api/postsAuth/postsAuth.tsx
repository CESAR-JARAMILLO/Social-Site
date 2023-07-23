import { supabase } from "@/lib/supabaseClient";

export async function createPost(content: string, photos: any) {
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
      { content, user_id: user.user.id, photos: photos },
    ]);

  if (insertError) {
    throw insertError;
  }

  return data;
}

export async function getPosts() {
  const { data, error } = await supabase.from('posts').select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getUserPosts(user_id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select()
    .eq('user_id', user_id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deletePost(postId: string) {  
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) {
    throw error;
  }

  console.log('Deleted post:', postId);
}

export async function updatePost(postId: string, newText: string) {
  console.log('Attempting to update post with id:', postId);

  const { data, error } = await supabase
    .from('posts')
    .update({ content: newText })
    .eq('id', postId);

  if (error) {
    throw error;
  }

  console.log('Post updated successfully:', data);
  return data;
}
