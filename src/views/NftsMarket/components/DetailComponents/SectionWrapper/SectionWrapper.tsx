import React, { useState } from 'react';
import { Box, SvgIconProps, Typography } from '@mui/material';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface SectionWrapperProps {
  title: string | JSX.Element | JSX.Element[];
  icon?: string | React.ReactElement<SvgIconProps>;
  maxHeight?: string | undefined;
  toggled?: boolean | undefined;
  children: JSX.Element | JSX.Element[];
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  title,
  icon,
  children,
  maxHeight,
  toggled = true,
}) => {
  const [showChildren, setShowChildren] = useState(toggled);
  return (
    <Box
      sx={{
        mt: 2,
        border: '0.5px solid #d6d6d6',
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.25rem',
          borderBottom: showChildren ? 0.5 : 0,
          borderColor: '#d6d6d6',
          p: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {typeof icon === 'string' ? <FeatherIcon icon={icon} width="20" /> : icon}
          {typeof title === 'string' ? <Typography variant={'h4'}>{title}</Typography> : title}
        </Box>

        {showChildren ? (
          <KeyboardArrowUpIcon
            sx={{ cursor: 'pointer' }}
            onClick={() => setShowChildren((cur) => !cur)}
          />
        ) : (
          <KeyboardArrowDownIcon
            sx={{ cursor: 'pointer' }}
            onClick={() => setShowChildren((cur) => !cur)}
          />
        )}
      </Box>
      {showChildren && (
        <Box
          sx={{
            overflow: 'hidden',
            overflowY: 'scroll',
            maxHeight: maxHeight === undefined ? '100%' : maxHeight,
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};

export default SectionWrapper;
