import React, { useEffect, useState } from 'react';
import { getUserPhotos } from '@/pages/api/photosAuth';
import { useUser } from '@supabase/auth-helpers-react';
import { Box, Image, Center } from '@chakra-ui/react';

const AccountImagesCard = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const user = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const data = await getUserPhotos(user.id);
        const photoData = data.flatMap(item => item.photos);
        setPhotos(photoData);
      } catch (error: any) {
        console.error('Error retrieving photos:', error.message);
      }
    };

    fetchData();
  }, [user?.id]);

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      }}
      px={{sm: 4}}
      gap={6}
      width="100%"
    >
      {photos.map((url, index) => (
        <Center key={index}>
          <Image
            src={url}
            alt="User uploaded"
            objectFit="cover"
            boxSize="250px"
          />
        </Center>
      ))}
    </Box>
  );
};

export default AccountImagesCard;