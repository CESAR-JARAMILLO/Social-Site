import { useState, useEffect } from 'react'
import { getCurrentUserProfile, updateUser, signOut } from '@/pages/api/auth';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { deleteUser } from '@/pages/api/adminAuth';
import { useRouter } from 'next/router';
import { Button, FormControl, FormLabel, Input, VStack, Box } from '@chakra-ui/react';

const AccountEditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter()
  const { isLoading, session, error } = useSessionContext();
  const user = session?.user

  useEffect(() => {
    const fetchAndSetUserData = async () => {
      const userProfile = await getCurrentUserProfile();
  
      if (userProfile && userProfile[0]) {
        const fullName = userProfile[0].full_name;
        const names = fullName.split(' ');

        setFirstName(names[0]);
        setLastName(names[1] || '');
        setUsername(userProfile[0].username);
      } else {
        router.push('/login');
      }
    };
  
    fetchAndSetUserData();
  }, [session, user, router]);
  

  if (isLoading) {
    return (
      <p>Loading</p>
    );
  }

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(username, firstName, lastName);
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
          <FormControl id="firstName">
            <FormLabel>First Name:</FormLabel>
            <Input type="text" value={firstName} onChange={handleFirstNameChange} />
          </FormControl>
          <FormControl id="lastName">
            <FormLabel>Last Name:</FormLabel>
            <Input type="text" value={lastName} onChange={handleLastNameChange} />
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
