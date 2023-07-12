import { supabase } from '@/lib/adminAuthClient';


export async function deleteUser(userId) {
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) {
    console.error(error);
    throw error;
  }
}
