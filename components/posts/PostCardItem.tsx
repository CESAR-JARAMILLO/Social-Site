import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Text, useBreakpointValue, Textarea, Avatar, IconButton, useDisclosure } from '@chakra-ui/react';
import { FiMoreHorizontal, FiTrash2, FiEdit, FiHeart, FiMessageSquare } from "react-icons/fi";
import { Popover, PopoverTrigger, PopoverContent } from "@chakra-ui/popover";
import CommentForm from '../comments/CommentForm';
import Comments from '../comments/Comments';
import { getCommentsByPostId } from '@/pages/api/commentsAuth';
import { getAllLikes, createLike, removeLike } from '@/pages/api/likesAuth';
import { getUserById } from '@/pages/api/auth';

export type Post = {
  content: string;
  user_id: string;
  id: string;
  created_at: any;
}

export type Like = {
  id: string;
  user_id: string;
  post_id: string;
};

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

const getTimeDifference = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'w', seconds: 604800 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
    { label: 's', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count}${interval.label}`;
    }
  }

  return 'just now';
};

const PostCardItem: React.FC<PostCardItemProps> = ({ post, handleEdit, handleDelete, editPostId, setEditPostId, editContent, setEditContent, handleUpdate }) => {
  const [user, setUser] = useState<any>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [likes, setLikes] = useState<Like[]>([]);
  const [viewComments, setViewComments] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const formWidth = useBreakpointValue({ base: "90%", sm: "70%", md: "50%", lg: "40%" });

  const handleButtonHover = {
    backgroundColor: "blue.400",
    color: "white",
    borderRadius: "10px"
  }

  const handleCommentsView = () => {
    if (!viewComments) {
      setViewComments(true)
    } else {
      setViewComments(false)
    }
  }

  const handleLikePost = async () => {
    const userId = post.user_id;
    const { error } = await createLike(userId, post.id);
    if (error) {
      console.log('Failed to like post:', error);
    } else {
      setLikes(prevLikes => [...prevLikes, { id: 'tempId', user_id: userId, post_id: post.id }]);
    }
  }

  const handleUnlikePost = async () => {
    const userId = post.user_id;
    const postId = post.id;
    const userLike = likes.find(like => like.user_id === userId && like.post_id === postId);
    if (!userLike) {
      return;
    }
    const { error } = await removeLike(userLike.user_id, userLike.post_id);
    if (error) {
      console.log('Failed to unlike post:', error);
    } else {
      setLikes(prevLikes => prevLikes.filter(like => like.id !== userLike.id));
    }
  };

  useEffect(() => {
    const fetchCommentsAndLikes = async () => {
      try {
        // Fetch comments
        const response = await getCommentsByPostId(post.id);
        if (response.error) throw response.error;
        setComments(prevComments => response.data || prevComments);

        // Fetch likes
        const likesResponse = await getAllLikes();
        if (likesResponse.error) throw likesResponse.error;
        setLikes(prevLikes => likesResponse.data || prevLikes);

        // Fetch user
        const userResponse = await getUserById(post.user_id);
        if (userResponse.error) throw userResponse.error;
        setUser(userResponse.data);
      } catch (error) {
        console.log((error as Error).message);
      }
    };

    fetchCommentsAndLikes();
  }, [post.id]);

  const postLikes = likes.filter(like => like.post_id === post.id).length;

  const isLiked = likes.some(like => like.user_id === post.user_id && like.post_id === post.id);

  return (
    <Box width={formWidth} borderWidth="1px" borderRadius="lg" overflow="hidden" padding="5" marginBottom="4">
      <Flex mb={4} gap={4}>
        <Avatar size="lg" src='/images/cesar.jpeg' />
        <Flex direction="column">
          <Text fontSize="sm">
            <Text as="span" fontWeight="bold">
              {user?.full_name}
            </Text>{" "}
            shared a post
          </Text>
          <Text color="gray.500" fontSize="xs">
            {getTimeDifference(new Date(post.created_at))}
          </Text>
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
                <Flex
                  as="button"
                  onClick={() => {
                    handleDelete(post.id);
                    onClose();
                  }}
                  p={4}
                  _hover={handleButtonHover}
                >
                  <FiTrash2 size={24} />
                  <Text>Delete Post</Text>
                </Flex>
                <Flex
                  as="button"
                  onClick={() => {
                    handleEdit(post.id, post.content);
                    onClose();
                  }}
                  p={4}
                  _hover={handleButtonHover}
                >
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
          <Button colorScheme="blue" type="submit" mr="4">
            Update
          </Button>
          <Button onClick={() => setEditPostId(null)}>Cancel</Button>
        </form>
      ) : (
        <>
          <Text>{post.content}</Text>
          <Flex my={4} gap={10}>
            <Flex gap={2}>
              <Box as="button" onClick={isLiked ? handleUnlikePost : handleLikePost}>
                <FiHeart size={20} color={isLiked ? 'red' : 'gray'} />
              </Box>
              <Text>{postLikes}</Text>
            </Flex>
            <Flex gap={2}>
              <Box onClick={handleCommentsView} as="button">
                <FiMessageSquare size={20} />
              </Box>
              <Text>{comments?.length}</Text>
            </Flex>
          </Flex>
          {viewComments && <Comments postId={post.id} />}
          <CommentForm postId={post.id} />
        </>
      )}
    </Box>
  );
};

export default PostCardItem;
