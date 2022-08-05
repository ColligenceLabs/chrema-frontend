import klayLogo from '../../assets/images/network_icon/klaytn-klay-logo.png';
import solLogo from '../../assets/images/network_icon/solana-sol-logo.png';
import ethLogo from '../../assets/images/network_icon/ethereum-eth-logo.png';
import bnbLogo from '../../assets/images/network_icon/binance-bnb-logo.png';

const NETWORKS = [
  {
    id: 0,
    value: 'ethereum',
    label: 'Ethereum',
    icon: ethLogo,
  },
  {
    id: 1,
    value: 'klaytn',
    label: 'Klaytn',
    icon: klayLogo,
  },
  {
    id: 2,
    value: 'solana',
    label: 'Solana',
    icon: solLogo,
  },
  {
    id: 3,
    value: 'binance',
    label: 'Binance',
    icon: bnbLogo,
  },
];

export default NETWORKS;
