import React from 'react';
import { styled } from '@mui/material/styles';
import TextareaAutosize from '@mui/material/TextareaAutosize';

const CustomTextarea = styled((props) => <TextareaAutosize {...props} />)(({ theme }) => ({
  font: 'inherit',
  background: 'initial',
  width: '100%',
  // minHeight: '100px',
  resize: 'none',
  borderRadius: '5px',
  padding: '10px',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#dee3e9'}`,
  outlineColor: `${theme.palette.primary.main}`,
  backgroundColor: '#F7FBFD',
}));

export default CustomTextarea;
