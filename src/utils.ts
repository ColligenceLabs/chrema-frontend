import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { Kaikas } from '@colligence/web3-react-kaikas';
import type { Connector } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect';

import { hooks as metaMaskHooks, metaMask } from './connectors/metaMask';
import { hooks as walletConnectHooks, walletConnect } from './connectors/walletConnect';
import { hooks as kaikasHooks, kaikas } from './connectors/kaikas';

export function getName(connector: Connector) {
  if (connector instanceof MetaMask) return 'MetaMask';
  if (connector instanceof WalletConnect) return 'WalletConnect';
  if (connector instanceof CoinbaseWallet) return 'Coinbase Wallet';
  if (connector instanceof Network) return 'Network';
  if (connector instanceof GnosisSafe) return 'Gnosis Safe';
  if (connector instanceof Kaikas) return 'Kaikas';
  return 'Unknown';
}

export function getConnector(): any {
  const wallet = window.localStorage.getItem('wallet') ?? 'injected';
  if (wallet === 'injected' || wallet === 'metamask') {
    return metaMask;
  } else if (wallet === 'walletconnect' || wallet === 'walletConnector') {
    return walletConnect;
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
    return walletConnectHooks;
  } else if (wallet === 'kaikas') {
    return kaikasHooks;
  } else {
    return metaMaskHooks;
  }
}
