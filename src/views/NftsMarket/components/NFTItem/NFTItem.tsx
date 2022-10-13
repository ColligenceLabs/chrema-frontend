import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
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

  return (
    <>
      <Link to={`/market/detail/${item._id}`} style={{ textDecoration: 'none' }}>
        <Card
          sx={{
            position: 'relative',
            p: 0,
            textDecoration: 'none',
            transition: 'all .2s ease-in-out',
            border: '0.1px solid #d6d6d6',
            borderRadius: '25px',
            '&:hover': {
              transform: `translateY(-${theme.spacing(1 / 2)})`,
            },
            zIndex: 80,
            m: smDown ? '5px' : '10px',
          }}
        >
          {item.quantity_selling === 0 ? (
            <CChip size="small" label="Sold out" color="error" />
          ) : (
            <CChip size="small" label="On Sale" color="primary" />
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              zIndex: 1000,
              // pt: 1.5,
              pr: 2,
            }}
          ></Box>

          {(item?.metadata?.thumbnail !== undefined && item?.metadata?.thumbnail.indexOf('.mp4')) >
            0 ||
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
                sx={{ objectFit: 'cover', zIndex: -1 }}
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
                zIndex: -1,
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
                sx={{ p: 1, mb: 0.5 }}
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ImageViewer
                src={item?.metadata?.alt_url ? item?.metadata?.alt_url : item?.metadata?.image}
                alt={item?.metadata?.name}
                style={{
                  marginTop: '-52px',
                }}
                height={mdDown ? (showLarge ? '270px' : '170px') : showLarge ? '270px' : '170px'}
              />
            </Box>
          )}

          <CardContent sx={{ minHeight: smDown ? '70px' : '109px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'top',
                flexDirection: 'column',
              }}
            >
              <Box>
                <Typography variant={'caption'} color="text.secondary">
                  {/*{item?.collection_id?.name.length > 20*/}
                  {/*  ? `${item?.collection_id?.name.slice(0, 18)}...`*/}
                  {/*  : item?.collection_id?.name}*/}
                  {item?.collection_id?.name}
                </Typography>
                <Typography variant="h6">{item?.metadata?.name}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: smDown || !showLarge ? 'column' : 'row',
                  // alignItems: 'center',
                  mt: '10px',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Price
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {item?.floor_quote === 'klay' && <img src={klayLogo} alt="klay" height="16px" />}
                  {item?.floor_quote === 'talk' && <img src={talkLogo} alt="talk" height="16px" />}
                  {item?.floor_quote === 'bnb' && <img src={bnbLogo} alt="bnb" height="16px" />}
                  {item?.floor_quote === 'krw' && (
                    <Typography variant={'subtitle2'} color={'text.primary'} sx={{ mr: -0.7 }}>
                      ￦
                    </Typography>
                  )}
                  <Typography variant="h6">
                    {sliceFloatNumber(
                      getNftPrice(
                        item?.price,
                        item?.floor_price,
                        item?.user_quantity_selling,
                        item?.quantity_selling,
                        item?.last_price,
                      ).toString(),
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Link>
    </>
  );
};

export default NFTItem;
