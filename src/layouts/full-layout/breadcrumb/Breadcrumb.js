import React from 'react';
import { Grid, Typography, Box, Breadcrumbs, Button } from '@mui/material';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Breadcrumb = ({ subtitle, items, title, children }) => {
  const { t } = useTranslation();
  return (
    <Grid
      container
      sx={{
        p: '15px',
        mb: '15px',
      }}
    >
      <Grid item xs={6} sm={6} lg={8}>
        <Typography color="textSecondary" fontWeight="400" variant="h4">
          {t(`${subtitle}`)}
        </Typography>

        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          {items
            ? items.map((item) => (
                <div key={item.title}>
                  {item.to ? (
                    <Link underline="none" color="inherit" component={NavLink} to={item.to}>
                      {item.title}
                    </Link>
                  ) : (
                    <Typography color="textPrimary">{item.title}</Typography>
                  )}
                </div>
              ))
            : ''}
        </Breadcrumbs>
        <Typography
          fontWeight="700"
          variant="h1"
          sx={{
            lineHeight: '1.235',
          }}
        >
          {t(`${title}`)}
        </Typography>
      </Grid>
    </Grid>
  );
};

Breadcrumb.propTypes = {
  subtitle: PropTypes.string,
  items: PropTypes.array,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default Breadcrumb;
