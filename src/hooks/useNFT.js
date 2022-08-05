import { useCallback, useState } from 'react';
import request from 'request';
import { parseUnits } from 'ethers/lib/utils';
import testMeta from '../config/constants/test.json';
import { BigNumber } from 'ethers';
import useActiveWeb3React from './useActiveWeb3React';
import fs from 'fs';
import { IPFS_URL, ALT_URL, FAILURE, SUCCESS } from '../config/constants/consts';
import { create } from 'ipfs-http-client';
import {
  setNftOnchain,
  setNftOnchains,
  setNftTransferData,
  setNftTransfered,
} from '../services/nft.service';

// add 10%
export function calculateGasMargin(value) {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000));
}

const addToIPFS = async function (file) {
  const auth =
    'Basic ' +
    Buffer.from('24EBv9Z978FDIDn74tjbKZV8ihS' + ':' + '4a4d9b8d905d38a7e3a3caa7fa0e35f4').toString(
      'base64',
    );
  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });
  const result = await client.add(file);
  return result;
};

export const mkDirIPFS = async function (directory) {
  // console.log("start file upload to ipfs...")
  const auth =
    'Basic ' +
    Buffer.from('24EBv9Z978FDIDn74tjbKZV8ihS' + ':' + '4a4d9b8d905d38a7e3a3caa7fa0e35f4').toString(
      'base64',
    );
  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });
  // const dirStr = `/${directory}`;
  const dirStr = `/${directory.toLowerCase()}`;
  // const result = await client.files.mkdir(directory);
  const result = await client.files.mkdir(dirStr);
  // TODO : files.mkdir return 403 forbidden error... need to fix it
  return result;
};

