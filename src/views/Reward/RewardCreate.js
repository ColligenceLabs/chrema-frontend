import React, { useState } from 'react';
import { Grid, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import { useTranslation } from 'react-i18next';

const StyledButton = styled(Button)`
  width: 100px;
`;

const Container = styled(Paper)(({ theme }) => ({
  padding: '20px',
  borderRadius: '7px',
}));

const RewardCreate = () => {
  const { t } = useTranslation();
  const [creatorData, setCreatorData] = useState({
    name: '',
    content: '',
    description: '',
  });

  const [selectedContent, setSelectedContent] = useState();

  const contentFileHandler = (event) => {
    setSelectedContent(event.target.files[0]);
    setCreatorData({
      ...creatorData,
      content: event.target.files[0].name,
    });
  };

  const handleMintDataChange = (event) => {
    const { name, value } = event.target;

    setCreatorData({
      ...creatorData,
      [name]: value,
    });
  };
  const handleCreatorChange = (event) => {
    const { name, value } = event.target;
    setCreatorData({
      ...creatorData,
      [name]: value,
    });
    setCreator(event.target.value);
  };

  const handleTypeChange = (event) => {
    const { name, value } = event.target;
    setCreatorData({
      ...creatorData,
      [name]: value,
    });
    setType(event.target.value);
  };

  const onSubmitData = () => {};

  return (
    <PageContainer title="Reward Register" description="this is Reward Register Form page">
      <Breadcrumb title="Reward Register" subtitle="Reward Register Information" />
      <Container>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item lg={6} md={12} sm={12} xs={12}>
            <CustomFormLabel htmlFor="name">{t('Name')}</CustomFormLabel>
            <CustomTextField
              id="name"
              name="name"
              placeholder={t('Enter name')}
              variant="outlined"
              fullWidth
              size="small"
              onChange={handleMintDataChange}
            />
          </Grid>

          <Grid item lg={6} md={12} sm={12} xs={12}>
            <CustomFormLabel htmlFor="content">{t('Content')}</CustomFormLabel>
            <CustomTextField
              id="content"
              name="content"
              placeholder={t('Select File')}
              variant="outlined"
              fullWidth
              size="small"
              value={creatorData.content}
              onChange={handleMintDataChange}
              InputProps={{
                startAdornment: (
                  <Button
                    variant="contained"
                    component="label"
                    size="small"
                    style={{ marginRight: '1rem' }}
                  >
                    <DriveFileMoveOutlinedIcon fontSize="small" />
                    <input
                      id={'file-input'}
                      style={{ display: 'none' }}
                      type="file"
                      name="imageFile"
                      onChange={contentFileHandler}
                    />
                  </Button>
                ),
              }}
            />
          </Grid>

          <Grid item lg={6} md={12} sm={12} xs={12}>
            <CustomFormLabel htmlFor="description">{t('Description')}</CustomFormLabel>
            <CustomTextField
              id="description"
              name="description"
              placeholder={t('Enter description')}
              variant="outlined"
              fullWidth
              size="small"
              onChange={handleMintDataChange}
            />
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12} textAlign="right" gap="1rem">
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <StyledButton variant="outlined" size="small">
                {t('Cancel')}
              </StyledButton>
              <StyledButton variant="contained" onClick={onSubmitData}>
                {t('Confirm')}
              </StyledButton>
            </div>
          </Grid>
        </Grid>
      </Container>
    </PageContainer>
  );
};

export default RewardCreate;
