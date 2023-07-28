import PostCard from '@/components/posts/PostCard';
import PostFormCard from '@/components/posts/PostFormCard';
import CompleteSignupForm from '@/components/signup/CompleteSignupForm';
import { Flex } from '@chakra-ui/react';
import { useSessionContext, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import { getCurrentUserProfile, signOut } from './api/auth';

const Home = () => {
  const router = useRouter()
  const [completedSignup, setCompletedSignup] = useState(null)
  const { isLoading, session, error } = useSessionContext();
  const [userId, setUserId] = useState('')

  const handleLogout = async () => {
    await signOut();
    router.push('/login')
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isLoading && !session) {
        router.push('/login');
      } else {
        try {
          const currentUserProfile = await getCurrentUserProfile();
          if (currentUserProfile) {
            setCompletedSignup(currentUserProfile[0]?.completed_signup);
            setUserId(currentUserProfile[0]?.id)
          } else {
            console.error("User profile is undefined.");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    
    
    fetchUserProfile();
  }, [isLoading, session, router]);  

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {completedSignup ? (
        <>
          <PostFormCard />
          <PostCard />
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Flex minHeight="100vh" alignItems="center" justifyContent="center">
          <CompleteSignupForm userId={userId} />
        </Flex>
      )}
    </>
  )
}

export default Home;