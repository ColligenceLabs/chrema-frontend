import React, { Dispatch, SetStateAction } from 'react';
import { COLLECTION_CATEGORY } from '../../../Collection/catetories';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

type CategorySelectorProps = {
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
};

const BoxChip = styled(Box)(({ theme, selected }: any) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '5px 20px',
  gap: '10px',
  height: '32px',
  background: selected ? '#3749e9' : '#F7FBFD',
  borderRadius: '16px',
  color: selected ? '#ffffff' : theme.palette.text.primary,
  cursor: 'pointer',
  fontWeight: selected ? '700' : '500',
  fontSize: '16px',
  lineHeight: '22px',
}));

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
      {COLLECTION_CATEGORY.map((item, index) => (
        <BoxChip
          key={index}
          selected={selectedCategory === item.value}
          onClick={() => setSelectedCategory(item.value)}
        >
          {item.title}
        </BoxChip>
      ))}
    </Box>
  );
};

export default CategorySelector;
