import contracts from '../config/constants/contracts';

const splitAddress = (str = '') => {
  const contract = contracts.market[process.env.REACT_APP_MAINNET === 'true' ? 8217 : 1001];
  if (!str || str === '' || str === '0x0000000000000000000000000000000000000000') return '-';
  if (str === contract) return 'Market';
  return str.substr(0, 5) + '...' + str.substr(str.length - 5, str.length);
};

export default splitAddress;
