import React from 'react';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import { Box, Container, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageSelector from '../../components/ImageSelector/ImageSelector';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomTextarea from '../../components/forms/custom-elements/CustomTextarea';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';

const CreateNewItemContainer = styled(Container)`
  max-width: 646px !important;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TitleWrapper = styled(Typography)`
  font-size: 40px;
  font-weight: 600;
  letter-spacing: 0px;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const FieldWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const FiledTitle = styled('label')`
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
  color: rgb(112, 122, 131);
  font-size: 12px;
  font-weight: 500;
`;

const CreateNewItem = () => {
  return (
    <MarketLayout>
      <CreateNewItemContainer>
        <TitleWrapper>Create New Item</TitleWrapper>
        <FieldWrapper>
          <FiledTitle className="title" required={true}>
            Image, Video, Audio
          </FiledTitle>
          <FieldSubscription className="subscription" variant="h6">
            File type supported: JPG, PNG, GIF, MP4. Max size: 100 MB
          </FieldSubscription>
          <ImageSelector />
        </FieldWrapper>

        <FieldWrapper>
          <FiledTitle className="title" required={true}>
            Name
          </FiledTitle>
          <CustomTextField variant="outlined" fullWidth size="small" />
        </FieldWrapper>

        <FieldWrapper>
          <FiledTitle className="title">External link</FiledTitle>
          <FieldSubscription className="subscription" variant="h6">
            NTal will include a link to this URL on this item&lsquo;s detail page, so that users can
            click to learn more about it. You are welcome to link to your own webpage with more
            details.
          </FieldSubscription>
          <CustomTextField variant="outlined" fullWidth size="small" />
        </FieldWrapper>

        <FieldWrapper>
          <FiledTitle className="title">Description</FiledTitle>
          <FieldSubscription className="subscription" variant="h6">
            NTal will include a link to this URL on this item&lsquo;s detail page, so that users can
            click to learn more about it. You are welcome to link to your own webpage with more
            details.
          </FieldSubscription>
          <CustomTextarea maxRows={5} minRows={5} />
        </FieldWrapper>

        <FieldWrapper>
          <FiledTitle className="title">Collection</FiledTitle>
          <FieldSubscription className="subscription" variant="h6">
            This is the collection where your item will appear.
          </FieldSubscription>
          <CustomSelect
            name="level"
            // value={values.level}
            defaultValue="collection"
            fullWidth
            size="small"
          >
            <MenuItem value="collection">Collection</MenuItem>
          </CustomSelect>
        </FieldWrapper>
      </CreateNewItemContainer>
    </MarketLayout>
  );
};

export default CreateNewItem;
