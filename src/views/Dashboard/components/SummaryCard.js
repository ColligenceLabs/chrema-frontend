import React from 'react';
import { Card, CardContent, Typography, Box, Fab } from '@mui/material';

import FeatherIcon from 'feather-icons-react';

const SummaryCard = (props) => {
  const { title, icon, value, color } = props;
  return (
    <Card
      sx={{
        backgroundColor: `${color}`,
        color: 'white',
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="flex-start">
          <Typography
            variant="h3"
            sx={{
              marginBottom: '0',
            }}
            gutterBottom
          >
            {title}
          </Typography>
          <Box
            sx={{
              marginLeft: 'auto',
            }}
          >
            <Fab
              size="small"
              color=""
              aria-label="add"
              elevation="0"
              sx={{
                boxShadow: 'none',
              }}
            >
              <FeatherIcon icon={icon} />
            </Fab>
          </Box>
        </Box>
        <Typography
          variant="h1"
          fontWeight="500"
          sx={{
            marginBottom: '0',
            marginTop: '15px',
          }}
          gutterBottom
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
