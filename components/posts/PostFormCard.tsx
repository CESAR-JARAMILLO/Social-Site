import { useState } from 'react';
import { createPost } from '@/pages/api/postsAuth/postsAuth';

const PostFormCard = () => {
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const postData = await createPost(text);
      console.log('Post created successfully:', postData);
      alert(`You submitted: ${text}`);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.')
    }
  };
  

  return (
    <div>
      <h3>PostFormCard</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default PostFormCard;
