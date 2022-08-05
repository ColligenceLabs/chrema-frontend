import React, { useState, useEffect } from 'react';
import { Box, MenuItem, Typography, Avatar, Button, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import adminImage from '../../../assets/images/users/admin.png';
import creatorImage from '../../../assets/images/users/creator.png';
import userImage from '../../../assets/images/users/user.png';

const ProfileDropdown = ({ useMarket, fullName, email, level, image }) => {
  const [userimg, setUserimg] = useState('');

  useEffect(() => {
    if (image === undefined || image === null || image === '') {
      setUserimg(userImage);
    } else {
      setUserimg(
        image?.replace(
          'https://nftbedev.talken.io/taalNft/uploads',
          'http://localhost:4000/taalNft',
        ),
      );
    }
  }, [image]);

  return (
    <Box>
      <Box
        sx={{
          pb: 3,
          mt: 3,
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            src={userimg}
            alt={userimg}
            sx={{
              width: '90px',
              height: '90px',
            }}
          />
          <Box
            sx={{
              ml: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                lineHeight: '1.235',
              }}
            >
              {fullName}
            </Typography>
            <Typography color="textSecondary" variant="h6" fontWeight="400">
              {level}
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography
                color="textSecondary"
                display="flex"
                alignItems="center"
                sx={{
                  color: (theme) => theme.palette.grey.A200,
                  mr: 1,
                }}
              >
                <FeatherIcon icon="mail" width="18" />
              </Typography>
              <Typography color="textSecondary" variant="h6">
                {email}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider
        style={{
          marginTop: 0,
          marginBottom: 0,
        }}
      />

      <Box>
        <MenuItem
          sx={{
            pt: 3,
            pb: 3,
          }}
          component={Link}
          to={useMarket ? '/market/profile' : '/profile'}
        >
          <Box display="flex" alignItems="center">
            <Button
              sx={{
                backgroundColor: (theme) => theme.palette.primary.light,
                color: (theme) => theme.palette.primary.main,
                boxShadow: 'none',
                minWidth: '50px',
                width: '45px',
                height: '40px',
                borderRadius: '10px',
              }}
            >
              <FeatherIcon icon="dollar-sign" width="18" height="18" color={'white'} />
            </Button>

            <Box
              sx={{
                ml: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  lineHeight: '1.235',
                }}
              >
                My Profile
              </Typography>
              <Typography color="textSecondary" variant="h6" fontWeight="400">
                Account Settings
              </Typography>
            </Box>
          </Box>
        </MenuItem>
        <Divider
          style={{
            marginTop: 0,
            marginBottom: 0,
          }}
        />
      </Box>
    </Box>
  );
};

export default ProfileDropdown;
