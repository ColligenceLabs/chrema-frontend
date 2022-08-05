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

const StatusDialog = ({ open, handleStatusClose, updateStatus }) => {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={handleStatusClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle style={{ background: `${theme.palette.primary.main}` }} id="alert-dialog-title">
        <Typography variant="title" color="white">
          사용자 활성화
        </Typography>
      </DialogTitle>
      <DialogContent style={{ marginTop: '30px' }}>
        <DialogContentText variant="body2" id="alert-dialog-description">
          사용자를 상태를 변경 하시겠습니까?
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ padding: '10px' }}>
        <Button variant="outlined" onClick={handleStatusClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={updateStatus}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusDialog;
