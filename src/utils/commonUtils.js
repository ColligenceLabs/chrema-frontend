import { bnbTargetNetwork, targetNetwork } from '../config';

export function getChainId(targetNetworkName) {
  if (targetNetworkName === 'binance') {
    return parseInt(bnbTargetNetwork);
  } else if (targetNetworkName === 'klaytn') {
    return parseInt(targetNetwork);
  } else if (targetNetworkName === 'ethereum') {
    return parseInt('3');
  }
}