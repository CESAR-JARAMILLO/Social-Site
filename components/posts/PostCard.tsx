import React, { useEffect, useState } from 'react';
import { getPosts, deletePost, updatePost } from '@/pages/api/postsAuth/postsAuth';
import { Box, Button, Flex, Text, Input, useBreakpointValue, Textarea } from '@chakra-ui/react';

type Post = {
  content: string;
  user_id: string;
  id: string;
}

const PostCard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error: any) {
        console.error('Error retrieving posts:', error.message);
        // handle error here, you could set it to state and display in your UI
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error: any) {
      console.error('Error deleting comment:', error.message);
    }
  };

  const handleEdit = (postId: string, content: string) => {
    setEditPostId(postId);
    setEditContent(content);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPostId) return; // If editPostId is null, exit the function
  
    try {
      await updatePost(editPostId, editContent);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === editPostId ? { ...post, content: editContent } : post
        )
      );
      setEditPostId(null);
    } catch (error: any) {
      console.error('Error updating post:', error.message);
    }
  };
  

  const handleCancel = () => {
    setEditPostId(null);
    setEditContent('');
  };

  return (
    <Flex direction="column" maxWidth="500px" margin="0 auto">
      {posts.map((post) => (
        <Box key={post.id} borderWidth="1px" borderRadius="lg" overflow="hidden" padding="5" marginBottom="4">
          <Text mb="4">{post.user_id}</Text>
          {editPostId === post.id ? (
            <form onSubmit={handleUpdate}>
              <Textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                marginBottom="4"
              />
              <Button colorScheme="blue" type="submit" mr="4">Update</Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </form>
          ) : (
            <>
              <Text mb="4">{post.content}</Text>
              <Button colorScheme="red" onClick={() => handleDelete(post.id)} mr="4">Delete</Button>
              <Button colorScheme="yellow" onClick={() => handleEdit(post.id, post.content)}>Edit</Button>
            </>
          )}
        </Box>
      ))}
    </Flex>
  );
};

export default PostCard;
