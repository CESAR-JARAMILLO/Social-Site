import { Image, Grid, AspectRatio } from '@chakra-ui/react';

type PostCardImagesProps = {
  photos: string[];
}

const PostCardImages: React.FC<PostCardImagesProps> = ({ photos }) => {
  return (
    photos.length === 1 ? (
      <Image borderRadius={10} h="100%" w="100%" objectFit="contain" src={photos[0]} alt="Photo 1" />
    ) : (
      <Grid templateColumns="repeat(2, 1fr)" gap={1}>
        {photos.slice(0, 4).map((photo: any, index: number) => (
          <AspectRatio ratio={photos.length === 3 && index === 2 ? 16/9 : 4/3} key={index} gridColumn={photos.length === 3 && index === 2 ? 'span 2' : 'auto'}>
            <Image borderRadius={10} h="100%" w="100%" objectFit="contain" src={photo} alt={`Photo ${index + 1}`} />
          </AspectRatio>
        ))}
      </Grid>
    )
  );
}

export default PostCardImages;
