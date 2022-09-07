import React, { useState, useEffect } from 'react';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import { Box, Button, Container, Menu, MenuItem, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageSelector from '../../components/ImageSelector/ImageSelector';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomTextarea from '../../components/forms/custom-elements/CustomTextarea';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import { getCollectionsByCreatorId } from '../../services/collections.service';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import useUserInfo from '../../hooks/useUserInfo';
import {
  batchRegisterNFT,
  cancelCreateNft,
  cancelCreateNfts,
  registerNFT,
  registerSolanaNFT,
  setNftOnchain,
} from '../../services/nft.service';
import { FAILURE, SUCCESS } from '../../config/constants/consts';
import { getChainId } from '../../utils/commonUtils';
import { targetNetworkMsg } from '../../config';
import { setupNetwork } from '../../utils/wallet';

const CreateNewItemContainer = styled(Container)`
  max-width: 646px !important;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 10rem;
`;

const TitleWrapper = styled(Typography)`
  font-size: 40px;
  font-weight: 600;
  letter-spacing: 0px;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const FieldWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const FiledTitle = styled('label')`
  color: rgb(53, 56, 64);
  font-weight: 600;
  font-size: 16px;
  ${({ required }) =>
    required === true &&
    `
    &:after {
    content: " *";
    color: rgb(235, 87, 87)
    }
  `}
`;

const FieldSubscription = styled('span')`
  display: flex;
  justify-content: space-between;
  color: rgb(112, 122, 131);
  font-size: 12px;
  font-weight: 500;
`;

const CreateCollection = styled('div')(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 600,
  color: theme.palette.primary.main,
  cursor: 'pointer',
}));

const StyledMenuItem = styled(MenuItem)`
  padding: 10px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid rgb(229, 232, 235);
  &:last-child {
    border-bottom: none;
  }
`;
const collections = [
  {
    id: 0,
    name: 'test1',
  },
  {
    id: 1,
    name: 'test2',
  },
  {
    id: 2,
    name: 'test3',
  },
  {
    id: 3,
    name: 'test4',
  },
];

const categories = [
  {
    id: 0,
    value: 'picture',
    caption: 'Picture',
  },
  {
    id: 1,
    value: 'painting',
    caption: 'Painting',
  },
  {
    id: 2,
    value: 'illustrate',
    caption: 'Illustrate',
  },
  {
    id: 3,
    value: 'design',
    caption: 'Design',
  },
  {
    id: 4,
    value: 'character',
    caption: 'Character',
  },
  {
    id: 5,
    value: 'other',
    caption: 'Other',
  },
];

const nftItemCreateSchema = yup.object({
  name: yup.string('Enter your name').required('Name is required'),
  collection: yup.string().when('fee_percentage', {
    is: (value) => value > 0,
    then: yup.string().required('Payout wallet address is required'),
    category: yup
      .array('Select category')
      .nullable()
      .label('Category')
      .min(1)
      .of(yup.string())
      .required('Category is required'),
    nftItem: yup.mixed().required('You need to provide a file'),
    description: yup
      .string('Enter your Description')
      .required('Description is required')
      .max(1024, 'Description has a maximum limit of 1024 characters.'),
    price: yup.number().min(0, 'Must be greater than 0 percent.'),
  }),
});

const CreateNewItem = () => {
  const navigate = useNavigate();
  const { level, id, full_name } = useUserInfo();
  const { account, chainId } = useActiveWeb3React();
  const [collectionList, setCollectionList] = useState([]);
  const [nftItem, setNftItem] = useState(null);
  const [collection, setCollection] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(0);
  const [price, setPrice] = useState('');
  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
  const [targetNetwork, setTargetNetwork] = useState('klaytn');

  const moveToPage = () => {
    navigate('/market/mycollection');
  };

  const getCollectionList = async () => {
    console.log(id);
    await getCollectionsByCreatorId(id)
      .then(({ data }) => {
        console.log(data);
        setCollectionList(data.filter((row) => row.status === 'active'));
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    console.log(collectionList);
  }, [collectionList]);

  useEffect(() => {
    getCollectionList();
  }, []);

  return (
    <MarketLayout>
      <Formik
        initialValues={{
          name: '',
          description: '',
          collection: '',
          nftItem: null,
          // category: categories[0].value,
          price: '',
        }}
        onSubmit={async (values, actions) => {
          console.log('Mint start!');
          console.log({ values });
          if (account === undefined) {
            setIsOpenConnectModal(true);
            return;
          }

          let formData = new FormData();
          for (let value in values) {
            if (
              [
                'name',
                'price',
                'contract_type',
                'auto',
                'type',
                'description',
                'quote',
                'batch',
              ].includes(value)
            ) {
              formData.append(value, values[value]);
            }
          }

          formData.append('quantity', '1');
          formData.append('collection_id', values['collection']);
          formData.append('file', values['nftItem']);
          if (values['thumbnail'] === null) {
            formData.append('thumbnail', values['nftItem']);
          } else {
            formData.append('thumbnail', values['thumbnail']);
          }

          formData.append('category', values['category']);
          // formData.append('external_url', values['externalURL']);

          let result = SUCCESS;
          // console.log(ethereum, klaytn, solana, binance);
          if (
            (targetNetwork === 'binance' && binance.address === undefined) ||
            (targetNetwork === 'klaytn' && klaytn.address === undefined) ||
            (targetNetwork === 'ethereum' && ethereum.address === undefined)
          ) {
            // todo 지갑연결 창을 targetNetowrk 선택 상태로 띄워 준다.
            console.log('지갑을 연결하시오.');
          }
          const targetChainId = getChainId(targetNetwork);
          if (chainId !== targetChainId) {
            if (targetNetwork === 'klaytn' && klaytn.wallet === 'kaikas') {
              // setErrorMessage(targetNetworkMsg);
              // setSuccessRegister(false);
            } else await setupNetwork(targetChainId);
          }
          // check minter
          // const isKaikas =
          //   library.connection.url !== 'metamask' && library.connection.url !== 'eip-1193:';
          //
          // let test;
          // if (!isKaikas) test = await kipContract.isMinter(account);
          // else test = await kasContract.methods.isMinter(account).call();
          // if (!test) {
          //   setErrorMessage(account + ' is not a Minter');
          //   setSuccessRegister(false);
          //   return;
          // }

          // if (isBatchMint) {
          //   console.log(`batch count :  ${values.batch}`);
          //   for (var pair of formData.entries()) {
          //     console.log(pair[0] + ', ' + pair[1]);
          //   }
          // }

          console.log('------------>', formData);
          await registerNFT(formData)
            .then(async (res) => {
              if (res.data.status === 1) {
                const nftId = res.data.data._id;
                const tokenId = res.data.data.metadata.tokenId;
                const tokenUri = res.data.data.ipfs_link;
                const quantity = res.data.data.quantity;

                // Actual NFT Minting here
                // if (contractType === 'KIP17') {
                // if (isKaikas) {
                //   result = await mintNFT17WithKaikas(tokenId, tokenUri, nftId);
                // } else {
                result = await mintNFT17(tokenId, tokenUri, nftId);
                // }
                // } else {
                //   if (isKaikas) {
                //     result = await mintNFT37WithKaikas(tokenId, quantity, tokenUri, nftId);
                //   } else {
                //     result = await mintNFT37(tokenId, quantity, tokenUri, nftId);
                //   }
                // }
                if (result === FAILURE) {
                  // delete nft and serials
                  await cancelCreateNft(nftId);
                  // setErrorMessage('Transaction failed or cancelled.');
                  // setSuccessRegister(false);
                  // } else {
                  //   setErrorMessage(null);
                  //   setSuccessRegister(true);
                }
                // } else {
                //   setErrorMessage(res.data.message);
                //   setSuccessRegister(false);
              }
            })
            .catch((error) => console.log(error));

          // setSubmitting(false);
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          errors,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <CreateNewItemContainer>
              <TitleWrapper>Create New Item</TitleWrapper>
              <FieldWrapper>
                <FiledTitle required={true}>Image, Video, Audio</FiledTitle>
                <FieldSubscription variant="h6">
                  File type supported: JPG, PNG, GIF, MP4. Max size: 100 MB
                </FieldSubscription>
                <ImageSelector
                  image={values.nftItem}
                  handleImageSelect={(image) => setFieldValue('nftItem', image)}
                />
              </FieldWrapper>

              <FieldWrapper>
                <FiledTitle>Collection</FiledTitle>
                <FieldSubscription variant="h6">
                  This is the collection where your item will appear.{' '}
                  <CreateCollection onClick={moveToPage}>My Collection</CreateCollection>
                </FieldSubscription>
                <CustomSelect
                  name="collection"
                  value={values.collection}
                  onChange={(event) => {
                    collectionList.filter((collection) => {
                      console.log('=====>', collection, event.target.value);
                      setFieldValue('collection', event.target.value);
                    });
                  }}
                  fullWidth
                  size="small"
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      minWidth: '250px',
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 2.2,
                      '& .MuiMenu-list': {
                        p: 0,
                      },
                    },
                  }}
                >
                  {collectionList.map((collection) => (
                    <StyledMenuItem key={collection._id} value={collection.name}>
                      {collection.name}
                    </StyledMenuItem>
                  ))}
                </CustomSelect>
              </FieldWrapper>

              <FieldWrapper>
                <FiledTitle required={true}>Title</FiledTitle>
                <CustomTextField
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </FieldWrapper>

              <FieldWrapper>
                <FiledTitle>Description</FiledTitle>
                <FieldSubscription variant="h6">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, necessitatibus?
                </FieldSubscription>
                <CustomTextarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  maxRows={5}
                  minRows={5}
                />
              </FieldWrapper>

              <FieldWrapper>
                <FiledTitle>Category</FiledTitle>
                <FieldSubscription variant="h6">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </FieldSubscription>
                <CustomTextField
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                {/*<CustomSelect*/}
                {/*  name="category"*/}
                {/*  value={values.category}*/}
                {/*  onChange={handleChange}*/}
                {/*  fullWidth*/}
                {/*  size="small"*/}
                {/*  disabled*/}
                {/*  PaperProps={{*/}
                {/*    elevation: 0,*/}
                {/*    sx: {*/}
                {/*      minWidth: '250px',*/}
                {/*      overflow: 'visible',*/}
                {/*      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',*/}
                {/*      mt: 2.2,*/}
                {/*      '& .MuiMenu-list': {*/}
                {/*        p: 0,*/}
                {/*      },*/}
                {/*    },*/}
                {/*  }}*/}
                {/*>*/}
                {/*  {categories.map((category) => (*/}
                {/*    <StyledMenuItem key={category.id} value={category.value}>*/}
                {/*      {category.caption}*/}
                {/*    </StyledMenuItem>*/}
                {/*  ))}*/}
                {/*</CustomSelect>*/}
              </FieldWrapper>

              <FieldWrapper>
                <FiledTitle>Price</FiledTitle>
                <FieldSubscription variant="h6">Lorem ipsum dolor sit amet.</FieldSubscription>
                <CustomTextField
                  name="price"
                  type="number"
                  value={values.price}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </FieldWrapper>

              <FieldWrapper>
                <Button type={'submit'} variant="contained">
                  Create
                </Button>
              </FieldWrapper>
            </CreateNewItemContainer>
          </form>
        )}
      </Formik>
    </MarketLayout>
  );
};

export default CreateNewItem;
