import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const PageContainer = ({ title, description, children }) => (
  <div>
    <Helmet>
      <title>{process.env.REACT_APP_SITE_TITLE}</title>
      <meta name="description" content={process.env.REACT_APP_SITE_DSCRIPTION} />
    </Helmet>
    {children}
  </div>
);

PageContainer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
};

export default PageContainer;
