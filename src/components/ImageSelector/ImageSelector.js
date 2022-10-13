import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { styled } from '@mui/material/styles';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

const DropzoneWrapper = styled('div')`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border: 3px dashed rgb(204, 204, 204);
  border-radius: ${(props) => props.borderRadius};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const PreviewImage = styled('img')`
  padding: 3px 5px;
  border-radius: ${(props) => props.borderRadius};
  width: 100%;
  height: 100%;
  object-fit: cover;
  &:hover {
    opacity: 0.5;
    &:after {
      content: '';
    }
  }
`;

const PreviewVideo = styled('video')`
  padding: 3px 5px;
  borderradius: 16px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin-top: 0;
`;

const SelectWrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: rgb(204, 204, 204);
  border-radius: ${(props) => props.borderRadius};
  &:hover {
    background-color: rgb(204, 204, 204);
    border-radius: ${(props) => props.borderRadius};
    color: white;
  }
`;

const SelectImage = styled(ImageOutlinedIcon)`
  width: 50%;
  height: 50%;
  border-radius: ${(props) => props.borderRadius};
  &:hover {
    //background-color: rgb(204, 204, 204);
    border-radius: ${(props) => props.borderRadius};
    color: white;
  }
`;

const ImageSelector = ({ image, handleImageSelect, width = '400px', height = '250px' }) => {
  const [preview, setPreview] = useState(image ? image : null);
  const [previewType, setPreviewType] = useState('image/jpeg');

  const onDrop = (acceptedFiles) => {
    const theFile = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setPreviewType(theFile.type);
      setPreview(result);
      handleImageSelect(theFile);
    };
    reader.readAsDataURL(theFile);
    // setPreview(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'video/mp4': ['.mp4'],
    },
    // validator: fileSizeValidator,
  });

  useEffect(() => {
    if (image) {
      const theFile = image;
      const reader = new FileReader();
      reader.onloadend = (finishedEvent) => {
        const {
          currentTarget: { result },
        } = finishedEvent;
        setPreviewType(theFile.type);
        setPreview(result);
        handleImageSelect(theFile);
      };
      reader.readAsDataURL(theFile);
    }
    // setPreview(image);
  }, [image]);

  return (
    <DropzoneWrapper width={width} height={height} {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      {preview ? (
        previewType === 'video/mp4' ? (
          <PreviewVideo autoPlay controls>
            <source src={preview}></source>
          </PreviewVideo>
        ) : (
          <PreviewImage src={preview} alt={'thumb'} />
        )
      ) : (
        <SelectWrapper>
          <SelectImage />
        </SelectWrapper>
      )}
    </DropzoneWrapper>
  );
};

export default ImageSelector;
