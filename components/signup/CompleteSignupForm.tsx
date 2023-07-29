import { useState } from 'react';
import { Box, Button, Flex, Input, Link, useBreakpointValue, Heading, Alert, AlertIcon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { supabase } from "@/lib/supabaseClient";

const CompleteSignupForm = ({ userId }: { userId: string }) => {
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | boolean>(false);

  const router = useRouter()

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Update user profile in the database
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        username: username,
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        completed_signup: true
      })
  
    if (error) {
      setErrorMessage(`Failed to update profile: ${error.message}`);
      return;
    }
  
    setErrorMessage(null)
    setSuccessMessage('Profile updated successfully!');
    setUsername('');
    setFirstName('');
    setLastName('');
    router.push('/')
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
      <Heading textAlign="center" marginBottom="2em">Complete Your Profile</Heading>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" marginBottom="1em">
          <Input
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Username"
            marginBottom="1em"
          />
          <Input
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={handleFirstNameChange}
            placeholder="First Name"
            marginBottom="1em"
          />
          <Input
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={handleLastNameChange}
            placeholder="Last Name"
            marginBottom="1em"
          />
          <Button type="submit" colorScheme="blue">Submit</Button>
        </Flex>
      </form>
    </Box>
  )
}

export default CompleteSignupForm;
