import React, { useState } from 'react';
import { updatePost } from '@/pages/api/postsAuth/postsAuth';

type Props = {
  initialText: string;
  postId: string;
  onPostUpdate: (postId: string, updatedText: string) => void;  // Add this line
};

const EditPostFormCard: React.FC<Props> = ({ initialText, postId, onPostUpdate }) => {
  const [text, setText] = useState(initialText);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  // inside EditPostFormCard

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const data = await updatePost(postId, text);
    console.log('Post updated:', data);
    onPostUpdate(postId, text); // call onPostUpdate
    alert('Post updated successfully');
  } catch (error: any) {
    console.error('Error updating post:', error.message);
    // handle error here, you could show a message to user or something
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <label>
        Post Content:
        <input type="text" value={text} onChange={handleInputChange} />
      </label>
      <button type="submit">Update Post</button>
    </form>
  );
};

export default EditPostFormCard;
