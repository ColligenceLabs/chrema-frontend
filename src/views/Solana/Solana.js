import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  MAX_METADATA_LEN,
  useConnection,
  useStore,
  useWalletModal,
  getAssetCostToStore,
  Creator,
  LAMPORT_MULTIPLIER,
  useUserAccounts,
  useMeta,
} from '@colligence/metaplex-common';
import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { saveAdmin } from '../../solana/actions/saveAdmin';
import { WhitelistedCreator } from '@colligence/metaplex-common/dist/lib/models/metaplex/index';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import { MetadataCategory, useConnectionConfig } from '@colligence/metaplex-common';
import { mintNFT } from '../../solana/actions/nft';
import { MintLayout } from '@solana/spl-token';
import splitAddress from '../../utils/splitAddress';
import { useArt } from '../../solana/hooks';
import { mintEditionsToWallet } from '../../solana/actions/mintEditionsIntoWallet';

const StyledButton = styled(Button)`
  width: 100px;
`;

const Solana = () => {
  const [isInitalizingStore, setIsInitalizingStore] = useState(false);

  const [attributes, setAttributes] = useState({
    name: '',
    symbol: '',
    collection: '',
    description: '',
    external_url: '',
    image: '',
    animation_url: undefined,
    attributes: undefined,
    seller_fee_basis_points: 0,
    creators: [],
    properties: {
      files: [],
      category: MetadataCategory.Image,
    },
  });
  const [isMinting, setMinting] = useState(false);

  const { endpoint } = useConnectionConfig();
  const [nft, setNft] = useState(undefined);
  const [alertMessage, setAlertMessage] = useState();
  // const [files, setFiles] = useState([]);
  const [nftCreateProgress, setNFTcreateProgress] = useState(0);

  const [cost, setCost] = useState(0);

  const [image, setImage] = useState(null);
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const connect = useCallback(
    () => (wallet.wallet ? wallet.connect().catch() : setVisible(true)),
    [wallet.wallet, wallet.connect, setVisible],
  );

  const phatomWallet = useMemo(() => getPhantomWallet(), []);

  const connection = useConnection();
  const { store, isFetching, isLoading } = useMeta();
  const { setStoreForOwner } = useStore();

  const { accountByMint } = useUserAccounts();
  const art = useArt('2mhU4vYxrtjP8bnUnjUcpWWyUnCqd5VzGg6w6ZqX7c9A');
  // console.log('=====>', art);
  // const art = useArt(id);

  const artMintTokenAccount = accountByMint.get(art.mint);
  const walletPubKey = wallet?.publicKey?.toString() || '';

  const [updatedCreators, setUpdatedCreators] = useState({});
  const [msgStatus, setMsgStatus] = useState('Store Loading...');

  // useEffect(() => {
  //   if (!process.env.NEXT_PUBLIC_STORE_OWNER_ADDRESS) {
  //     const getStore = async () => {
  //       if (wallet.publicKey) {
  //         const store = await setStoreForOwner(wallet.publicKey.toBase58());
  //         setStoreAddress(store);
  //       } else {
  //         setStoreAddress(undefined);
  //       }
  //     };
  //     getStore();
  //   }
  // }, [wallet.publicKey]);

  // TODO : input
  const [newCreator, setNewCreator] = useState();

  useEffect(() => {
    const newWhitelistedCreator = new WhitelistedCreator({
      activated: true,
      // address: '81DhXxGzC4ymw97EAx9QaoFQ9rqY5AsSVQXthYB5LXSo',
      address: newCreator,
    });
    // setUpdatedCreators({ '81DhXxGzC4ymw97EAx9QaoFQ9rqY5AsSVQXthYB5LXSo': newCreator });
    // console.log('===>', newWhitelistedCreator);
    setUpdatedCreators({ [newCreator]: newWhitelistedCreator });
  }, [newCreator]);

  const onSell = async () => {
    console.log('Sell clicked');
    console.log(splitAddress(wallet.publicKey.toBase58()));
  };

  useEffect(() => {
    if (!isLoading && !isFetching) {
      setMsgStatus('Store Loaded !!');
    }
  }, [isLoading, isFetching]);

  const mintCollection = async () => {
    // TODO : artCreate/index.tsx 1091 라인 참고
    // const creators = new Creator({
    //   address: '6u76n3P6e6YLTMA5TSPNjFkuNGq9r4JHYUEtfa4kC8WL',
    //   share: 100,
    //   verified: true,
    // });
    // TODO : Metaplex Creator 생성 먼저...

    const fixedCreators = [
      {
        key: wallet.publicKey.toBase58(),
        label: splitAddress(wallet.publicKey.toBase58()),
        value: wallet.publicKey.toBase58(),
      },
    ];
    // TODO : artCreate/index.tsx 1091 라인 참고하여 share 값 계산 등등 처리할 것
    const creatorStructs = [...fixedCreators].map(
      (c) =>
        new Creator({
          address: c.value,
          verified: c.value === wallet.publicKey?.toBase58(),
          share: 100, // TODO: UI에서 입력받게 할 것인지?
          // share:
          //   royalties.find(r => r.creatorKey === c.value)?.amount ||
          //   Math.round(100 / royalties.length),
        }),
    );

    const metadata = {
      // name: attributes.name,
      // symbol: attributes.symbol,
      // creators: attributes.creators,
      // collection: attributes.collection,
      // description: attributes.description,
      // sellerFeeBasisPoints: attributes.seller_fee_basis_points,
      // image: attributes.image,
      // animation_url: attributes.animation_url,
      // attributes: attributes.attributes,
      // external_url: attributes.external_url,
      // properties: {
      //   files: attributes.properties.files,
      //   category: attributes.properties?.category,
      // },
      name: 'Klimit',
      symbol: 'KMT',
      creators: creatorStructs,
      collection: '',
      description: 'Klimt Paintings',
      sellerFeeBasisPoints: 500,
      image: image.name,
      animation_url: undefined,
      attributes: undefined,
      external_url: '',
      properties: {
        files: [{ uri: image.name, type: image.type }],
        category: 'image',
      },
    };

    const endpoint2 = {
      chainId: 103,
      label: 'devnet',
      name: 'devnet',
      url: 'https://api.devnet.solana.com',
    };
    setMinting(true);

    // setFiles({ uri: image.name, type: image.type });
    const files = [];
    files.push(image);

    calCost(files, metadata);

    try {
      const _nft = await mintNFT(
        connection,
        wallet,
        endpoint.name,
        // 'devnet',
        files,
        metadata,
        setNFTcreateProgress,
        // attributes.properties?.maxSupply,
        10,
      );

      if (_nft) setNft(_nft);
      setAlertMessage('');
    } catch (e) {
      console.log('mintNFT error', e);
      setAlertMessage(e.message);
    } finally {
      setMinting(false);
    }
  };

  // TODO : mintCollection에서 Return 된 값, 즉 collections DB의 contract_address 값을 사용
  // 예 : 5PC1VdgyhoETpDPwvvHyjv2K5QkCWcuk1vSNJ2XcFrA
  const mintEdition = async (id, amount) => {
    // TODO : GUI에서 입력받을 값... 발행 수량 값
    const editions = amount;
    const editionNumber = undefined;

    try {
      await mintEditionsToWallet(
        art,
        wallet,
        connection,
        artMintTokenAccount,
        editions,
        walletPubKey,
        editionNumber,
      );
    } catch (e) {
      console.error(e);
    } finally {
      console.log('Success...');
    }
  };

  const addCreator = async (address) => {
    // console.log('==addCreator==>', updatedCreators);
    await saveAdmin(connection, wallet, store.public, Object.values(updatedCreators));
  };

  const initializeStore = async () => {
    if (!wallet.publicKey) {
      return;
    }

    setIsInitalizingStore(true);

    if (wallet.connected && !isLoading && !isFetching && !store) {
      await saveAdmin(connection, wallet, false, [
        new WhitelistedCreator({
          address: wallet.publicKey.toBase58(),
          activated: true,
        }),
      ]);
    } else {
      console.log('Store already initialized...');
    }

    // TODO: process errors

    await setStoreForOwner(undefined);
    await setStoreForOwner(wallet.publicKey.toBase58());

    // history.push('/admin');
  };

  const calCost = (files, metadata) => {
    const rentCall = Promise.all([
      connection.getMinimumBalanceForRentExemption(MintLayout.span),
      connection.getMinimumBalanceForRentExemption(MAX_METADATA_LEN),
    ]);
    if (files.length)
      getAssetCostToStore([...files, new File([JSON.stringify(metadata)], 'metadata.json')]).then(
        async (lamports) => {
          const sol = lamports / LAMPORT_MULTIPLIER;

          // TODO: cache this and batch in one call
          const [mintRent, metadataRent] = await rentCall;

          // const uriStr = 'x';
          // let uriBuilder = '';
          // for (let i = 0; i < MAX_URI_LENGTH; i++) {
          //   uriBuilder += uriStr;
          // }

          const additionalSol = (metadataRent + mintRent) / LAMPORT_MULTIPLIER;

          // TODO: add fees based on number of transactions and signers
          setCost(sol + additionalSol);
        },
      );
  };

  return (
    <div>
      <Grid item lg={12} md={12} sm={12} xs={12} textAlign="right" gap="1rem">
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-start' }}>
          {/* <StyledButton variant="contained" onClick={() => connect()}> */}
          {/*  Connect*/}
          {/* </StyledButton> */}
          <StyledButton
            variant="contained"
            onClick={() => {
              wallet.select(phatomWallet.name);
            }}
          >
            Phantom
          </StyledButton>
          <StyledButton variant="contained" onClick={connect}>
            Connect
          </StyledButton>
          <StyledButton variant="contained" onClick={initializeStore}>
            Init Store
          </StyledButton>
          <StyledButton variant="contained" onClick={addCreator}>
            Add Creator
          </StyledButton>
          <StyledButton variant="contained" onClick={mintCollection}>
            Create Collection
          </StyledButton>
          <StyledButton variant="contained" onClick={mintEdition}>
            Mint
          </StyledButton>
          <StyledButton variant="contained" onClick={onSell}>
            Sell
          </StyledButton>
        </div>
        <div style={{ width: '500px', marginTop: '20px' }}>
          <CustomTextField
            id="thumbnailFiled"
            name="thumbnailFiled"
            variant="outlined"
            fullWidth
            size="small"
            value={image?.name || ''}
            InputProps={{
              startAdornment: (
                <Button
                  component="label"
                  variant="contained"
                  size="small"
                  style={{ marginRight: '1rem' }}
                >
                  <DriveFileMoveOutlinedIcon fontSize="small" />
                  <input
                    id="thumbnail"
                    style={{ display: 'none' }}
                    type="file"
                    name="image"
                    onChange={(event) => {
                      setImage(event.currentTarget.files[0]);
                    }}
                  />
                </Button>
              ),
            }}
          />
        </div>
        <div style={{ width: '500px', marginTop: '20px' }}>
          <input
            type="text"
            name="creator"
            placeholder="New Creator Address"
            style={{ width: '500px', height: '40px' }}
            onChange={(e) => {
              setNewCreator(e.target.value);
            }}
          />
        </div>
        <div style={{ width: '500px', marginTop: '20px' }}>{msgStatus}</div>
      </Grid>
    </div>
  );
};

export default Solana;
