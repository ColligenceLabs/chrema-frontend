import type { AddEthereumChainParameter } from '@web3-react/types';

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
};

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
};

const CELO: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Celo',
  symbol: 'CELO',
  decimals: 18,
};

const KLAY: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Klay',
  symbol: 'KLAY',
  decimals: 18,
};

interface BasicChainInformation {
  urls: string[];
  name: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency'];
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls'];
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation,
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    };
  } else {
    return chainId;
  }
}

const infuraUrl = (network: string) =>
  process.env.REACT_APP_INFURA_KEY
    ? `https://${network}.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
    : undefined;
const alchemyUrl = (network: string) =>
  process.env.REACT_APP_ALCHEMY_KEY
    ? `https://${network}.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}`
    : undefined;

type ChainConfig = { [chainId: number]: BasicChainInformation | ExtendedChainInformation };

export const MAINNET_CHAINS: ChainConfig = {
  1: {
    // @ts-ignore
    urls: [infuraUrl('mainnet'), alchemyUrl('eth-mainnet'), 'https://cloudflare-eth.com'].filter(
      Boolean,
    ),
    name: 'Mainnet',
  },
  10: {
    // @ts-ignore
    urls: [infuraUrl('optimism-mainnet'), 'https://mainnet.optimism.io'].filter(Boolean),
    name: 'Optimism',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
  42161: {
    // @ts-ignore
    urls: [infuraUrl('arbitrum-mainnet'), 'https://arb1.arbitrum.io/rpc'].filter(Boolean),
    name: 'Arbitrum One',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  137: {
    // @ts-ignore
    urls: [infuraUrl('polygon-mainnet'), 'https://polygon-rpc.com'].filter(Boolean),
    name: 'Polygon Mainnet',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  42220: {
    urls: ['https://forno.celo.org'],
    name: 'Celo',
    nativeCurrency: CELO,
    blockExplorerUrls: ['https://explorer.celo.org'],
  },
  8217: {
    urls: ['https://public-en.kaikas.io/v1/cypress'],
    name: 'Cypress',
    nativeCurrency: KLAY,
    blockExplorerUrls: ['https://www.klaytnfinder.io/'],
  },
};

export const TESTNET_CHAINS: ChainConfig = {
  5: {
    // @ts-ignore
    urls: [infuraUrl('goerli')].filter(Boolean),
    name: 'Görli',
  },
  420: {
    // @ts-ignore
    urls: [infuraUrl('optimism-goerli'), 'https://goerli.optimism.io'].filter(Boolean),
    name: 'Optimism Goerli',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://goerli-explorer.optimism.io'],
  },
  421613: {
    // @ts-ignore
    urls: [infuraUrl('arbitrum-goerli'), 'https://goerli-rollup.arbitrum.io/rpc'].filter(Boolean),
    name: 'Arbitrum Goerli',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://testnet.arbiscan.io'],
  },
  80001: {
    // @ts-ignore
    urls: [infuraUrl('polygon-mumbai')].filter(Boolean),
    name: 'Polygon Mumbai',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
  44787: {
    urls: ['https://alfajores-forno.celo-testnet.org'],
    name: 'Celo Alfajores',
    nativeCurrency: CELO,
    blockExplorerUrls: ['https://alfajores-blockscout.celo-testnet.org'],
  },
  1001: {
    urls: ['https://public-en.kaikas.io/v1/baobab'],
    name: 'Baobab',
    nativeCurrency: KLAY,
    blockExplorerUrls: ['https://baobab.klaytnfinder.io/'],
  },
};

export const CHAINS: ChainConfig = {
  ...MAINNET_CHAINS,
  ...TESTNET_CHAINS,
};

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{
  [chainId: number]: string[];
}>((accumulator, chainId) => {
  const validURLs: string[] = CHAINS[Number(chainId)].urls;

  if (validURLs.length) {
    accumulator[Number(chainId)] = validURLs;
  }

  return accumulator;
}, {});
