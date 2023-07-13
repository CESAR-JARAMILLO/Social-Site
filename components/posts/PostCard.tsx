import React, { useEffect, useState } from 'react';
import { getPosts } from '@/pages/api/postsAuth/postsAuth';

type Post = {
  content: string;
  user_id: string;
  id: string;
}

const PostCard = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error retrieving posts:', error);
        // handle error here, you could set it to state and display in your UI
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {

  }

  return (
    <div>
      <h2>PostCard</h2>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.user_id}</h3>
          <p>{post.content}</p>
          <button onClick={handleDelete}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default PostCard;