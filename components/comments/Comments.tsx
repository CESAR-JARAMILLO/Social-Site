import React, { useEffect, useState } from 'react';
import { Box, Button, VStack, Text, Flex, Avatar, IconButton, Input, useDisclosure } from '@chakra-ui/react';
import { Popover, PopoverTrigger, PopoverContent } from "@chakra-ui/popover";
import { FiEdit, FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';
import { deleteComment, getCommentsByPostId, updateComment } from '@/pages/api/commentsAuth';

type Comment = {
  id: string;
  user_id: string;
  comment: string;
};

type CommentsProps = {
  postId: string;
};

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editableCommentId, setEditableCommentId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const handleButtonHover = {
    backgroundColor: "blue.400",
    color: "white",
    borderRadius: "10px"
  }

  const handleEdit = async () => {
    if (!editableCommentId) return;

    try {
      const response = await updateComment(editableCommentId, newCommentText);
      if (response.error) throw response.error;
      console.log('Comment updated successfully:', response.data);
      setComments(prev => prev && prev.map(comment => comment.id === editableCommentId ? {...comment, comment: newCommentText} : comment));
      setEditableCommentId(null);
      setNewCommentText('');
    } catch (error) {
      setError((error as Error).message);
    }
  }

  const handleCancel = () => {
    setEditableCommentId(null);
    setNewCommentText('');
  }

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(prev => prev && prev.filter(comment => comment.id !== commentId));
      onClose();
      setSelectedCommentId(null);
    } catch (error) {
      setError((error as Error).message);
    }
  }

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
            {editableCommentId === comment.id ? (
              <>
                <Input bg="transparent" as="textarea" value={newCommentText} onChange={e => setNewCommentText(e.target.value)} />
                <Button onClick={handleEdit}>Save</Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </>
            ) : (
              <Text>{comment.comment}</Text>
            )}
          </Box>
          <Box alignSelf="center">
            <Popover isOpen={isOpen && selectedCommentId === comment.id} onClose={() => {onClose(); setSelectedCommentId(null);}}>
              <PopoverTrigger>
                <IconButton
                  aria-label="Options"
                  icon={<FiMoreHorizontal size={24} />}
                  color="gray.500"
                  variant="ghost"
                  onClick={() => {onOpen(); setSelectedCommentId(comment.id);}}
                />
              </PopoverTrigger>
              <PopoverContent mr={5}>
                <Flex direction="column" p="5" gap={2}>
                  <Flex as="button" p={4} onClick={() => {handleDelete(comment.id); onClose(); setSelectedCommentId(null);}} _hover={handleButtonHover}>
                    <FiTrash2 size={24} />
                    <Text>Delete Comment</Text>
                  </Flex>
                  <Flex as="button" p={4} onClick={() => { setEditableCommentId(comment.id); setNewCommentText(comment.comment); onClose(); setSelectedCommentId(null);}} _hover={handleButtonHover}>
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
