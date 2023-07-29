import { useState } from 'react';
import { signUp } from '@/pages/api/auth';
import { Box, Button, Flex, Input, Link, useBreakpointValue, Heading, Alert, AlertIcon } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const SignupForm = () => {
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | boolean>(false);
  const router = useRouter()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleConfirmEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if(email !== confirmEmail) {
      setErrorMessage('Emails do not match!');
      return;
    }
  
    if(password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }
  
    const { error } = await signUp(email, password)
  
    if (error) {
      setErrorMessage(`Failed to sign up: ${error}`);
      return;
    }
  
    setErrorMessage(null)
    setSuccessMessage('Signup successful! Please check your email and follow the link.');
    setEmail('');
    setPassword('');
    setConfirmEmail('');
    setConfirmPassword('');
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
          <Heading textAlign="center" marginBottom="2em">Signup</Heading>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" marginBottom="1em">
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
                marginBottom="1em"
              />
              <Input
                type="email"
                id="emailConfirmation"
                name="emailConfirmation"
                value={confirmEmail}
                onChange={handleConfirmEmailChange}
                placeholder="Confirm Email"
                marginBottom="1em"
              />
              <Input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                marginBottom="1em"
              />
              <Input
                type="password"
                id="passwordConfirmation"
                name="passwordConfirmation"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm Password"
                marginBottom="1em"
              />
              <Button type="submit" colorScheme="blue">Sign up</Button>
            </Flex>
          </form>
          <Link href="/login" color="blue.500">Already have an account?</Link>
        </Box>
  )
}

export default SignupForm