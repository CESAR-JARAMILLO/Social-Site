import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import { signOut } from './api/auth';

const Home = () => {
  const router = useRouter()
  const { isLoading, session, error } = useSessionContext();

  const handleLogout = async () => {
    await signOut();
    router.push('/login')
  };

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        router.push('/login')
      }
    }
  }, [isLoading, session]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div>
        Home
      </div>
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}

export default Home