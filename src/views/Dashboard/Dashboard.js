import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';

import PageContainer from '../../components/container/PageContainer';
import TotalNFTs from './components/TotalNFTs';
import Last30days from './components/Last30days';
import { getSummaryPie } from '../../services/dashboard.service';
import SummaryCard from './components/SummaryCard';

const Dashboard = () => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState({});
  const [totalNfts, setTotalNfts] = useState({});

  const fetchSummayData = async () => {
    await getSummaryPie().then((res) => {
      setSummary(res.data.summary);
      setTotalNfts(res.data.pie_chart);
    });
  };
  useEffect(() => {
    fetchSummayData();
  }, []);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard PAGE">
      <Grid container spacing={0}>
        {/* ------------------------- row 1 ------------------------- */}
        <Grid item xs={12} sm={6} lg={3} xl={3}>
          <SummaryCard
            title={t('NFTs')}
            icon="inbox"
            value={summary.nfts || 'Loading...'}
            color="#26c6da"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} xl={3}>
          <SummaryCard
            title={t('AirDrops')}
            icon="file-plus"
            value={summary.airdrops || 'Loading...'}
            color="#6ac3fd"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} xl={3}>
          <SummaryCard
            title={t('Creator')}
            icon="video"
            value={summary.creators || 'Loading...'}
            color="#f64e60"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3} xl={3}>
          <SummaryCard
            title={t('Transactions')}
            icon="credit-card"
            value={summary.transactions || 'Loading...'}
            color="#ffa800"
          />
        </Grid>

        {/* ------------------------- row 2 ------------------------- */}
        <Grid item xs={12} lg={8}>
          <Last30days />
        </Grid>
        <Grid item xs={12} lg={4}>
          <TotalNFTs chartData={totalNfts} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};
export default Dashboard;
