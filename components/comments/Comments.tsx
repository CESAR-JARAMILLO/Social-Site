import React, { useEffect, useState } from 'react'
import { getCommentsByPostId } from '@/pages/api/commentsAuth';
import { Box, VStack, Text, Flex, Avatar, IconButton, Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react';
import { FiEdit, FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';

type Comment = {
  user_id: string;
  comment: string;
};

type CommentsProps = {
  postId: string;
};

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getCommentsByPostId(postId);
        if(response.error) throw response.error;
        setComments(response.data);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchComments();
  }, [postId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!comments) {
    return <div>Loading comments...</div>;
  }

  return (
    <VStack align="start" my={6} spacing={6}>
      {comments.map((comment, index) => (
        <Flex gap={4} key={index}>
          <Avatar size="md" src='/images/cesar.jpeg' />
          <Box bg="blackAlpha.100" w="70%" borderRadius={20} p={2}>
            <Text fontWeight="bold">Cesar Jaramillo</Text>
            <Text>{comment.comment}</Text>
          </Box>
          <Box alignSelf="center">
          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label="Options"
                icon={<FiMoreHorizontal size={24} />}
                color="gray.500"
                variant="ghost"
                // onClick={onOpen}
              />
            </PopoverTrigger>
            <PopoverContent mr={5}>
              <Flex direction="column" p="5" gap={2}>
                <Flex as="button" p={4} >
                  <FiTrash2 size={24} />
                  <Text>Delete Comment</Text>
                </Flex>
                <Flex as="button" p={4} >
                  <FiEdit size={24} />
                  <Text>Edit Comment</Text>
                </Flex>
              </Flex>
            </PopoverContent>
          </Popover>
          </Box>
        </Flex>
      ))}
    </VStack>
  );
}

export default Comments;
