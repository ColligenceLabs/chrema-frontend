import { ContractFactory } from '@ethersproject/contracts';
import { kip17Data, kip37Data, erc721Data, erc1155Data } from '../contracts';
import Caver from 'caver-js';
// import { useWeb3React } from '@web3-react/core';
import { mkDirIPFS } from '../hooks/useNFT';
import { IPFS_URL, ALT_URL } from '../config/constants/consts';
import { parseUnits } from 'ethers/lib/utils';

export async function deployKIP17(name, symbol, account, library) {
  // hooks can not be called from inside a function
  // const { account, library } = useWeb3React();

  const chainId = library._network.chainId;
  let factory;
  if (chainId === 8217 || chainId === 1001) {
    factory = new ContractFactory(kip17Data.abi, kip17Data.bytecode, library.getSigner(account));
  } else {
    factory = new ContractFactory(erc721Data.abi, erc721Data.bytecode, library.getSigner(account));
  }

  const ret = {};
  const gasPrice = parseUnits('250', 'gwei').toNumber();
  let options;
  if (chainId > 1000) {
    options = { gasPrice, gasLimit: 7000000 };
  } else {
    options = { gasLimit: 7000000 };
  }
  const contract = await factory.deploy(name, symbol, options).catch(function (err) {
    console.log(err);
    ret.err = err;
  });

  if (!!ret.err) return ret;

  const receipt = await contract.deployTransaction.wait().catch(function (err) {
    console.log(err);
    ret.err = err;
  });
  if (!!ret.err) return ret;
  const { confirmations } = receipt;
  ret.confirmations = confirmations;
  if (confirmations > 0) {
    const { address } = contract;
    ret.address = address;

    // TODO: 신규 스마트코트랙 주소 등 DB에 입력
    // ...
  } else {
    ret.err = receipt;
  }
  return ret;
}

export async function deployKIP37(symbol, name, directory, account, library) {
  // hooks can not be called from inside a function
  // const { account, library } = useWeb3React();

  const chainId = library._network.chainId;
  let factory;
  if (chainId === 8217 || chainId === 1001) {
    factory = new ContractFactory(kip37Data.abi, kip37Data.bytecode, library.getSigner(account));
  } else {
    factory = new ContractFactory(
      erc1155Data.abi,
      erc1155Data.bytecode,
      library.getSigner(account),
    );
  }

  // TODO : ipfs mkdir
  // try {
  //   const hash = await mkDirIPFS(name);
  // } catch (err) {
  //   console.log(err);
  // }
  // TODO : 403 forbidden why ?
  // const tokenUri = `${IPFS_URL}${hash}/{id}.json`;
  // const tokenUri = `${IPFS_URL}talken-nft/{id}.json`;
  const tokenUri = `${ALT_URL}/${directory}/{id}.json`;
  // TODO : 백엔드에 디렉토리 생성 API 호출 필요함.

  const ret = {};
  const gasPrice = parseUnits('250', 'gwei').toNumber();
  let options;
  if (chainId > 1000) {
    options = { gasPrice, gasLimit: 7000000 };
  } else {
    options = { gasLimit: 7000000 };
  }
  let contract;
  if (symbol && symbol !== '' && symbol !== undefined) {
    contract = await factory.deploy(tokenUri, name, symbol, options).catch(function (err) {
      console.log(err);
      ret.err = err;
    });
  } else {
    contract = await factory.deploy(tokenUri, name, options).catch(function (err) {
      console.log(err);
      ret.err = err;
    });
  }

  if (!!ret.err) return ret;

  const receipt = await contract.deployTransaction.wait().catch(function (err) {
    console.log(err);
    ret.err = err;
  });
  if (!!ret.err) return ret;
  const { confirmations } = receipt;
  ret.confirmations = confirmations;
  if (confirmations > 0) {
    const { address } = contract;
    ret.address = address;

    // TODO: 신규 스마트코트랙 주소 등 DB에 입력
    // ...
  } else {
    ret.err = receipt;
  }
  return ret;
}

export async function deployKIP17WithKaikas(name, symbol, account, library) {
  // hooks can not be called from inside a function
  // const { account, library } = useWeb3React();

  const caver = new Caver(window.klaytn);
  const factory = new caver.klay.Contract(kip17Data.abi);
  // console.log('=====> ', factory, window.klaytn.selectedAddress);

  const ret = {};
  const contract = await factory
    .deploy({
      data: kip17Data.bytecode,
      arguments: [name, symbol],
    })
    .send({
      from: window.klaytn.selectedAddress,
      gas: 7000000,
      value: 0,
    })
    .catch(function (err) {
      console.log(err);
      ret.err = err;
    });

  // console.log('===>1234', contract, contract._address);

  if (!!ret.err) return ret;

  ret.address = contract._address;

  return ret;
}

export async function deployKIP37WithKaikas(name, account, library) {
  // hooks can not be called from inside a function
  // const { account, library } = useWeb3React();

  const caver = new Caver(window.klaytn);
  const factory = new caver.klay.Contract(kip37Data.abi);
  // console.log('=====> ', factory, window.klaytn.selectedAddress);

  // TODO : ipfs mkdir
  // try {
  //   const hash = await mkDirIPFS(name);
  // } catch (err) {
  //   console.log(err);
  // }
  // TODO : 403 forbidden why ?
  // const tokenUri = `${IPFS_URL}${hash}/{id}.json`;
  // const tokenUri = `${IPFS_URL}talken-nft/{id}.json`;
  const tokenUri = `${ALT_URL}/${name}/{id}.json`;
  // TODO : 백엔드에 디렉토리 생성 API 호출 필요함.

  const ret = {};
  const contract = await factory
    .deploy({
      data: kip37Data.bytecode,
      arguments: [tokenUri, name],
    })
    .send({
      from: window.klaytn.selectedAddress,
      gas: 7000000,
      value: 0,
    })
    .catch(function (err) {
      console.log(err);
      ret.err = err;
    });

  // console.log('===>1234', contract, contract._address);

  if (!!ret.err) return ret;

  ret.address = contract._address;

  return ret;
}
