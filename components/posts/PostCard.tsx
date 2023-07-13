import React, { useEffect, useState } from 'react';
import { getPosts, deletePost } from '@/pages/api/postsAuth/postsAuth';
import EditPostFormCard from './EditPostFormCard'; // import EditPostFormCard

type Post = {
  content: string;
  user_id: string;
  id: string;
}

const PostCard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editPostId, setEditPostId] = useState<string | null>(null);

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

  const handleEdit = (postId: string) => {
    setEditPostId(postId);
  };

  const handlePostUpdate = (postId: string, updatedText: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, content: updatedText } : post
      )
    );
    setEditPostId(null);
  };

  return (
    <div>
      <h2>PostCard</h2>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.user_id}</h3>
          {editPostId === post.id ? (
            <EditPostFormCard
              initialText={post.content}
              postId={post.id}
              onPostUpdate={handlePostUpdate}
            />
          ) : (
            <p>{post.content}</p>
          )}
          <button onClick={() => handleDelete(post.id)}>delete</button>
          <button onClick={() => handleEdit(post.id)}>edit</button>
        </div>
      ))}
    </div>
  );
};

export default PostCard;
