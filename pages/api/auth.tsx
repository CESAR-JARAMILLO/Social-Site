import { supabase } from "@/lib/supabaseClient";

export async function signUp(email: string, password: string): Promise<void> {
  try {
    const { data, error } =
      await supabase.auth.signUp({
        email: email,
        password: password,
      });

    if (error) {
      console.log("Error creating user:", error.message);
    } else {
      console.log("User created successfully:", data);
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

    if (error) {
      console.log("Error signing in:", error.message);
      return { error };
    } else {
      console.log("Signed in successfully:", data);
      return { data };
    }
  } catch (error) {
    console.error("Error signing in:", error);
    return { error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log('Error signing out:', error.message);
    } else {
      console.log('User signed out successfully');
    }
  } catch (error) {
    console.error('Error signing out:', error);
  }
}