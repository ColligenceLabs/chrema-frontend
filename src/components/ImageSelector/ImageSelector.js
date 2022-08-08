import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

const DropzoneWrapper = styled('div')`
  width: 400px;
  height: 250px;
  border: 3px dashed rgb(204, 204, 204);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const PreviewWrapper = styled('img')`
  padding: 3px 5px;
  border-radius: 16px;
  width: 400px;
  height: 250px;
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
  &:hover {
    background-color: rgb(204, 204, 204);
    border-radius: 16px;
    color: white;
  }
`;

const SelectImage = styled(ImageOutlinedIcon)`
  width: 100px;
  height: 100px;
`;

const ImageSelector = () => {
  const [preview, setPreview] = useState();
  const onDrop = (acceptedFiles) => {
    const theFile = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      setPreview(result);
    };
    reader.readAsDataURL(theFile);
    // setPreview(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop,
  });

  useEffect(() => console.log(preview), [preview]);

  return (
    <DropzoneWrapper {...getRootProps({ className: 'dropzone' })}>
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
