import React from 'react';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
import ImageSelector from '../../components/ImageSelector/ImageSelector';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomTextarea from '../../components/forms/custom-elements/CustomTextarea';
import { Formik } from 'formik';

interface FiledTitleProps {
  required?: boolean;
}
const MyCollectionContainer = styled(Container)`
  max-width: 646px !important;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 10rem;
`;

const TitleWrapper = styled(Typography)`
  font-size: 40px;
  font-weight: 600;
  letter-spacing: 0px;
  margin-top: 2rem;
`;

const FieldWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const FiledTitle = styled('label')<{ required?: boolean }>`
  color: rgb(53, 56, 64);
  font-weight: 600;
  font-size: 16px;
  ${({ required }) =>
    required === true &&
    `
    &:after {
    content: " *";
    color: rgb(235, 87, 87)
    }
  `}
`;

const FieldSubscription = styled('span')`
  display: flex;
  justify-content: space-between;
  color: rgb(112, 122, 131);
  font-size: 12px;
  font-weight: 500;
`;

const CreateNewCollection = () => {
  return (
    <MarketLayout>
      <Formik
        initialValues={{ logoImage: null, bannerImage: null, name: '', url: '', description: '' }}
        onSubmit={(values) => {
          console.log('Collection create start!');
          console.log(values);
        }}
      >
        {({ values, handleSubmit, setFieldValue, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <MyCollectionContainer>
              <TitleWrapper>Create a Collection</TitleWrapper>

              <FieldWrapper>
                <FiledTitle required={true}>Logo image</FiledTitle>
                <FieldSubscription>
                  This image will also be used for navigation. 350 x 350 recommended.
                </FieldSubscription>
                <ImageSelector
                  image={values.logoImage}
                  handleImageSelect={(image: any) => setFieldValue('logoImage', image)}
                  width="160px"
                  height="160px"
                />
              </FieldWrapper>

              <FieldWrapper>
                <FiledTitle required={true}>Banner image</FiledTitle>
                <FieldSubscription>
                  This image will appear at the top of your collection page. Avoid including too
                  much text in this banner image, as the dimensions change on different devices.
                  1400 x 350 recommended.
                </FieldSubscription>
                <ImageSelector
                  image={values.bannerImage}
                  handleImageSelect={(image: any) => setFieldValue('bannerImage', image)}
                  width="600px"
                  height="200px"
                />
              </FieldWrapper>

              <FieldWrapper>
                <FiledTitle required={true}>Name</FiledTitle>
                <CustomTextField
                  value={values.name}
                  name="name"
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </FieldWrapper>

              <FieldWrapper>
                <FiledTitle>Url</FiledTitle>
                <FieldSubscription>
                  Customize your URL on OpenSea. Must only contain lowercase letters, numbers, and
                  hyphens.
                </FieldSubscription>
                <CustomTextField
                  name="url"
                  value={values.url}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </FieldWrapper>
              <FieldWrapper>
                <FiledTitle>Description</FiledTitle>
                <FieldSubscription>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, necessitatibus?
                </FieldSubscription>
                <CustomTextarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  maxRows={5}
                  minRows={5}
                />
              </FieldWrapper>
              <FieldWrapper>
                <Button type="submit" variant="contained">
                  Create
                </Button>
              </FieldWrapper>
            </MyCollectionContainer>
          </form>
        )}
      </Formik>
    </MarketLayout>
  );
};

export default CreateNewCollection;
