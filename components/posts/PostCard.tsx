import React, { useEffect, useState } from 'react';
import { getPosts, deletePost, updatePost } from '@/pages/api/postsAuth/postsAuth';
import { Flex } from '@chakra-ui/react';
import PostCardItem, { Post, PostCardItemProps } from './PostCardItem'; 

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
    if (!editPostId) return; 
  
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

  return (
    <Flex direction="column" alignItems="center">
      {posts.map((post) => (
        <PostCardItem
          key={post.id}
          post={post}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          editPostId={editPostId}
          setEditPostId={setEditPostId}
          editContent={editContent}
          setEditContent={setEditContent}
          handleUpdate={handleUpdate}
        />
      ))}
    </Flex>
  );
};

export default PostCard;
