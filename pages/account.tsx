import AccountHeader from '../components/account/AccountHeader';
import AccountPostCard from '@/components/account/AccountPostCard';
import AccountImagesCard from '@/components/account/AccountImagesCard';
import AccountEditProfile from '@/components/account/AccountEditProfile';
import CompleteSignupForm from '@/components/signup/CompleteSignupForm';
import { useState, useEffect } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { getCurrentUserProfile } from './api/auth';
import { Box, Flex } from '@chakra-ui/react';

const Account = () => {
  const [activeComponent, setActiveComponent] = useState('posts');
  const [completedSignup, setCompletedSignup] = useState(null)
  const { isLoading, session } = useSessionContext();
  const [userId, setUserId] = useState('')
  const router = useRouter()

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
        <Box minHeight="100vh" mt={10}>
          <AccountHeader setActiveComponent={setActiveComponent} />
          {activeComponent === 'posts' && <AccountPostCard />}
          {activeComponent === 'images' && (
            <Flex width="100%" justifyContent="center">
              <Box maxW="1200px" w="100%">
                <AccountImagesCard />
              </Box>
            </Flex>
          )}
          {activeComponent === 'edit' &&
            <Flex mt={6} alignItems="center" justifyContent="center">
              <AccountEditProfile />
            </Flex>}
        </Box>
      ) : (
        <Box minHeight="100vh" mt={10}>
          <Flex mt="6em" alignItems="center" justifyContent="center">
            <CompleteSignupForm userId={userId} />
          </Flex>
        </Box>
      )}
    </>
  )  
}

export default Account;
