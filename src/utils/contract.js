import Caver from 'caver-js';
import kip17Abi from '../config/abi/kip17.json';
import erc721Abi from '../config/abi/erc721.json';
import kip37Abi from '../config/abi/kip37.json';
import erc1155Abi from '../config/abi/erc1155.json';
import { ethers } from 'ethers';
import contracts from '../config/constants/contracts';
import tokenAbi from '../config/abi/erc20.json';

export const getNftContract = (chainId, account, provider, contract, type) => {
  const isKaikas =
    provider.connection.url !== 'metamask' && provider.connection.url !== 'eip-1193:';
  // const chainId = library._network.chainId;
  if (isKaikas) {
    const caver = new Caver(window.klaytn);
    return new caver.klay.Contract(type === 'KIP17' ? kip17Abi : kip37Abi, contract);
  } else {
    return new ethers.Contract(
      contract,
      type === 'KIP17'
        ? chainId === 1001 || chainId === 8217
          ? kip17Abi
          : erc721Abi
        : chainId === 1001 || chainId === 8217
        ? kip37Abi
        : erc1155Abi,
      provider.getSigner(account),
    );
  }
};

export const getKipContract = (provider, contract, type) => {
  if (type === 'SPLToken' || !contract) return;
  const isKaikas =
    provider.connection.url !== 'metamask' && provider.connection.url !== 'eip-1193:';
  const abi = type === 'KIP17' ? kip17Abi : kip37Abi;
  if (isKaikas) {
    const caver = new Caver(window.klaytn);
    return new caver.klay.Contract(abi, contract);
  } else {
    return new ethers.Contract(contract, abi, library?.getSigner());
  }
};

export const getTokenContract = (provider, account) => {
  const tokenAddress = contracts.quoteToken[process.env.REACT_APP_MAINNET === 'true' ? 1 : 5];
  if (provider.connection.url === 'metamask' || provider.connection.url === 'eip-1193:')
    return new ethers.Contract(tokenAddress, tokenAbi, provider.getSigner(account));
  else {
    const caver = new Caver(window.klaytn);
    return new caver.klay.Contract(tokenAbi, tokenAddress);
  }
};
