import { Box, Flex } from '@chakra-ui/react';
import SignupForm from '@/components/signup/SignupForm';

const Signup = () => {

  return (
    <Box minHeight="100vh" mt={10}>
      <Flex mt="6em" alignItems="center" justifyContent="center">
        <SignupForm />
      </Flex>
    </Box>
  )
}

export default Signup