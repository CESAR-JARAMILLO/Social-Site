import { useState, useEffect } from 'react'
import { getCurrentUserProfile, updateUser, signOut } from './api/auth';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { deleteUser } from './api/adminAuth';
import { useRouter } from 'next/router';
import AccountHeader from '../components/account/accountHeader';
import AccountPostCard from '@/components/account/AccountPostCard';
import AccountImagesCard from '@/components/account/AccountImagesCard';

const Account = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const router = useRouter()
  const { isLoading, session, error } = useSessionContext();
  const user = session?.user

  useEffect(() => {
    const fetchAndSetUserData = async () => {
      const userProfile = await getCurrentUserProfile();

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

    };

    fetchAndSetUserData();
  }, [session]);

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
        await deleteUser(user?.id);
        alert('Account deleted successfully!');
        signOut();
        router.push('/login');
      } catch (error) {
        alert('Failed to delete account.');
      }
    }
  };

  if (isLoading) {
    return (
      <p>Loading</p>
    );
  }

  return (
    <div>
      <AccountHeader />
      <AccountPostCard />
      <AccountImagesCard />
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
