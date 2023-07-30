import { useState, useEffect } from 'react'
import { getCurrentUserProfile, updateUser, signOut } from '@/pages/api/auth';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { deleteUser } from '@/pages/api/adminAuth';
import { useRouter } from 'next/router';
import { Box, Button, Flex, Input, Heading, Alert, AlertIcon, useBreakpointValue } from '@chakra-ui/react';

const AccountEditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | boolean>(false);
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
      setErrorMessage(null);
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      setErrorMessage('Failed to update user info.');
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await deleteUser(user?.id);
      signOut();
      router.push('/login');
    } catch (error) {
      setErrorMessage('Failed to delete profile.');
    }
  };

  const formWidth = useBreakpointValue({ base: "90%", md: "60%", lg: "40%" });

  return (
    <Box width={formWidth}>
      {errorMessage && (
        <Alert borderRadius={20} mb={5} status='error'>
          <AlertIcon />
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert borderRadius={20} mb={5} status='success'>
          <AlertIcon />
          {successMessage}
        </Alert>
      )}
      <Heading textAlign="center" marginBottom="2em">Edit Profile</Heading>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" marginBottom="1em">
          <Input
            bg="white"
            type="text"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={handleFirstNameChange}
            placeholder="First Name"
            marginBottom="1em"
          />
          <Input
            bg="white"
            type="text"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={handleLastNameChange}
            placeholder="Last Name"
            marginBottom="1em"
          />
          <Input
            bg="white"
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Username"
            marginBottom="1em"
          />
          <Button type="submit" colorScheme="blue" marginBottom="1em">Update Profile</Button>
          <Button colorScheme="red" onClick={handleDeleteProfile}>Delete Profile</Button>
        </Flex>
      </form>
    </Box>
  )
}

export default AccountEditProfile