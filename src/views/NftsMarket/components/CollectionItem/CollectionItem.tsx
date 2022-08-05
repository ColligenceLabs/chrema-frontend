import React from 'react';
import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { CollectionItemType } from '../../types';
import ImageViewer from '../../../../components/ImageViewer';
import useMediaQuery from '@mui/material/useMediaQuery';

const CollectionItem: React.FC<CollectionItemType> = ({
  id,
  name,
  cover_image,
  description,
  creator_image,
  creator_fullName,
  onSale,
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const avatarImage = creator_image?.replace(
    'https://nftbedev.talken.io/taalNft/uploads',
    'http://localhost:4000/taalNft',
  );

  return (
    <>
      <Link to={`/market/collection/${id}`} style={{ textDecoration: 'none' }}>
        <Card
          sx={{
            p: 0,
            m: smDown ? 0.5 : 1,
            mt: 2,
            textDecoration: 'none',
            transition: 'all .2s ease-in-out',
            border: '0.1px solid #d6d6d6',
            borderRadius: '25px',
            '&:hover': {
              transform: `translateY(-${theme.spacing(1 / 2)})`,
            },
            // minHeight: smDown ? '150px' : '400px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <ImageViewer src={cover_image} alt={name} height={smDown ? '150px' : '200px'} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50px',
                height: '50px',
                marginTop: '-25px',
                border: '3px solid #f1f1f1f1',
                borderRadius: '100%',
                p: 3,
              }}
            >
              <Avatar
                src={avatarImage}
                alt={'avatarImage'}
                sx={{
                  width: '50px',
                  height: '50px',
                }}
              />
            </Box>
          </Box>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant={smDown ? 'caption' : 'h4'}>
              {name.length > 20 ? `${name.slice(0, 20)}...` : name}
            </Typography>
            <Box
              sx={{
                display: 'flex',

                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // gap: '0.2rem',
                mb: smDown ? '0px' : '10px',
              }}
            >
              <Typography variant={'caption'}>by </Typography>
              <Typography variant={'caption'} color={'primary'}>
                {creator_fullName}
              </Typography>
            </Box>

            {!smDown && (
              <Typography variant="body2" color="text.secondary" sx={{ minHeight: '61px' }}>
                {description && description.length > 70
                  ? `${description.slice(0, 67)}...`
                  : description}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Link>
    </>
  );
};

export default CollectionItem;
