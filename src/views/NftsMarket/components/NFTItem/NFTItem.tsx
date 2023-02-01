import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Box, Button, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { NFTType } from '../../types';
import klayLogo from '../../../../assets/images/network_icon/klaytn-klay-logo.png';
import talkLogo from '../../../../assets/images/logos/talken_icon.png';
import bnbLogo from '../../../../assets/images/network_icon/binance-bnb-logo.png';
import bgImage from '../../../../assets/images/products/s8.jpg';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import ImageViewer from '../../../../components/ImageViewer';
import useMediaQuery from '@mui/material/useMediaQuery';
import getNftPrice from '../../../../utils/getNftPrice';
import sliceFloatNumber from '../../../../utils/sliceFloatNumber';

interface NFTItemProp {
  item: NFTType;
  showLarge?: boolean;
}

const CChip = styled(Chip)`
  position: absolute;
  right: 10px;
  top: 10px;
  border: 1px solid white;
`;

const NFTItem: React.FC<NFTItemProp> = ({ item, showLarge }) => {
  const theme = useTheme();

  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const mdDown = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: true,
  });

  console.log(item);
  return (
    <>
      <Link to={`/market/detail/${item._id}`} style={{ textDecoration: 'none' }}>
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
            {item.metadata?.name.length > 20
              ? `${item?.metadata?.name.slice(0, 20)}...`
              : item?.metadata?.name}
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
            {(item?.metadata?.thumbnail !== undefined &&
              item?.metadata?.thumbnail.indexOf('.mp4')) > 0 ||
            (item?.metadata?.image.indexOf('.mp4') !== undefined &&
              item?.metadata?.image.indexOf('.mp4')) > 0 ||
            item?.collection_id._id === '62b274452fb89e40a2bca0bc' ? (
              <Box
                className={'player-wrapper'}
                sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <CardMedia
                  component="video"
                  sx={{ objectFit: 'cover' }}
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
                  height={mdDown ? (showLarge ? '215px' : '115px') : showLarge ? '215px' : '115px'}
                  src={item?.metadata?.thumbnail || item?.metadata?.image}
                  autoPlay
                  loop
                  muted
                />
              </Box>
            ) : item?.metadata?.image.indexOf('wav') > -1 ? (
              <Box
                className={'player-wrapper'}
                sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  width: '100%',
                  // backgroundColor: 'rgba(199,199,199,0.2)',
                  backgroundImage: `url(${item?.album_jacket})`,
                  backgroundSize: 'cover',
                  // zIndex: -1,
                }}
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
                height={mdDown ? (showLarge ? '215px' : '115px') : showLarge ? '215px' : '115px'}
              >
                <CardMedia
                  component="audio"
                  src={item?.metadata?.thumbnail || item?.metadata?.image}
                  autoPlay={false}
                  // loop
                  // muted
                  controls
                  onTimeUpdate={(e: ChangeEvent<HTMLVideoElement>) => {
                    if (e.target.currentTime > 10) {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }
                  }}
                  sx={{ p: 1, mb: 0.5 }}
                />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ImageViewer
                  src={item?.metadata?.alt_url ? item?.metadata?.alt_url : item?.metadata?.image}
                  alt={item?.metadata?.name}
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
                  // height={mdDown ? (showLarge ? '270px' : '170px') : showLarge ? '270px' : '170px'}
                />
              </Box>
            )}
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
              src={item?.creator_id?.image}
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
                {item?.creator_id?.full_name}
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
                {item?.metadata?.description && item?.metadata?.description.length > 60
                  ? `${item?.metadata?.description.slice(0, 57)}...`
                  : item?.metadata?.description}
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

export default NFTItem;
