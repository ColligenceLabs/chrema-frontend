import { initializeConnector } from '@web3-react/core';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';

import { MAINNET_CHAINS, CHAINS } from '../chains';

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
export const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
  (actions) =>
    new WalletConnectV2({
      actions,
      options: {
        // @ts-ignore
        projectId: process.env.REACT_APP_WALLETCONNECT_ID,
        chains: Object.keys(CHAINS).map(Number),
      },
    }),
);
