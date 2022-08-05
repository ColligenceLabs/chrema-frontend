import React from 'react';
import { Box, useTheme } from '@mui/material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';

interface ViewModeSelectorProp {
  showLarge: boolean;
  onClickViewMode: (flag: boolean) => void;
}
const ViewModeSelector: React.FC<ViewModeSelectorProp> = ({ showLarge, onClickViewMode }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        border: `1px solid ${
          theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#dee3e9'
        }`,
        borderRadius: '5px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: showLarge ? `${theme.palette.primary.main}` : '',
          color: showLarge ? `white` : 'text.secondary',
          px: '10px',
          borderBottomLeftRadius: '5px',
          borderTopLeftRadius: '5px',
        }}
      >
        <GridViewRoundedIcon fontSize={'medium'} onClick={() => onClickViewMode(true)} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: !showLarge ? `${theme.palette.primary.main}` : '',
          color: !showLarge ? `white` : 'text.secondary',
          px: '10px',
          borderBottomRightRadius: '5px',
          borderTopRightRadius: '5px',
        }}
      >
        <AppsRoundedIcon fontSize={'medium'} onClick={() => onClickViewMode(false)} />
      </Box>
    </Box>
  );
};

export default ViewModeSelector;
