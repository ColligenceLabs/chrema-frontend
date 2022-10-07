import React, { useState } from 'react';
import { Card } from '@mui/material';
import ReactPlayer from 'react-player';
// @ts-ignore
import FsLightbox from 'fslightbox-react';
import ImageViewer from '../../../../../components/ImageViewer';
import { NFTType } from '../../../types';

interface DetailContentsProps {
  nft: NFTType;
}

const DetailContents: React.FC<DetailContentsProps> = ({ nft }) => {
  const [toggled, setToggled] = useState(false);

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
          }}
        >
          <ReactPlayer
            config={{ file: { attributes: { controlsList: 'nodownload' } } }}
            url={nft.metadata.alt_url || nft?.metadata?.image}
            width="100%"
            height="100%"
            // controls={true}
            light={false}
            pip={true}
            playing={true}
            muted={true}
            loop={true}
            playIcon={<button>Play</button>}
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
