import Caver from 'caver-js';
import kip17Abi from '../config/abi/kip17.json';
import erc721Abi from '../config/abi/erc721.json';
import kip37Abi from '../config/abi/kip37.json';
import erc1155Abi from '../config/abi/erc1155.json';
import { ethers } from 'ethers';
import contracts from '../config/constants/contracts';
import tokenAbi from '../config/abi/erc20.json';

export const getNftContract = (library, contract, type) => {
  const isKaikas = library.connection.url !== 'metamask' && library.connection.url !== 'eip-1193:';
  const chainId = library._network.chainId;
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
      library?.getSigner(),
    );
  }
};

export const getKipContract = (library, contract, type) => {
  if (type === 'SPLToken' || !contract) return;
  const isKaikas = library.connection.url !== 'metamask' && library.connection.url !== 'eip-1193:';
  const abi = type === 'KIP17' ? kip17Abi : kip37Abi;
  if (isKaikas) {
    const caver = new Caver(window.klaytn);
    return new caver.klay.Contract(abi, contract);
  } else {
    return new ethers.Contract(contract, abi, library?.getSigner());
  }
};

export const getTokenContract = (library) => {
  const tokenAddress = contracts.quoteToken[process.env.REACT_APP_MAINNET === 'true' ? 1 : 5];
  if (library.connection.url === 'metamask' || library.connection.url === 'eip-1193:')
    return new ethers.Contract(tokenAddress, tokenAbi, library?.getSigner());
  else {
    const caver = new Caver(window.klaytn);
    return new caver.klay.Contract(tokenAbi, tokenAddress);
  }
};
