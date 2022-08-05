import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/styles';

const AdminsDetailModal = (props) => {
  const theme = useTheme();
  const { open, closeUserDetailModal, row } = props;

  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={closeUserDetailModal}
      BackdropProps={{ style: { opacity: 0.2 }, transitionDuration: 1000 }}
    >
      <DialogTitle style={{ background: `${theme.palette.primary.main}` }}>
        <Typography variant="title" color="white">
          {t('User detail')}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box style={{ width: 500, marginBottom: 30 }}>
          <CustomFormLabel htmlFor="name">{t('User id')}</CustomFormLabel>
          <CustomTextField
            id="userId"
            name="userId"
            value={row._id}
            variant="outlined"
            fullWidth
            disabled
            size="small"
          />
          <CustomFormLabel htmlFor="name">{t('Name')}</CustomFormLabel>
          <CustomTextField
            id="name"
            name="name"
            value={row.full_name}
            variant="outlined"
            fullWidth
            disabled
            size="small"
          />
          <CustomFormLabel htmlFor="name">{t('Email')}</CustomFormLabel>
          <CustomTextField
            id="email"
            name="email"
            value={row.email}
            variant="outlined"
            fullWidth
            disabled
            size="small"
          />
          <CustomFormLabel htmlFor="name">{t('Level')}</CustomFormLabel>
          <CustomTextField
            id="level"
            name="level"
            value={row.level}
            variant="outlined"
            fullWidth
            disabled
            size="small"
          />
          <CustomFormLabel htmlFor="name">{t('Status')}</CustomFormLabel>
          <CustomTextField
            id="status"
            name="status"
            value={row.status}
            variant="outlined"
            fullWidth
            disabled
            size="small"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" size="small" onClick={closeUserDetailModal}>
          {t('Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminsDetailModal;
