import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Cache } from 'three';
import clear = Cache.clear;

interface SellingClockProps {
  deadline: string | any;
  checkSellingQuantity: boolean;
  checkListingQuantity: boolean;
}
const SellingClock: React.FC<SellingClockProps> = ({
  deadline,
  checkSellingQuantity,
  checkListingQuantity,
}) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const leading0 = (num: number) => {
    return num < 10 ? '0' + num : num;
  };

  const getTimeUntil = (deadline: string) => {
    const time = Date.parse(deadline) - Date.parse(new Date().toString());
    if (isNaN(time) || time < 0) {
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    } else {
      setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    }
  };

  useEffect(() => {
    clearInterval();
    const interval = setInterval(() => getTimeUntil(deadline), 1000);
    getTimeUntil(deadline);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <>
      {!checkSellingQuantity && !checkListingQuantity ? (
        <></>
      ) : (
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant={'h4'} color={'text.primary'}>
              {leading0(days)}
            </Typography>
            <Typography variant={'h6'} color={'text.secondary'}>
              Days
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant={'h4'} color={'text.primary'}>
              {leading0(hours)}
            </Typography>
            <Typography variant={'h6'} color={'text.secondary'}>
              Hours
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant={'h4'} color={'text.primary'}>
              {leading0(minutes)}
            </Typography>
            <Typography variant={'h6'} color={'text.secondary'}>
              Minutes
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant={'h4'} color={'text.primary'}>
              {leading0(seconds)}
            </Typography>
            <Typography variant={'h6'} color={'text.secondary'}>
              Seconds
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default SellingClock;
