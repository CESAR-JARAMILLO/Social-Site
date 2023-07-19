import { useState, useRef, useEffect } from 'react';
import { createPost } from '@/pages/api/postsAuth/postsAuth';
import { getCurrentUserProfile } from '@/pages/api/auth';
import {
  Box,
  Button,
  Flex,
  useBreakpointValue,
  Avatar,
  Input,
  Image,
  Spinner,
  AspectRatio
} from '@chakra-ui/react';
import { FiImage } from 'react-icons/fi';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const PostFormCard = () => {
  const [text, setText] = useState('');
  const [uploads, setUploads] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = useSupabaseClient();
  const [avatarUrl, setAvatarUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const postData = await createPost(text, uploads);
      console.log('Post created successfully:', postData);
      alert(`You submitted: ${text}`);
      setText('');
      setUploads([]);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (files) {
      setIsUploading(true);
      const fileList: File[] = Array.from(files);
      for (const file of fileList) {
        const newName = Date.now() + file.name;
        const result = await supabase.storage.from('photos').upload(newName, file);
        if (result.data) {
          const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/photos/' + result.data.path;
          setUploads(prevUploads => [...prevUploads, url]);
        }
      }
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userProfile = await getCurrentUserProfile();
      if (userProfile) {
        setAvatarUrl(userProfile[0].avatar_url)
      }
    }
  
    fetchCurrentUser()
  }, [])
  

  const formWidth = useBreakpointValue({ base: '90%', sm: '70%', md: '50%', lg: '40%' });

  return (
    <Flex my={8} justifyContent="center">
      <Box width={formWidth} padding="4" boxShadow="lg" borderRadius="md" bg="white">
        <Box as="form" width="100%" onSubmit={handleSubmit}>
          <Flex gap={2}>
            <Avatar size="lg" src={avatarUrl} />
            <Input
              as="textarea"
              my={4}
              border="none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              size="md"
            />
          </Flex>
          {isUploading && <Spinner my={6} />}
          {uploads.length > 0 && (
            <Flex gap={1} my={4} wrap="wrap">
              {uploads.slice(0, 4).map((photo: any, index: number) => (
                <Box w={['49%', '24%']}>
                  <AspectRatio ratio={4 / 3}>
                    <Image
                      borderRadius={10}
                      h="100%"
                      w="100%"
                      objectFit="contain"
                      src={photo}
                      alt={`Photo ${index + 1}`}
                    />
                  </AspectRatio>
                </Box>
              ))}
            </Flex>
          )}
          <Flex mt={6} alignItems="center" justifyContent="space-between">
            <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
              <FiImage size={26} />
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
      </Box>
    </Flex>
  );
};

export default PostFormCard;