import React from 'react';
import useProgressiveImg from '../../hooks/useProgressiveImg';

const BlurredUpImage = ({ image }) => {
  const [src, { blur }] = useProgressiveImg(null, image);
  return (
    <img
      alt="test"
      src={src}
      style={{
        width: '100%',
        height: 'auto',
        filter: blur ? 'blur(10px)' : 'none',
        transition: blur ? 'none' : 'filter 0.3s ease-out',
      }}
    />
  );
};

export default BlurredUpImage;
