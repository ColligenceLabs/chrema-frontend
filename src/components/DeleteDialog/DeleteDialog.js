import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/styles';

const DeleteDialog = ({ title, open, handleDeleteClose, doDelete }) => {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={handleDeleteClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle style={{ background: `${theme.palette.primary.main}` }}>
        <Typography variant="title" color="white">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent style={{ marginTop: '30px' }}>
        <DialogContentText variant="body2" id="alert-dialog-description">
          삭제 하시겠습니까?
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ padding: '10px' }}>
        <Button variant="outlined" onClick={handleDeleteClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={doDelete}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
