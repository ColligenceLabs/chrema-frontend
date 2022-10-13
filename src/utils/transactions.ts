import { BigNumber, ethers } from 'ethers';
import Caver, { AbiItem } from 'caver-js';
import { FAILURE, SUCCESS } from '../config';
import kip17Abi from '../config/abi/kip17.json';
import erc721Abi from '../config/abi/erc721.json';
import kip37Abi from '../config/abi/kip37.json';
import erc1155Abi from '../config/abi/erc1155.json';
import contracts from '../config/constants/contracts';

export function calculateGasMargin(value: BigNumber) {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000));
}

interface Overrides {
  value?: string | number;
  from: string | null | undefined;
  gasLimit: BigNumber;
  gasPrice?: string;
}

export async function addMinter(
  address: string,
  type: string,
  account: string | undefined | null,
  library: any,
  chainId: number,
): Promise<number> {
  const caver = new Caver(
    process.env.REACT_APP_MAINNET === 'true'
      ? 'https://klaytn.taalswap.info:8651'
      : 'https://api.baobab.klaytn.net:8651',
  );
  // const market = contracts.market[process.env.REACT_APP_MAINNET === 'true' ? 8217 : 1001];
  // @ts-ignore
  const market = contracts.market[chainId];
  const gasPrice = await caver.rpc.klay.getGasPrice();
  const isKaikas = library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:';

  console.log(isKaikas);
  let contract: any;
  const abi =
    type === 'KIP17'
      ? chainId === 1001 || chainId === 8217
        ? kip17Abi
        : erc721Abi
      : chainId === 1001 || chainId === 8217
      ? kip37Abi
      : erc1155Abi;

  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    const klaytnAbi: AbiItem[] = abi as AbiItem[];
    contract = new caver.klay.Contract(klaytnAbi, address);
  } else {
    contract = new ethers.Contract(address, abi, library?.getSigner());
  }

  let tx;
  // gasLimit 계산
  let gasLimit;
  if (isKaikas) {
    gasLimit = await contract.methods.addMinter(market).estimateGas({
      from: account,
    });
  } else gasLimit = await contract.estimateGas.addMinter(market);

  // registerItems 요청
  let receipt;
  try {
    let overrides: Overrides = {
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
    };

    if (isKaikas) {
      tx = await contract.methods
        .addMinter(market)
        .send(overrides)
        .catch(async (err: any) => {
          console.log(err);
          return FAILURE;
        });
      if (tx?.status) {
        return SUCCESS;
      } else return FAILURE;
    } else {
      // if (library._network.chainId === 8217)
      overrides = { ...overrides, gasPrice };

      tx = await contract.addMinter(market, overrides);

      // receipt 대기
      try {
        receipt = await tx.wait();
      } catch (e) {
        return FAILURE;
      }
      if (receipt.status === 1) {
        return SUCCESS;
      } else return FAILURE;
    }
  } catch (e) {
    console.log(e);
    return FAILURE;
  }
}

export async function getOwner(
  address: string,
  type: string,
  account: string | undefined | null,
  library: any,
  chainId: number,
): Promise<string> {
  const caver = new Caver(
    process.env.REACT_APP_MAINNET === 'true'
      ? 'https://klaytn.taalswap.info:8651'
      : 'https://api.baobab.klaytn.net:8651',
  );
  // const market = contracts.market[process.env.REACT_APP_MAINNET === 'true' ? 8217 : 1001];
  // @ts-ignore
  const market = contracts.market[chainId];
  const gasPrice = await caver.rpc.klay.getGasPrice();
  const isKaikas = library.connection.url !== 'metamask' || library.connection.url === 'eip-1193:';

  console.log(isKaikas);
  let contract: any;
  const abi =
    type === 'KIP17'
      ? chainId === 1001 || chainId === 8217
        ? kip17Abi
        : erc721Abi
      : chainId === 1001 || chainId === 8217
      ? kip37Abi
      : erc1155Abi;

  if (isKaikas) {
    // @ts-ignore : In case of Klaytn Kaikas Wallet
    const caver = new Caver(window.klaytn);
    const klaytnAbi: AbiItem[] = abi as AbiItem[];
    contract = new caver.klay.Contract(klaytnAbi, address);
  } else {
    contract = new ethers.Contract(address, abi, library?.getSigner());
  }

  let owner: string = '';
  try {
    if (isKaikas) {
      owner = await contract.methods
        .owner()
        .call()
        .catch(async (err: any) => {
          console.log(err);
        });
    } else {
      owner = await contract.owner();
    }
  } catch (err) {
    console.log(err);
  }
  return owner;
}
