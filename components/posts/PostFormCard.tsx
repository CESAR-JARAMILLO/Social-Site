import { useState } from 'react';
import { createPost } from '@/pages/api/postsAuth/postsAuth';
import { Box, Button, Flex, Textarea, useBreakpointValue } from '@chakra-ui/react';

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
  
  const formWidth = useBreakpointValue({ base: "90%", md: "40%", lg: "30%" });

  return (
    <Flex justifyContent="center">
      <Box width={formWidth} padding="4" boxShadow="lg" borderRadius="md" bg="white" marginTop="4">
        <form onSubmit={handleSubmit}>
          <Flex direction="column" marginBottom="1em">
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Write your post here..."
              marginBottom="1em"
              size="sm"
            />
            <Button type="submit" colorScheme="blue">Submit</Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
}

export default PostFormCard;
