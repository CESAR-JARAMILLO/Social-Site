import { useState, useEffect } from 'react'
import { getCurrentUser, getCurrentUserProfile, getCurrentSession, updateUser, signOut } from './api/auth';
import { deleteUser } from './api/adminAuth';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

const Account = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter()

  useEffect(() => {
    const fetchAndSetUserData = async () => {
      const user = await getCurrentUser();
      const userProfile = await getCurrentUserProfile();
      const session = await getCurrentSession();

      if (user && user.email) {
        setEmail(user.email);
      }

      if (userProfile && userProfile[0]) {
        setFullName(userProfile[0].full_name);
        setUsername(userProfile[0].username);
        setAvatarUrl(userProfile[0].avatar_url);
      } else {
        router.push('/login');
      }

      setSession(session);
    };

    fetchAndSetUserData();
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(email, fullName, username, avatarUrl);
      alert('Update successful!');
    } catch (error) {
      alert('Failed to update user info.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const user = await getCurrentUser();
        await deleteUser(user?.id);
        alert('Account deleted successfully!');
        signOut();
        router.push('/login');
      } catch (error) {
        alert('Failed to delete account.');
      }
    }
  };

  if (!session) {
    return (
      <p>Loading</p>
    );
  }

  return (
    <div>
      <h1>Account</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <label>
          Full Name:
          <input type="text" value={fullName} onChange={handleFullNameChange} />
        </label>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <button type="submit">Update Profile</button>
      </form>
      <button onClick={handleDelete}>Delete Profile</button>
    </div>
  )
}

export default Account
