import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box } from '@mui/material';
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

const PreviewWrapper = styled('img')`
  padding: 3px 5px;
  border-radius: ${(props) => props.borderRadius};
  width: 100%;
  height: 100%;
  object-fit: cover;
  &:hover {
    opacity: 0.5;
    &:after {
      content: 'asdfasdfasdf';
    }
  }
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

const ImageSelector = ({ width = '400px', height = '250px', borderRadius = '16px' }) => {
  const [preview, setPreview] = useState();
  const onDrop = (acceptedFiles) => {
    const theFile = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setPreview(result);
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

  return (
    <DropzoneWrapper
      width={width}
      height={height}
      borderRadius={borderRadius}
      {...getRootProps({ className: 'dropzone' })}
    >
      <input {...getInputProps()} />
      {preview ? (
        <PreviewWrapper src={preview} alt={'thumb'} />
      ) : (
        <SelectWrapper>
          <SelectImage />
        </SelectWrapper>
      )}
    </DropzoneWrapper>
  );
};

export default ImageSelector;
