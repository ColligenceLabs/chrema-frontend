import React, { useEffect } from 'react';
import { Box, CircularProgress, Grid, Typography, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import useSWR from 'swr';
import CollectionItem from '../CollectionItem';
import { styled } from '@mui/material/styles';
import Container from '../Container';
import Slider from 'react-slick';

const AllCategorySection = styled(Container)`
  //max-width: 1500px;
`;

const StyledPrevArrow = styled(Box)`
  z-index: 1000;
`;

export const StyledSlider = styled(Slider)`
  height: 90%; //슬라이드 컨테이너 영역

  .slick-list {
    //슬라이드 스크린
    width: 100%;
    height: 100%;
    margin: 0 auto;
    overflow-x: hidden;
    background: white;
  }

  //.slick-slide div {
  //  //슬라이더  컨텐츠
  //  /* cursor: pointer; */
  //}

  .slick-dots {
    //슬라이드의 위치
    bottom: 20px;
    margin-top: 200px;
  }

  //.slick-track {
  //  //이건 잘 모르겠음
  //  width: 100%;
  //}
`;

function PrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <StyledPrevArrow
      className={className}
      style={{
        ...style,
        left: '25px',
      }}
      onClick={onClick}
    />
  );
}

function NextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <StyledPrevArrow
      className={className}
      style={{
        ...style,
        right: '25px',
      }}
      onClick={onClick}
    />
  );
}

type CategorySectionProps = {
  title: string;
  category: string;
};
const fetcher = (url: string) => fetch(url).then((res) => res.json());
const CategorySection: React.FC<CategorySectionProps> = ({ title, category }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const mdDown = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: true,
  });
  const url = `${
    process.env.REACT_APP_API_SERVER
  }/admin-api/home/indexs?page=1&perPage=4&category=${category === 'all' ? '' : category}`;
  const { data, mutate, error } = useSWR(url, fetcher);

  const isEmpty = data?.data?.items.length === 0;

  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: smDown ? 1 : mdDown ? 2 : 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  useEffect(() => {
    mutate();
  }, []);

  return (
    <AllCategorySection>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          mb: '50px',
        }}
      >
        <Typography variant={smDown ? 'h3' : 'h1'} fontWeight={'700'} color={'primary'}>
          {title}
        </Typography>
      </Box>
      {smDown ? (
        <StyledSlider {...settings}>
          {!error &&
            data &&
            data.data.items.map((item: any) => (
              <CollectionItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                cover_image={item.image_link}
                creator_image={item.logo_image}
                creator_fullName={item?.creator_id?.full_name}
                onSale={false}
              />
            ))}
        </StyledSlider>
      ) : (
        <Grid container>
          {!error &&
            data &&
            data.data.items.map((item: any) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                <CollectionItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  cover_image={item.image_link}
                  creator_image={item.logo_image}
                  creator_fullName={item?.creator_id?.full_name}
                  onSale={false}
                />
              </Grid>
            ))}
        </Grid>
      )}

      {isEmpty && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            border: '1px solid #d6d6d6',
            borderRadius: '30px',
            height: '300px',
            m: '15px',
            flexWrap: 'nowrap',
          }}
        >
          <Typography variant={'h2'}>No items to display</Typography>
        </Box>
      )}
      {!error && data === undefined && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            border: '1px solid #d6d6d6',
            borderRadius: '30px',
            height: '300px',
            m: '15px',
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }} variant={'h4'} color={'primary'}>
            Loading...
          </Typography>
        </Box>
      )}
    </AllCategorySection>
  );
};

export default CategorySection;
