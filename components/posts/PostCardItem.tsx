import React from 'react';
import { Box, Button, Flex, Text, useBreakpointValue, Textarea, Avatar, IconButton, Input, useDisclosure } from '@chakra-ui/react';
import { FiMoreHorizontal, FiTrash2, FiEdit } from "react-icons/fi";
import { Popover, PopoverTrigger, PopoverContent } from "@chakra-ui/popover";

export type Post = {
  content: string;
  user_id: string;
  id: string;
}

export type PostCardItemProps = {
  post: Post;
  handleEdit: (postId: string, content: string) => void;
  handleDelete: (postId: string) => void;
  editPostId: string | null;
  setEditPostId: React.Dispatch<React.SetStateAction<string | null>>;
  editContent: string;
  setEditContent: React.Dispatch<React.SetStateAction<string>>;
  handleUpdate: (e: React.FormEvent) => void;
}

const PostCardItem: React.FC<PostCardItemProps> = ({post, handleEdit, handleDelete, editPostId, setEditPostId, editContent, setEditContent, handleUpdate}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const formWidth = useBreakpointValue({ base: "90%", sm: "70%", md: "50%", lg: "40%" });

  const handleButtonHover = {
    backgroundColor: "blue.400",
    color: "white",
    // p: "10px",
    borderRadius: "10px"
  }

  return (
    <Box width={formWidth} borderWidth="1px" borderRadius="lg" overflow="hidden" padding="5" marginBottom="4">
      <Flex mb={4} gap={4}>
        <Avatar size="lg" src='/images/cesar.jpeg' />
        <Flex direction="column">
          <Text fontWeight="bold" fontSize="sm">Cesar</Text>
          <Text color="gray.500" fontSize="xs">4 hours ago</Text>
        </Flex>
        <Flex flex="1" justifyContent="flex-end">
          <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
              <IconButton
                aria-label="Options"
                icon={<FiMoreHorizontal size={24} />}
                color="gray.500"
                variant="ghost"
                onClick={onOpen}
              />
            </PopoverTrigger>
            <PopoverContent mr={5}>
              <Flex direction="column" p="5" gap={2}>
                <Flex as="button" onClick={() => {handleDelete(post.id); onClose();}} p={4} _hover={handleButtonHover}>
                  <FiTrash2 size={24} />
                  <Text>Delete Post</Text>
                </Flex>
                <Flex as="button" onClick={() => {handleEdit(post.id, post.content); onClose();}} p={4} _hover={handleButtonHover}>
                  <FiEdit size={24} />
                  <Text>Edit Post</Text>
                </Flex>
              </Flex>
            </PopoverContent>
          </Popover>
        </Flex>
      </Flex>
      {editPostId === post.id ? (
        <form onSubmit={handleUpdate}>
          <Textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            marginBottom="4"
          />
          <Button colorScheme="blue" type="submit" mr="4">Update</Button>
          <Button onClick={() => setEditPostId(null)}>Cancel</Button>
        </form>
      ) : (
        <>
          <Text mb="4">{post.content}</Text>
          <Flex gap={2}>
            <Avatar size="md" src='/images/cesar.jpeg' />
            <Box as='form' width="100%">
              <Input
                p={3}
                mb={4}
                color="gray.500"
                border="none"
                value="Leave a comment"
                placeholder="What's on your mind?"
                size="md"
              />
            </Box>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default PostCardItem;
