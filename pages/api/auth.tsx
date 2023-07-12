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

export async function getCurrentUser() {
  try {
    const session = await supabase.auth.getSession();

    if (session.data.session?.user) {
      console.log('Current user:', session.data.session?.user);
      return session.data.session?.user;
    } else {
      console.log('No user currently logged in.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}

export async function getCurrentUserProfile() {
  try {
    const session = await supabase.auth.getSession();
    if (session.data && session.data.session) {
      const user = session.data.session.user;

      if (!user) {
        console.log('No user currently logged in.');
      } else {
        const { data: userProfile, error } = await supabase.from('profiles').select('*').eq('id', user.id);
        if (error) {
          console.error('Error fetching profile:', error.message);
        } else {
          console.log('User profile:', userProfile);
          return userProfile;
        }
      }
    } else {
      console.log('No session available.');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error.message);
    throw error;
  }

  if (data && 'session' in data) {
    return data.session;
  } else {
    return error;
  }
}

export async function updateUser(email: string, fullName: string, username: string, avatarUrl: string) {
  try {
    const { data: authData, error: authError } = await supabase.auth.updateUser({
      email: email,
    });

    if (authError) {
      throw authError;
    }

    const { data: userData, error: userError } = await supabase.from('profiles').update({
      full_name: fullName,
      username: username,
      avatar_url: avatarUrl
    }).eq('id', authData.user.id);

    if (userError) {
      throw userError;
    }

    return { authData, userData };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}