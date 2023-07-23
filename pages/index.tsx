import PostCard from '@/components/posts/PostCard';
import PostFormCard from '@/components/posts/PostFormCard';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react'
import { signOut } from './api/auth';

const Home = () => {
  const router = useRouter()
  const { isLoading, session, error } = useSessionContext();

  const handleLogout = async () => {
    await signOut();
    router.push('/login')
  };

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/login')
    }
  }, [isLoading, session, router]);
  

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <PostFormCard />
      <PostCard />
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}

export default Home;