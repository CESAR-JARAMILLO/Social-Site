import { useState, useRef } from 'react';
import { createPost } from '@/pages/api/postsAuth/postsAuth';
import { Box, Button, Flex, useBreakpointValue, Avatar, Input, Image, Spinner } from '@chakra-ui/react';
import { FiImage } from 'react-icons/fi';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const PostFormCard = () => {
  const [text, setText] = useState('');
  const [uploads, setUploads] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = useSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const postData = await createPost(text, uploads);
      console.log('Post created successfully:', postData);
      alert(`You submitted: ${text}`);
      setText('');
      setUploads([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset the file input value
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async  (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (files) {
      setIsUploading(true)
      const fileList: File[] = Array.from(files);
      for (const file of fileList) {
        const newName = Date.now() + file.name
        const result = await supabase
          .storage
          .from('photos')
          .upload(newName, file)
          if (result.data) {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/photos/' + result.data.path
            setUploads(prevUploads => [...prevUploads, url])
          }
        }
      setIsUploading(false)
    }
  };
  

  const formWidth = useBreakpointValue({ base: '90%', sm: '70%', md: '50%', lg: '40%' });

  return (
    <Flex my={8} justifyContent="center">
      <Box width={formWidth} padding="4" boxShadow="lg" borderRadius="md" bg="white">
        <Flex gap={2}>
          <Avatar size="lg" src="/images/cesar.jpeg" />
          <Box as="form" width="100%" onSubmit={handleSubmit}>
            <Input
              as="textarea"
              my={4}
              border="none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              size="md"
            />
            {isUploading && (
              <Spinner my={6} />
            )}
            {uploads.length > 0 && (
              <>
                {uploads.map(upload => (
                  <Image borderRadius={10} h={20} key={upload} src={upload} alt="Uploaded Image" />
                ))}
              </>
            )}
            <Flex justifyContent="space-between">
              <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                <FiImage size={24} />
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button type="submit" colorScheme="blue">
                Submit
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default PostFormCard;
