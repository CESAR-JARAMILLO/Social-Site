import { Box, Flex } from '@chakra-ui/react';
import SignupStepper from '@/components/signup/SignupStepper';
import SignupForm from '@/components/signup/SignupForm';

const Signup = () => {

  return (
    <Box minHeight="100vh" mt={10}>
      <Flex justifyContent="center" alignItems="center">
        <SignupStepper />
      </Flex>
      <Flex mt="6em" alignItems="center" justifyContent="center">
        <SignupForm />
      </Flex>
    </Box>
  )
}

export default Signup