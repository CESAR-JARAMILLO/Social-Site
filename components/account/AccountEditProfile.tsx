import { useState, useEffect } from 'react'
import { getCurrentUserProfile, updateUser, signOut } from '@/pages/api/auth';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { deleteUser } from '@/pages/api/adminAuth';
import { useRouter } from 'next/router';
import { Button, FormControl, FormLabel, Input, VStack, Box } from '@chakra-ui/react';

const AccountEditProfile = () => {
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

  if (isLoading) {
    return (
      <p>Loading</p>
    );
  }

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

  return (
    <Box w="full" bg="white" p={8} borderWidth={1} borderRadius={8}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email:</FormLabel>
            <Input type="email" value={email} onChange={handleEmailChange} />
          </FormControl>
          <FormControl id="fullName">
            <FormLabel>Full Name:</FormLabel>
            <Input type="text" value={fullName} onChange={handleFullNameChange} />
          </FormControl>
          <FormControl id="username">
            <FormLabel>Username:</FormLabel>
            <Input type="text" value={username} onChange={handleUsernameChange} />
          </FormControl>
          <Button colorScheme="blue" type="submit">Update Profile</Button>
          <Button colorScheme="red" mt={4} onClick={handleDelete}>Delete Profile</Button>
        </VStack>
      </form>
    </Box>
  )
}

export default AccountEditProfile