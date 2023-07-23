import React, { useEffect, useState } from 'react';
import { getUserPhotos } from '@/pages/api/photosAuth';
import { useUser } from '@supabase/auth-helpers-react';
import { Image } from '@chakra-ui/react';

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
    <div>
      {photos.map((url, index) => (
        <div key={index} style={{ position: 'relative', width: '100%', height: 'auto' }}>
          <Image src={url} alt="User uploaded" objectFit='cover' /> 
        </div>
      ))}
    </div>
  );
};

export default AccountImagesCard;
