import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import type { Connector } from '@web3-react/types';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';

import { hooks as metaMaskHooks, metaMask } from './connectors/metaMask';
import { hooks as walletConnectV2Hooks, walletConnectV2 } from './connectors/walletConnect';
import { hooks as kaikasHooks, kaikas } from './connectors/kaikas';

export function getName(connector: Connector) {
  if (connector instanceof MetaMask) return 'MetaMask';
  if (connector instanceof WalletConnectV2) return 'WalletConnect V2';
  if (connector instanceof CoinbaseWallet) return 'Coinbase Wallet';
  if (connector instanceof Network) return 'Network';
  if (connector instanceof GnosisSafe) return 'Gnosis Safe';
  return 'Unknown';
}

export function getConnector(): any {
  const wallet = window.localStorage.getItem('wallet') ?? 'injected';
  if (wallet === 'injected' || wallet === 'metamask') {
    return metaMask;
  } else if (wallet === 'walletconnect' || wallet === 'walletConnector') {
    return walletConnectV2;
  } else if (wallet === 'kaikas') {
    return kaikas;
  } else {
    return null;
  }
}

export function getConnectorHooks(): any {
  const wallet = window.localStorage.getItem('wallet') ?? 'injected';
  console.log('--- wallet ----------------------->', wallet);
  if (wallet === 'injected' || wallet === 'metamask') {
    return metaMaskHooks;
  } else if (wallet === 'walletconnect' || wallet === 'walletConnector') {
    return walletConnectV2Hooks;
  } else if (wallet === 'kaikas') {
    return kaikasHooks;
  } else {
    return metaMaskHooks;
  }
}
