import { useState } from 'react';
import { createPost } from '@/pages/api/postsAuth/postsAuth';
import { Box, Button, Flex, useBreakpointValue, Avatar, Input } from '@chakra-ui/react';

const PostFormCard = () => {
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const postData = await createPost(text);
      console.log('Post created successfully:', postData);
      alert(`You submitted: ${text}`);
      setText(''); // Clear textarea after submission
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.')
    }
  };
  
  const formWidth = useBreakpointValue({ base: "90%", sm: "70%", md: "50%", lg: "40%" });

  return (
    <Flex justifyContent="center">
      <Box width={formWidth} padding="4" boxShadow="lg" borderRadius="md" bg="white">
        <Flex gap={2}>
          <Avatar size="lg" src='/images/cesar.jpeg' />
          <Box as='form' width="100%" onSubmit={handleSubmit}>
            <Input
              as="textarea"
              my={4}
              border="none"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What's on your mind?"
              size="md"
            />
            <Flex justifyContent="flex-end">
              <Button type="submit" colorScheme="blue">Submit</Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}

export default PostFormCard;