const useNFT = (contract, kasContract, account) => {
  // TODO: library 를 dependencies 에 추가하지 않으먄 같은 에러가 발생함.
  const [isMinting, setIsMinting] = useState();
  const [isTransfering, setIsTransfering] = useState();

  const { library, chainId } = useActiveWeb3React();

  // const createNFT = useCallback(
  //   async (mintData) => {
  //     console.log('====>', mintData);
  //     // content ipfs 업로드
  //     let result = await addToIPFS(mintData.contentFile);
  //     console.log('11111', result);
  //     // thumbnail 서버 업로드
  //
  //     // tokenId가 중복되지 않도록 처리해야함. 발행할 tokenId를 자동으로 가지고 오기 위한 API 필요
  //     const tokenId = 3;
  //
  //     // form json 파일 생성
  //     let imgName = mintData.content.split('.');
  //     const metadata = {
  //       name: mintData.name,
  //       description: mintData.description,
  //       image: IPFS_URL + result.path,
  //       alt_url: ALT_URL + result.path + '.' + imgName[imgName.length - 1],
  //       content_Type: imgName[imgName.length - 1],
  //       cid: result.path,
  //       tokenId: tokenId,
  //       total_minted: '',
  //       external_url: mintData.external_url,
  //       attributes: [],
  //       minted_by: 'securit',
  //       thumbnail: '',
  //       creator_name: mintData.creator.name,
  //       creator_icon: mintData.creator.image,
  //       category: [],
  //     };
  //
  //     if (typeof mintData.thumbnailFile !== 'undefined' && mintData.thumbnail !== '') {
  //       let thumbName = mintData.thumbnail.split('.');
  //       // let thumbnailInput = my_thumbnail.filename;
  //       // let thumbnailOutput = result.Hash + '_thumbnail.' + thumbName[thumbName.length -1];
  //       // await imageRename(consts.UPLOAD_PATH + thumbnailInput, consts.UPLOAD_PATH + 'thumbnail/' + thumbnailOutput);
  //       metadata.thumbnail =
  //         ALT_URL + 'thumbnail/' + result.Hash + '_thumbnail.' + thumbName[thumbName.length - 1];
  //     }
  //     console.log('22222', metadata);
  //
  //     // ipfs json 업로드
  //     let metadata_ipfs_link = await addToIPFS(JSON.stringify(metadata));
  //     console.log('33333', metadata_ipfs_link);
  //     // gasLimit 계산?
  //     const gasPrice = parseUnits('250', 'gwei').toString();
  //     console.log('=====>', contract);
  //     // mint 요청
  //     const gasLimit = await contract.estimateGas.mintWithTokenURI(
  //       '0x1716c4d49e9d81c17608cd9a45b1023ac9df6c73',
  //       tokenId,
  //       IPFS_URL + metadata_ipfs_link.path,
  //     );
  //     console.log(gasPrice, contract);
  //     const tx = await contract.mintWithTokenURI(
  //       '0x1716c4d49e9d81c17608cd9a45b1023ac9df6c73',
  //       tokenId,
  //       IPFS_URL + metadata_ipfs_link.path,
  //       {
  //         from: account,
  //         gasPrice,
  //         gasLimit: calculateGasMargin(gasLimit),
  //       },
  //     );
  //     let receipt;
  //     try {
  //       receipt = await tx.wait();
  //     } catch (e) {
  //       console.log(e);
  //     }
  //     console.log(tx, receipt);
  //
  //     // rest api 호출(db 저장)
  //   },
  //   [library, account, mintData],
  // );

  const mintNFTBatch = useCallback(
    async (tokenIds, tokenUris, quantities, nftIds, contractType, isKaikas) => {
      setIsMinting(true);
      // todo gasPrice 계산식 변경 필요.
      const gasPrice = parseUnits('250', 'gwei').toString();
      if (isKaikas) {
        let tx;
        if (contractType === 'KIP17') {
          // gasLimit 계산
          const gasLimit = await kasContract.methods
            // .batchMintWithTokenURI(account, tokenIds, tokenUris)
            .batchMintWithTokenUriLight(account, tokenIds, tokenUris[0])
            .estimateGas({
              from: account,
            });

          // mint 요청
          tx = await kasContract.methods
            // .batchMintWithTokenURI(account, tokenIds, tokenUris)
            .batchMintWithTokenUriLight(account, tokenIds, tokenUris[0])
            .send({
              from: account,
              gasPrice,
              gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
            })
            .catch(async (err) => {
              // console.log('batchMintWithTokenURI error', err);
              console.log('batchMintWithTokenUriLight error', err);
              await setIsMinting(false);
              return FAILURE;
            });
        } else {
          // gasLimit 계산
          const gasLimit = await kasContract.methods
            .createBatch(tokenIds, quantities, tokenUris)
            .estimateGas({
              from: account,
            });

          // mint 요청
          tx = await kasContract.methods
            .createBatch(tokenIds, quantities, tokenUris)
            .send({
              from: account,
              gasPrice,
              gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
            })
            .catch(async (err) => {
              console.log('createBatch error', err);
              await setIsMinting(false);
              return FAILURE;
            });
        }
        // receipt 대기
        try {
          if (tx?.status) {
            await setNftOnchains(nftIds);
          }
        } catch (e) {
          console.log(e);
        }
        await setIsMinting(false);
        return SUCCESS;
      } else {
        try {
          let tx;
          if (contractType === 'KIP17') {
            console.log('요기로 왔냥~~~?', account, tokenIds, tokenUris);
            console.log(contract);
            // gasLimit 계산
            // const gasLimit = await contract.estimateGas.batchMintWithTokenURI(
            //   account,
            //     tokenIds,
            //     tokenUris,
            // );
            const gasLimit = await contract.estimateGas.batchMintWithTokenUriLight(
              account,
              tokenIds,
              tokenUris[0],
            );
            const options = { from: account, gasLimit: calculateGasMargin(gasLimit) };
            if (chainId > 1000) options.gasPrice = gasPrice;
            // tx = await contract.batchMintWithTokenURI(account, tokenIds, tokenUris, options);
            tx = await contract.batchMintWithTokenUriLight(
              account,
              tokenIds,
              tokenUris[0],
              options,
            );
            console.log('요기로 왔냥~~~?222');
          } else {
            const gasLimit = await contract.estimateGas.createBatch(
              tokenIds,
              quantities,
              tokenUris,
            );
            const options = { from: account, gasLimit: calculateGasMargin(gasLimit) };
            if (chainId > 1000) options.gasPrice = gasPrice;
            tx = await contract.createBatch(tokenIds, quantities, tokenUris, options);
          }
          // receipt 대기
          let receipt;
          try {
            receipt = await tx.wait();
            if (receipt.status === 1) {
              await setNftOnchains(nftIds);
            }
          } catch (e) {
            return FAILURE;
          }
          await setIsMinting(false);
          return SUCCESS;
        } catch (e) {
          await setIsMinting(false);
          return FAILURE;
        }
      }
    },
    [library, account, contract],
  );

  const mintNFT17WithKaikas = useCallback(
    async (tokenId, tokenUri, nftId) => {
      setIsMinting(true);
      const gasPrice = parseUnits('250', 'gwei').toString();

      let tx;
      // gasLimit 계산
      const gasLimit = await kasContract.methods
        .mintWithTokenURI(account, tokenId, tokenUri)
        .estimateGas({
          from: account,
        });

      // mint 요청
      tx = await kasContract.methods
        .mintWithTokenURI(account, tokenId, tokenUri)
        .send({
          from: account,
          gasPrice,
          gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
        })
        .catch(async (err) => {
          console.log('mintNFT17WithKaikas error', err);
          await setIsMinting(false);
          return FAILURE;
        });

      // receipt 대기
      try {
        if (tx?.status) {
          await setNftOnchain(nftId);
        }
      } catch (e) {
        console.log(e);
      }
      await setIsMinting(false);
      return SUCCESS;
    },
    [library, account, kasContract],
  );

  const mintNFT17 = useCallback(
    async (tokenId, tokenUri, nftId) => {
      setIsMinting(true);
      const gasPrice = parseUnits('250', 'gwei').toString();

      let tx;

      // gasLimit 계산
      const gasLimit = await contract.estimateGas.mintWithTokenURI(account, tokenId, tokenUri);

      // mint 요청
      try {
        tx = await contract.mintWithTokenURI(account, tokenId, tokenUri, {
          from: account,
          gasPrice,
          gasLimit: calculateGasMargin(gasLimit),
          // gasLimit: 2000000,
        });

        // receipt 대기
        let receipt;
        try {
          receipt = await tx.wait();
          if (receipt.status === 1) {
            await setNftOnchain(nftId);
          }
        } catch (e) {
          return FAILURE;
        }
        await setIsMinting(false);
        return SUCCESS;
      } catch (e) {
        await setIsMinting(false);
        return FAILURE;
      }
    },
    [library, account, contract],
  );

  const mintNFT37 = useCallback(
    async (tokenId, amount, tokenUri, nftId, contractType) => {
      setIsMinting(true);
      const gasPrice = parseUnits('250', 'gwei').toString();

      let tx;

      // check token_id
      const creator = await contract.creators(tokenId);

      if (creator === '0x0000000000000000000000000000000000000000') {
        // gasLimit 계산
        const gasLimit = await contract.estimateGas.create(tokenId, amount, tokenUri);

        // mint 요청
        try {
          tx = await contract.create(tokenId, amount, tokenUri, {
            from: account,
            gasPrice,
            gasLimit: calculateGasMargin(gasLimit),
            // gasLimit: 2000000,
          });

          // receipt 대기
          let receipt;
          try {
            receipt = await tx.wait();
            if (receipt.status === 1) {
              await setNftOnchain(nftId);
            }
          } catch (e) {
            console.log(e);
            return FAILURE;
          }
          await setIsMinting(false);
          return SUCCESS;
        } catch (e) {
          console.log(e);
          await setIsMinting(false);
          return FAILURE;
        }
      } else if (creator === account) {
        // KIP37의 경우 신규 Token ID를 create 한 후 추가로 mint 할 수 있으나... mint 함수를 인식하지 못하는 문제가 있음.
        // mintBatch 함수는 ok...
        // gasLimit 계산
        const tids = [];
        const amounts = [];
        tids.push(tokenId);
        amounts.push(amount);
        // TODO : TypeError: contract.estimateGas.mint is not a function
        // Klaytn KIP17 스마트컨트랙 수정하여 해결됨.
        const gasLimit = await contract.estimateGas.mint(tokenId, account, amount);
        // const gasLimit = await contract.estimateGas.mintBatch(account, tids, amounts);

        // mint 요청
        try {
          // TODO : TypeError: contract.mint is not a function
          tx = await contract.mint(tokenId, account, amount, {
            // tx = await contract.mintBatch(account, tids, amounts, {
            from: account,
            gasPrice,
            // gasLimit: calculateGasMargin(gasLimit),
            gasLimit: 2000000,
          });

          // receipt 대기
          let receipt;
          try {
            receipt = await tx.wait();
            if (receipt.status === 1) {
              await setNftOnchain(nftId);
            }
          } catch (e) {
            console.log(e);
            return FAILURE;
          }
          await setIsMinting(false);
          return SUCCESS;
        } catch (e) {
          console.log(e);
          await setIsMinting(false);
          return FAILURE;
        }
      }
    },
    [library, account, contract],
  );

  const mintNFT37WithKaikas = useCallback(
    async (tokenId, amount, tokenUri, nftId, contractType) => {
      setIsMinting(true);
      const gasPrice = parseUnits('250', 'gwei').toString();

      // check token_id
      const creator = await kasContract.methods.creators(tokenId).call();

      if (creator === '0x0000000000000000000000000000000000000000') {
        // gasLimit 계산
        const gasLimit = await kasContract.methods
          .create(tokenId, amount, tokenUri)
          .estimateGas({ from: account });

        // mint 요청
        const tx = await kasContract.methods
          .create(tokenId, amount, tokenUri)
          .send({
            from: account,
            gasPrice,
            gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
            // gasLimit: 2000000,
          })
          .catch(async (err) => {
            console.log('mintNFT37WithKaikas error', err);
            await setIsMinting(false);
            return FAILURE;
          });

        try {
          if (tx?.status) {
            await setNftOnchain(nftId);
          }
        } catch (e) {
          console.log(e);
        }
        await setIsMinting(false);
      } else if (creator === account) {
        // gasLimit 계산
        const gasLimit = await kasContract.methods
          .mint(tokenId, account, amount)
          .estimateGas({ from: account });

        // mint 요청
        const tx = await kasContract.methods
          .mint(tokenId, account, amount)
          .send({
            from: account,
            gasPrice,
            gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
            // gasLimit: 2000000,
          })
          .catch(async (err) => {
            console.log('mintNFT37WithKaikas error', err);
            await setIsMinting(false);
            return FAILURE;
          });

        try {
          if (tx?.status) {
            await setNftOnchain(nftId);
          }
        } catch (e) {
          console.log(e);
        }
        await setIsMinting(false);
      }
    },
    [library, account, kasContract],
  );

  const transferNFT = useCallback(
    // KIP17 amount should be 1 always.
    // NIP37 amount should be between 1 to total supply.
    async (tokenId, to, amount, nftId, contractType) => {
      setIsTransfering(true);
      const gasPrice = parseUnits('250', 'gwei').toString();

      let tx;
      let gasLimit;

      if (contractType === 'KIP17') {
        try {
          // gasLimit 계산
          // TODO : TypeError: contract.estimateGas.safeTransferFrom is not a function
          // const gasLimit = await contract.estimateGas.safeTransferFrom(account, to, tokenId, '0x');
          gasLimit = await contract.estimateGas.transferFrom(account, to, tokenId);
        } catch (e) {
          console.log(e);
          await setIsTransfering(false);
          return [0, 'estimateGas transferFrom failed'];
        }

        try {
          // transfer 요청
          // tx = await contract.safeTransferFrom(account, to, tokenId, '0x', {
          tx = await contract.transferFrom(account, to, tokenId, {
            from: account,
            gasPrice,
            gasLimit: calculateGasMargin(gasLimit),
            // gasLimit: 2000000,
          });
        } catch (e) {
          console.log(e);
          await setIsTransfering(false);
          return [0, 'transferFrom failed'];
        }
      } else {
        try {
          // gasLimit 계산
          gasLimit = await contract.estimateGas.safeTransferFrom(
            account,
            to,
            tokenId,
            amount,
            '0x',
          );
        } catch (e) {
          console.log(e);
          await setIsTransfering(false);
          return [0, 'estimateGas safeTransferFrom failed'];
        }

        try {
          // transfer 요청
          tx = await contract.safeTransferFrom(account, to, tokenId, amount, '0x', {
            from: account,
            gasPrice,
            gasLimit: calculateGasMargin(gasLimit),
            // gasLimit: 2000000,
          });
        } catch (e) {
          console.log(e);
          await setIsTransfering(false);
          return [0, 'safeTransferFrom failed'];
        }
      }

      // receipt 대기
      let receipt;
      let errMessage;
      try {
        receipt = await tx.wait();
        if (receipt.status === 1) {
          // TODO : create serial 및 transaction 엔트리...
          // await setNftTransfered(nftId, amount);  --> setNftTransferData 여기서 처리
          await setNftTransferData(nftId, to, amount, receipt.transactionHash);
        }
      } catch (e) {
        console.log(e);
        errMessage = e.message;
      }
      await setIsTransfering(false);
      return [receipt?.status, errMessage];
    },
    [library, account, contract],
  );

  const transferNFTWithKaikas = useCallback(
    // KIP17 amount should be 1 always.
    // NIP37 amount should be between 1 to total supply.
    async (tokenId, to, amount, nftId, contractType) => {
      setIsTransfering(true);
      const gasPrice = parseUnits('250', 'gwei').toString();

      let tx;
      let gasLimit;

      if (contractType === 'KIP17') {
        try {
          // gasLimit 계산
          // TODO : TypeError: contract.estimateGas.safeTransferFrom is not a function
          // const gasLimit = await contract.estimateGas.safeTransferFrom(account, to, tokenId, '0x');
          gasLimit = await kasContract.methods.transferFrom(account, to, tokenId).estimateGas();
        } catch (e) {
          console.log(e);
          await setIsTransfering(false);
          return [0, 'estimateGas transferFrom failed'];
        }

        try {
          // transfer 요청
          // tx = await contract.safeTransferFrom(account, to, tokenId, '0x', {
          tx = await kasContract.methods.transferFrom(account, to, tokenId).send({
            from: account,
            gasPrice,
            gasLimit: calculateGasMargin(BigNumber.from(gasLimit)),
            // gasLimit: 2000000,
          });
        } catch (e) {
          console.log(e);
          await setIsTransfering(false);
          return [0, 'transferFrom failed'];
        }
      } else {
        try {
          // gasLimit 계산
          gasLimit = await kasContract.methods
            .safeTransferFrom(account, to, tokenId, amount, '0x')
            .estimateGas();
        } catch (e) {
          console.log(e);
          await setIsTransfering(false);
          return [0, 'estimateGas safeTransferFrom failed'];
        }

        try {
          // transfer 요청
          tx = await kasContract.methods.safeTransferFrom(account, to, tokenId, amount, '0x').send({
            from: account,
            gasPrice,
            gasLimit: calculateGasMargin(gasLimit),
            // gasLimit: 2000000,
          });
        } catch (e) {
          console.log(e);
          await setIsTransfering(false);
          return [0, 'safeTransferFrom failed'];
        }
      }

      // receipt 대기
      let errMessage;
      try {
        if (tx.status === 1) {
          // TODO : create serial 및 transaction 엔트리...
          // await setNftTransfered(nftId, amount);  --> setNftTransferData 여기서 처리
          await setNftTransferData(nftId, to, amount, tx.transactionHash);
        }
      } catch (e) {
        console.log(e);
        errMessage = e.message;
      }
      console.log(tx);
      await setIsTransfering(false);
      return [tx?.status, errMessage];
    },
    [library, account, kasContract],
  );

  // return { createNFT, mintNFT };
  return {
    mintNFTBatch,
    mintNFT17,
    mintNFT17WithKaikas,
    mintNFT37,
    mintNFT37WithKaikas,
    transferNFT,
    transferNFTWithKaikas,
    isMinting,
    isTransfering,
  };
};

export default useNFT;
