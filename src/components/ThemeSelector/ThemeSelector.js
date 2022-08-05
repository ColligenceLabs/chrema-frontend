import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, Popover, SvgIcon, Box, MenuItem } from '@mui/material';
import { ReactComponent as ICON_KR } from '../../assets/images/flag-icon/kr.svg';
import { ReactComponent as ICON_EN } from '../../assets/images/flag-icon/um.svg';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { setDarkMode } from '../../redux/customizer/Action';

export const LANGS = [
  {
    value: 'ko',
    label: '대한민국',
    icon: <ICON_KR />,
  },
  {
    value: 'en',
    label: 'English',
    icon: <ICON_EN />,
  },
];

const ThemeSelector = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const customizer = useSelector((state) => state.CustomizerReducer);
  const dispatch = useDispatch();

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeTheme = (value) => {
    dispatch(setDarkMode(value));
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        {customizer.activeMode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <IconButton value="light" name="light" onClick={() => handleChangeTheme('light')}>
          <LightModeIcon />
        </IconButton>
        <IconButton value="dark" name="dark" onClick={() => handleChangeTheme('dark')}>
          <DarkModeIcon />
        </IconButton>
      </Popover>
    </div>
  );
};

export default ThemeSelector;
