import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { NFTType } from '../../types';
import klayLogo from '../../../../assets/images/network_icon/klaytn-klay-logo.png';
import talkLogo from '../../../../assets/images/logos/talken_icon.png';
import bnbLogo from '../../../../assets/images/network_icon/binance-bnb-logo.png';

// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import ImageViewer from '../../../../components/ImageViewer';
import useMediaQuery from '@mui/material/useMediaQuery';
import getNftPrice from '../../../../utils/getNftPrice';
import ReactPlayer from 'react-player';
import sliceFloatNumber from '../../../../utils/sliceFloatNumber';

interface NFTItemProp {
  item: NFTType;
  showLarge?: boolean;
}
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              zIndex: 1000,
              pt: 1.5,
              pr: 2,
            }}
          >
            <Box
              sx={{
                border: '3px solid white',
                borderRadius: '50%',
                backgroundColor: 'gray',
                opacity: item?.metadata?.content_Type === 'mp4' ? 0.6 : 0,
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              boxShadow={3}
            >
              <FeatherIcon icon="video" height="24" color={'white'} />
            </Box>
          </Box>

          {(item?.metadata?.thumbnail !== undefined && item?.metadata?.thumbnail.indexOf('.mp4')) >
            0 ||
          (item?.metadata?.image.indexOf('.mp4') !== undefined &&
            item?.metadata?.image.indexOf('.mp4')) > 0 ||
          item?.collection_id._id === '62b274452fb89e40a2bca0bc' ? (
            <Box
              className={'player-wrapper'}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
            >
              <ReactPlayer
                className="react-player"
                config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                url={item?.metadata?.thumbnail || item?.metadata?.image}
                width="100%"
                // height="100%"
                height={mdDown ? (showLarge ? '218px' : '170px') : showLarge ? '218px' : '118px'}
                controls={true}
                light={false}
                pip={true}
                playIcon={<button>Play</button>}
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
