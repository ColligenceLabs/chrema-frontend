import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Popover, SvgIcon, Box, MenuItem } from '@mui/material';
import { ReactComponent as ICON_KR } from '../../assets/images/flag-icon/kr.svg';
import { ReactComponent as ICON_EN } from '../../assets/images/flag-icon/um.svg';

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

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const storageLang = localStorage.getItem('cur_language') || 'en';
  let currentLang = LANGS.find((_lang) => _lang.value === storageLang);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setAnchorEl(null);
    localStorage.setItem('cur_language', lng);
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <SvgIcon>{currentLang.icon}</SvgIcon>
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
        {LANGS.map((option) => (
          // <MenuItem
          //   key={option.value}
          //   // selected={option.value === storageLang}
          //   onClick={() => handleChangeLanguage(option.value)}
          // >
          <IconButton key={option.value} onClick={() => handleChangeLanguage(option.value)}>
            <SvgIcon>
              {/*<img src={icon_en} alt="lang" />*/}
              {option.icon}
            </SvgIcon>
          </IconButton>
        ))}
        {/*</Box>*/}
      </Popover>
    </div>
  );
};

export default LanguageSelector;
