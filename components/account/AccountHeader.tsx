import React, { useEffect, useRef, useState } from 'react'
import { Box, Avatar, Flex, useMediaQuery, Text, Stack, Link, Icon, Spinner } from "@chakra-ui/react"
import { FiCamera } from 'react-icons/fi'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { v4 as uuidv4 } from 'uuid';

interface AccountHeaderProps {
  setActiveComponent: (componentName: string) => void;
  avatarUrl: string | null;
  backgroundUrl: string | null;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ setActiveComponent, avatarUrl, backgroundUrl }) => {
  const [uploading, setUploading] = useState(false)
  const [localAvatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [localBackgroundUrl, setBackgroundUrl] = useState<string | null>(null)
  const user = useUser()
  const supabase = useSupabaseClient()
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const [isLargerThanMD] = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setAvatarUrl(avatarUrl)
    setBackgroundUrl(backgroundUrl)
  }, [avatarUrl, backgroundUrl])


  async function uploadFile(event: React.ChangeEvent<HTMLInputElement>, isAvatar: boolean) {
    try {
      setUploading(true)

      const files: FileList | null = event.target.files;
      if (files && files[0]) {
        const file = files[0];
        const filePath = `${user?.id}/${uuidv4()}`;

        const uploadResponse = await supabase
          .storage
          .from(isAvatar ? 'avatars' : 'backgrounds')
          .upload(filePath, file);

        if (uploadResponse.data) {
          const filePublicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${isAvatar ? 'avatars' : 'backgrounds'}/${filePath}`;

          if (user) {
            const { error } = await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                [isAvatar ? 'avatar_url' : 'background_url']: filePublicUrl,
              })

            if (isAvatar) {
              setAvatarUrl(filePublicUrl)
            } else {
              setBackgroundUrl(filePublicUrl)
            }

            if (error) {
              throw error
            }
          }
        } else {
          throw new Error('Upload failed');
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Upload failed') {
          alert('Failed to upload the image. Please try again.')
        } else {
          alert(`Unexpected error: ${error.message}`)
        }
      } else {
        console.log(error);
      }
    } finally {
      setUploading(false)
      if (avatarInputRef.current) {
        avatarInputRef.current.value = '';
      }
      if (backgroundInputRef.current) {
        backgroundInputRef.current.value = '';
      }
    }
  }

  return (
    uploading ? <Spinner /> :
    <Flex mb={8} direction="column" justifyContent="space-between" bg="white" w={isLargerThanMD ? "80%" : "100%"} m={isLargerThanMD ? "40px auto" : "none"} borderRadius={isLargerThanMD ? "lg" : "none"} overflow="hidden">
      <Box h="200px" bgImage={`url(${localBackgroundUrl})`} bgSize="cover" position="relative">
      <Box 
        bg="gray.300"
        p={2}
        borderRadius={20}
        border="1px solid white"
        position="absolute"
        bottom={4}
        right={6}
        onClick={() => backgroundInputRef.current?.click()}
      >
        <FiCamera size={22} color="white" fill="black" />
      </Box>
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={backgroundInputRef}
          onChange={(event) => uploadFile(event, false)}
        />
      </Box>
      <Flex direction="column" align={isLargerThanMD ? "center" : "flex-start"} ml={isLargerThanMD ? "none" : 6}>
        <Box position="relative">
          <Avatar 
            name="Cesar Jaramillo"
            src={localAvatarUrl || undefined}
            boxSize="100px"
            position="relative"
            top="-50px"
            border="2px solid white"
            bg="white"
          />
          <Box bg="gray.300" p={2} borderRadius={20} border="1px solid white" position="absolute" bottom={14} right={-1} onClick={() => avatarInputRef.current?.click()}>
          <FiCamera size={20} color="white" fill="black" />
        </Box>
        </Box>
        <Text mt="-25px" fontSize="xl" fontWeight="bold">
          Cesar Jaramillo
        </Text>
      </Flex>
      <Stack mt={20} ml={isLargerThanMD ? "none" : 6} direction="row" justify={isLargerThanMD ? "center" : "flex-start"} spacing={4} mb="4">
        <Link onClick={() => setActiveComponent('posts')}>Posts</Link>
        <Link onClick={() => setActiveComponent('images')}>Photos</Link>
        <Link onClick={() => setActiveComponent('edit')}>Edit Profile</Link>
      </Stack>
    </Flex>
  )
}

export default AccountHeader
