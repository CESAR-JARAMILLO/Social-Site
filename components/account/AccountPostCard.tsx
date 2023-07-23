import React, { useEffect, useState } from 'react';
import { deletePost, updatePost, getUserPosts } from '@/pages/api/postsAuth/postsAuth';
import { Flex } from '@chakra-ui/react';
import PostCardItem, { Post } from '../posts/PostCardItem'; 
import { useUser } from '@supabase/auth-helpers-react';

const PostCard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const user = useUser()

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) return;
  
      try {
        const data = await getUserPosts(user.id);
        setPosts(data);
      } catch (error: any) {
        console.error('Error retrieving posts:', error.message);
      }
    };
  
    fetchData();
  }, [user]);
  

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

  console.log(posts);


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
