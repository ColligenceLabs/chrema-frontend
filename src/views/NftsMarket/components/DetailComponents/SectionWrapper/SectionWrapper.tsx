import React, { useState } from 'react';
import { Box, SvgIconProps, Typography } from '@mui/material';
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
  // icon,
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
          // paddingTop: 2,
          // paddingX: 2,
          padding: showChildren ? '20px 20px 0px 20px' : '20px',
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
          {typeof title === 'string' ? (
            <Typography
              sx={{ fontSize: '24px', fontWeight: 700, lineHeight: '24px', color: '#706C83' }}
            >
              {title}
            </Typography>
          ) : (
            title
          )}
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
