import React from 'react';
import Box from '@mui/material/Box';

interface Props {
  children: React.ReactNode | React.ReactNode[];
  // All other props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

const Container = ({ children, ...rest }: Props): JSX.Element => (
  <Box
    // maxWidth={{ sm: 720, md: 1400 }}
    width={1}
    margin={'0 auto'}
    paddingX={5}
    paddingY={{ xs: 4, sm: 6, md: 8 }}
    {...rest}
  >
    {children}
  </Box>
);

export default Container;
