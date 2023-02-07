import React from 'react';
import { Avatar, Box, Button, Card, CardContent, Typography } from '@mui/material';
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
            p: '20px 22px',
            m: smDown ? 0.5 : 1,
            mt: 2,
            textDecoration: 'none',
            transition: 'all .2s ease-in-out',
            border: '1px solid #DFDFDF',
            borderRadius: '10px',
            // backgroundColor: '#F5F5F5',
            '&:hover': {
              transform: `translateY(-${theme.spacing(1 / 2)})`,
            },
            boxShadow: 0,
          }}
        >
          <Typography sx={{ fontSize: '20px', fontWeight: 700, lineHeight: '26px', mb: '13px' }}>
            {name.length > 20 ? `${name.slice(0, 20)}...` : name}
          </Typography>
          <Box
            sx={{
              width: '100%',
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                paddingBottom: '100%',
              },
            }}
          >
            <ImageViewer
              src={cover_image}
              alt={name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '15px',
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: '20px',
              gap: '1rem',
            }}
          >
            <Avatar
              src={creator_image}
              alt={'avatarImage'}
              sx={{
                width: '40px',
                height: '40px',
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Typography
                sx={{ fontWeight: 400, lineHeight: '22px', fontSize: '14px', color: '#979797' }}
              >
                Seller
              </Typography>
              <Typography sx={{ fontWeight: 700, lineHeight: '22px', fontSize: '16px' }}>
                {creator_fullName}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            {!smDown && (
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '20px',
                  textAlign: 'center',
                  color: '#B9B8BB',
                  minHeight: '40px',
                }}
              >
                {description && description.length > 60
                  ? `${description.slice(0, 57)}...`
                  : description}
              </Typography>
            )}
          </Box>
          <Button
            variant={'contained'}
            fullWidth
            sx={{
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '24px',
              height: '48px',
              borderRadius: '10px',
            }}
          >
            Detail
          </Button>
        </Card>
      </Link>
    </>
  );
};

export default CollectionItem;
