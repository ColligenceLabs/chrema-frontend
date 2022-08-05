import React, { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { targetNetworkMsg } from '../config';

const useCopyToClipBoard = () => {
  const [copyDone, setCopyDone] = useState(false);
  const [copyResult, setCopyResult] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');

  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopyResult(true);
      setCopyMessage(`'${copyMe}' Copied!`);
    } catch (err) {
      setCopyResult(false);
      setCopyMessage('Failed to copy!');
    } finally {
      setCopyDone(true);
    }
  };

  return { copyToClipBoard, copyResult, copyMessage, copyDone, setCopyDone };
};

export default useCopyToClipBoard;
