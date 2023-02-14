import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect';

import { MAINNET_CHAINS, CHAINS, URLS } from '../chains';

// valletconnect ver. 1
// export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
//   (actions) =>
//     new WalletConnect({
//       actions,
//       options: {
//         rpc: URLS,
//       },
//     }),
// );

// valletconnect ver. 2
export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect({
      actions,
      options: {
        // @ts-ignore
        projectId: process.env.REACT_APP_WALLETCONNECT_ID,
        chains: Object.keys(CHAINS).map(Number),
      },
      defaultChainId: 10,
    }),
);
