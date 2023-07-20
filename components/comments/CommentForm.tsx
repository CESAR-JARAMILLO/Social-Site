import { Avatar, Box, Flex, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { createComment } from '@/pages/api/commentsAuth';
import { getCurrentUserProfile } from '@/pages/api/auth';

type CommentFormProps = {
  postId: string;
};

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('')

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await createComment(postId, comment);
      console.log('Comment created successfully:', data);
      setComment(''); // Clear the comment after successful submission
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && comment.trim()) {
      e.preventDefault(); // prevent the default action (new line)
      handleSubmit(e);
    }
  }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userProfile = await getCurrentUserProfile();
      if (userProfile) {
        setAvatarUrl(userProfile[0].avatar_url)
      }
    }
  
    fetchCurrentUser()
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <Flex gap={2}>
        <Avatar size="md" src={avatarUrl} />
        <Input
          as='textarea'
          onChange={handleCommentChange}
          onKeyDown={handleKeyDown}
          p={3}
          mb={4}
          border="none"
          value={comment}
          placeholder="Leave a comment.."
          size="md"
        />
      </Flex>
    </form>
  );
}

export default CommentForm;
