import React, { useState } from 'react';
import { Card, CardMedia } from '@mui/material';
// @ts-ignore
import FsLightbox from 'fslightbox-react';
import ImageViewer from '../../../../../components/ImageViewer';
import { NFTType } from '../../../types';
import bgImage from '../../../../../assets/images/products/s8.jpg';

interface DetailContentsProps {
  nft: NFTType;
}

const DetailContents: React.FC<DetailContentsProps> = ({ nft }) => {
  const [toggled, setToggled] = useState(false);
  console.log(nft.metadata);
  return (
    <>
      {(nft?.metadata?.alt_url !== undefined && nft?.metadata?.alt_url.indexOf('.mp4')) > 0 ||
      (nft?.metadata?.image.indexOf('.mp4') !== undefined &&
        nft?.metadata?.image.indexOf('.mp4') > 0) ||
      nft?.collection_id._id === '62b274452fb89e40a2bca0bc' ? (
        <Card
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '600px',
            p: 0,
          }}
        >
          <CardMedia
            component="video"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src={nft.metadata.alt_url || nft?.metadata?.image}
            autoPlay
            loop
            muted
          />
        </Card>
      ) : nft?.metadata?.image.indexOf('wav') > -1 ? (
        <Card
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            height: '600px',
            p: 0,
            backgroundImage: `url(${nft?.album_jacket})`,
            backgroundSize: 'cover',
          }}
        >
          <CardMedia
            component="audio"
            src={nft.metadata.alt_url || nft?.metadata?.image}
            autoPlay={true}
            sx={{ mb: 1, p: 1 }}
            controls
          />
        </Card>
      ) : (
        <Card sx={{ p: 0, m: 0 }} onClick={() => setToggled(!toggled)}>
          <ImageViewer
            src={nft.metadata.alt_url ? nft.metadata.alt_url : nft.metadata.image}
            alt={nft.metadata.name}
          />
        </Card>
      )}
      <FsLightbox
        toggler={toggled}
        sources={nft.metadata.alt_url ? [nft.metadata.alt_url] : [nft.metadata.image]}
        type="image"
      />
    </>
  );
};

export default DetailContents;
