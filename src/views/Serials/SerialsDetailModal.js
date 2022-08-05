import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  CardMedia,
  Typography,
} from '@mui/material';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/styles';

const SerialsDetailModal = (props) => {
  const theme = useTheme();
  const { open, handleCloseDetailModal, row } = props;
  const { t } = useTranslation();

  return (
    <>
      {row._id && (
        <Dialog
          open={open}
          onClose={handleCloseDetailModal}
          BackdropProps={{ style: { opacity: 0.2 }, transitionDuration: 1000 }}
          maxWidth="md"
        >
          <DialogTitle style={{ background: `${theme.palette.primary.main}` }}>
            <Typography variant="title" color="white">
              {t('NFT detail')}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Box style={{ width: 500, marginBottom: 30 }}>
              <CustomFormLabel htmlFor="nftName">{t('NFT Name')}</CustomFormLabel>
              <CustomTextField
                id="nftName"
                name="nftName"
                variant="outlined"
                fullWidth
                disabled
                size="small"
                value={row.nft_id.metadata.name}
              />
              <CustomFormLabel htmlFor="serialIndex">{t('Serial Index')}</CustomFormLabel>
              <CustomTextField
                id="serialIndex"
                name="serialIndex"
                variant="outlined"
                fullWidth
                disabled
                size="small"
                value={row.index}
              />
              <CustomFormLabel htmlFor="token">{t('Token')}</CustomFormLabel>
              <CustomTextField
                id="token"
                name="token"
                variant="outlined"
                fullWidth
                disabled
                size="small"
                value={parseInt(row.token_id, 16)}
              />
              <CustomFormLabel htmlFor="owner">{t('Owner')}</CustomFormLabel>
              <CustomTextField
                id="owner"
                name="owner"
                variant="outlined"
                fullWidth
                disabled
                size="small"
                value={row.owner_id ?? '-'}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" size="small" onClick={handleCloseDetailModal}>
              {t('Close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default SerialsDetailModal;
