import contracts from '../config/constants/contracts';

const splitAddress = (str = '', length = 5) => {
  const contract = contracts.market[process.env.REACT_APP_MAINNET === 'true' ? 8217 : 1001];
  if (!str || str === '' || str === '0x0000000000000000000000000000000000000000') return '-';
  if (str === contract) return 'Market';
  return str.substr(0, length) + '...' + str.substr(str.length - length, str.length);
};

export default splitAddress;
