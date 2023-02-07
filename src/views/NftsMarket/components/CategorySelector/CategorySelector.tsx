import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { COLLECTION_CATEGORY } from '../../../Collection/catetories';
import { Box, MenuItem, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomTextField from '../../../../components/forms/custom-elements/CustomTextField';

type CategorySelectorProps = {
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
};

// const BoxChip = styled(Box)(({ theme, selected }: any) => ({
//   display: 'flex',
//   flexDirection: 'row',
//   alignItems: 'flex-start',
//   padding: '5px 20px',
//   gap: '10px',
//   height: '32px',
//   background: selected ? '#3749e9' : '#F7FBFD',
//   borderRadius: '16px',
//   color: selected ? '#ffffff' : theme.palette.text.primary,
//   cursor: 'pointer',
//   fontWeight: selected ? '700' : '500',
//   fontSize: '16px',
//   lineHeight: '22px',
// }));

const BoxChip = styled(Typography)<{ theme: any; selected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 5px 20px;
  gap: 10px;
  height: 32px;
  background: ${(props) => (props.selected ? '#3749e9' : '#F7FBFD')};
  border-radius: 16px;
  color: ${(props) => (props.selected ? '#ffffff' : props.theme.palette.text.primary)};
  cursor: pointer;
  font-weight: ${(props) => (props.selected ? 700 : 500)};
  font-size: 16px;
  line-height: 22px;
`;

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  return (
    <>
      {smDown ? (
        <CustomTextField
          select
          id="category"
          name="category"
          SelectProps={{
            value: selectedCategory,
            onChange: (event: ChangeEvent<HTMLSelectElement>) => {
              setSelectedCategory(event.target.value);
            },
          }}
          fullWidth
          size="small"
        >
          {COLLECTION_CATEGORY.map((category) => (
            <MenuItem key={category.value} value={category.value}>
              {category.title}
            </MenuItem>
          ))}
        </CustomTextField>
      ) : (
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
      )}
    </>
  );
};

export default CategorySelector;
