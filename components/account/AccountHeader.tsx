import React from 'react'
import { Box, Avatar, Flex, useMediaQuery, Text, Stack, Link, Icon } from "@chakra-ui/react"
import { FiCamera } from 'react-icons/fi'

interface AccountHeaderProps {
  setActiveComponent: (componentName: string) => void;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ setActiveComponent }) => {

  const [isLargerThanMD] = useMediaQuery("(min-width: 768px)");

  return (
    <Flex mb={8} direction="column" justifyContent="space-between" bg="white" w={isLargerThanMD ? "80%" : "100%"} m={isLargerThanMD ? "40px auto" : "none"} borderRadius={isLargerThanMD ? "lg" : "none"} overflow="hidden">
      <Box h="200px" bgImage="url('https://source.unsplash.com/random')" bgSize="cover" position="relative">
        <Icon as={FiCamera} p={1} w={8} h={8} position="absolute" bottom={4} right={6} color="white" bg="black" borderRadius={10}/>
      </Box>
      <Flex direction="column" align={isLargerThanMD ? "center" : "flex-start"} ml={isLargerThanMD ? "none" : 6}>
        <Box position="relative">
          <Avatar 
            name="Cesar Jaramillo"
            src="/images/cesar.jpeg"
            boxSize="100px"
            position="relative"
            top="-50px"
            border="2px solid white"
            bg="white"
          />
          <Icon as={FiCamera} p={1} w={7} h={7} position="absolute" bottom="14" right="-1" color="white" bg="black" borderRadius={10}/>
        </Box>
        <Text mt="-25px" fontSize="xl" fontWeight="bold">
          Cesar Jaramillo
        </Text>
      </Flex>
      <Stack mt={20} ml={isLargerThanMD ? "none" : 6} direction="row" justify={isLargerThanMD ? "center" : "flex-start"} spacing={4} mb="4">
        <Link onClick={() => setActiveComponent('posts')}>Posts</Link>
        <Link onClick={() => setActiveComponent('images')}>Photos</Link>
        <Link onClick={() => setActiveComponent('edit')}>Edit Profile</Link>
      </Stack>
    </Flex>
  )
}

export default AccountHeader
