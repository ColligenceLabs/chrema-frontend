import React, { useState } from 'react';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import { Box, Button, Container, Menu, MenuItem, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageSelector from '../../components/ImageSelector/ImageSelector';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomTextarea from '../../components/forms/custom-elements/CustomTextarea';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { useNavigate } from 'react-router-dom';

const CreateNewItemContainer = styled(Container)`
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
  display: flex;
  justify-content: space-between;
  color: rgb(112, 122, 131);
  font-size: 12px;
  font-weight: 500;
`;

const CreateCollection = styled('div')(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 600,
  color: theme.palette.primary.main,
  cursor: 'pointer',
}));

const StyledMenuItem = styled(MenuItem)`
  padding: 10px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid rgb(229, 232, 235);
  &:last-child {
    border-bottom: none;
  }
`;

const categories = [
  {
    id: 0,
    value: 'picture',
    caption: 'Picture',
  },
  {
    id: 1,
    value: 'painting',
    caption: 'Painting',
  },
  {
    id: 2,
    value: 'illustrate',
    caption: 'Illustrate',
  },
  {
    id: 3,
    value: 'design',
    caption: 'Design',
  },
  {
    id: 4,
    value: 'character',
    caption: 'Character',
  },
  {
    id: 5,
    value: 'other',
    caption: 'Other',
  },
];

const CreateNewItem = () => {
  const navigate = useNavigate();

  const [nftItem, setNftItem] = useState(null);
  const [collection, setCollection] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(0);
  const [price, setPrice] = useState('');

  const moveToPage = () => {
    navigate('/market/mycollection');
  };

  return (
    <MarketLayout>
      <CreateNewItemContainer>
        <TitleWrapper>Create New Item</TitleWrapper>
        <FieldWrapper>
          <FiledTitle required={true}>Image, Video, Audio</FiledTitle>
          <FieldSubscription variant="h6">
            File type supported: JPG, PNG, GIF, MP4. Max size: 100 MB
          </FieldSubscription>
          <ImageSelector />
        </FieldWrapper>

        <FieldWrapper>
          <FiledTitle>Collection</FiledTitle>
          <FieldSubscription variant="h6">
            This is the collection where your item will appear.{' '}
            <CreateCollection onClick={moveToPage}>My Collection</CreateCollection>
          </FieldSubscription>
          <CustomSelect
            name="collection"
            // value={values.level}
            defaultValue="collection"
            fullWidth
            size="small"
            PaperProps={{
              elevation: 0,
              sx: {
                minWidth: '250px',
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 2.2,
                '& .MuiMenu-list': {
                  p: 0,
                },
              },
            }}
          >
            <StyledMenuItem value="collection">Collection</StyledMenuItem>
          </CustomSelect>
        </FieldWrapper>

        <FieldWrapper>
          <FiledTitle required={true}>Name</FiledTitle>
          <CustomTextField variant="outlined" fullWidth size="small" />
        </FieldWrapper>

        <FieldWrapper>
          <FiledTitle>Description</FiledTitle>
          <FieldSubscription variant="h6">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, necessitatibus?
          </FieldSubscription>
          <CustomTextarea maxRows={5} minRows={5} />
        </FieldWrapper>

        <FieldWrapper>
          <FiledTitle>Category</FiledTitle>
          <FieldSubscription variant="h6">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </FieldSubscription>
          <CustomSelect
            name="category"
            // value={values.level}
            defaultValue="category"
            fullWidth
            size="small"
            PaperProps={{
              elevation: 0,
              sx: {
                minWidth: '250px',
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 2.2,
                '& .MuiMenu-list': {
                  p: 0,
                },
              },
            }}
          >
            {categories.map((category) => (
              <StyledMenuItem key={category.id} value={category.value}>
                {category.caption}
              </StyledMenuItem>
            ))}
          </CustomSelect>
        </FieldWrapper>

        <FieldWrapper>
          <FiledTitle>Price</FiledTitle>
          <FieldSubscription variant="h6">Lorem ipsum dolor sit amet.</FieldSubscription>
          <CustomTextField variant="outlined" fullWidth size="small" />
        </FieldWrapper>

        <FieldWrapper>
          <Button variant="contained">Create</Button>
        </FieldWrapper>
      </CreateNewItemContainer>
    </MarketLayout>
  );
};

export default CreateNewItem;
