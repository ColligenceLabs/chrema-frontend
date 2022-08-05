import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  RadioGroup,
  Typography,
} from '@mui/material';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/styles';
import CustomTextarea from '../../components/forms/custom-elements/CustomTextarea';
import CustomRadio from '../../components/forms/custom-elements/CustomRadio';

const CollectionDetailModal = (props) => {
  const [category, setCategory] = useState('');
  const [directory, setDirectory] = useState('');
  const theme = useTheme();
  const { open, closeDetailModal, row } = props;
  const { t } = useTranslation();

  useEffect(() => {
    if (row.category) {
      setCategory(row.category.toString().toUpperCase().replaceAll(',', ', '));
    }

    if (row.directory) {
      const index = row.directory.lastIndexOf('/');
      setDirectory(row.directory.slice(0, index));
    }
  }, [row]);

  return (
    <Dialog
      open={open}
      onClose={closeDetailModal}
      maxWidth={'md'}
      BackdropProps={{ style: { opacity: 0.2 }, transitionDuration: 1000 }}
    >
      <DialogTitle style={{ background: `${theme.palette.primary.main}` }}>
        <Typography variant="title" color="white">
          {t('Collection detail')}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {row && (
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <CustomFormLabel htmlFor="network">{t('Network')}</CustomFormLabel>
              <CustomTextField
                id="network"
                name="network"
                value={row.network}
                fullWidth
                size="small"
              />
            </Grid>

            <Grid item lg={6} md={12} sm={12} xs={12}>
              <CustomFormLabel htmlFor="name">{t('Name (Smart Contract Name)')}</CustomFormLabel>
              <CustomTextField
                id="name"
                name="name"
                variant="outlined"
                fullWidth
                size="small"
                value={row.name}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <CustomFormLabel htmlFor="creator">{t('Creator')}</CustomFormLabel>
              <CustomTextField
                id="creator"
                name="creator"
                variant="outlined"
                fullWidth
                size="small"
                value={row.creator_id?.full_name}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <CustomFormLabel htmlFor="category">{t('Category')}</CustomFormLabel>
              <CustomTextField
                id="category"
                name="category"
                variant="outlined"
                fullWidth
                size="small"
                value={category}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <CustomFormLabel htmlFor="image">{t('Image')}</CustomFormLabel>
              <img
                src={row.image_link}
                alt="logo"
                style={{
                  objectFit: 'cover',
                  width: '100%',
                }}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <CustomFormLabel htmlFor="description">{t('Description')}</CustomFormLabel>
              <CustomTextarea
                id="description"
                name="description"
                maxRows={5}
                minRows={5}
                value={row.description}
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Divider
                sx={{
                  mt: 5,
                  mb: 3,
                }}
              />
              <Typography color="primary" variant="subtitle2">
                {t('Creator Earnings')}
              </Typography>
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <CustomFormLabel htmlFor="symbol">{t('Percentage fee')}</CustomFormLabel>
              <CustomTextField
                id="fee_percentage"
                name="fee_percentage"
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Must be greater than 0.1 percent. e.g. 2.5"
                value={row.fee_percentage / 10}
              />
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <CustomFormLabel htmlFor="symbol">{t('Payout wallet address')}</CustomFormLabel>
              <CustomTextField
                id="fee_payout"
                name="fee_payout"
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Please enter on address. e.g. 0x623C7....."
                value={row.fee_payout}
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Divider
                sx={{
                  mt: 5,
                  mb: 3,
                }}
              />
              <Typography color="primary" variant="subtitle2">
                {t('Smart Contract Information')}
              </Typography>
            </Grid>
            {row.network !== 'solana' ? (
              <>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel>{t('Type')}</CustomFormLabel>
                  <RadioGroup
                    name="type"
                    defaultValue={row.contract_type}
                    // value={row.contract_type}
                    // onChange={isSubmitting ? null : handleChange}
                  >
                    <Grid container>
                      <Grid item lg={6} sm={6} xs={6}>
                        <FormControlLabel value="KIP17" control={<CustomRadio />} label="KIP17" />
                      </Grid>
                      <Grid item lg={6} sm={6} xs={6}>
                        <FormControlLabel value="KIP37" control={<CustomRadio />} label="KIP37" />
                      </Grid>
                    </Grid>
                  </RadioGroup>
                </Grid>

                {row.contract_type === 'KIP17' && (
                  <Grid item lg={6} md={12} sm={12} xs={12}>
                    <CustomFormLabel htmlFor="symbol">{t('Symbol')}</CustomFormLabel>
                    <CustomTextField
                      id="symbol"
                      name="symbol"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={row.symbol}
                    />
                  </Grid>
                )}

                {row.contract_type === 'KIP37' && (
                  <Grid item lg={6} md={12} sm={12} xs={12}>
                    <CustomFormLabel htmlFor="tokenUri">{t('IPFS Directory Name')}</CustomFormLabel>
                    <CustomTextField
                      id="tokenUri"
                      name="tokenUri"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={directory}
                    />
                  </Grid>
                )}
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="contractAddress">
                    {t('Contract Address')}
                  </CustomFormLabel>
                  <CustomTextField
                    id="contractAddress"
                    name="contractAddress"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={row.contract_address}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="symbol">{t('Symbol')}</CustomFormLabel>
                  <CustomTextField
                    id="symbol"
                    name="symbol"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={row.symbol}
                  />
                </Grid>

                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="maximum_supply">{t('Maximum supply')}</CustomFormLabel>
                  <CustomTextField
                    id="maximum_supply"
                    name="maximum_supply"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={row.maximum_supply}
                  />
                </Grid>
              </>
            )}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" size="small" onClick={closeDetailModal}>
          {t('Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CollectionDetailModal;
