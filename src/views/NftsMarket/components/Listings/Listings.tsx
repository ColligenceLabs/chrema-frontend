import React, { useEffect, useState } from 'react';
import {
  Box,
  TablePagination,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@mui/material';
import SectionWrapper from '../DetailComponents/SectionWrapper';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import useSWR from 'swr';
import splitAddress from '../../../../utils/splitAddress';
import klayLogo from '../../../../assets/images/network_icon/klaytn-klay-logo.png';
import talkLogo from '../../../../assets/images/logos/talken_icon.png';
import bnbLogo from '../../../../assets/images/network_icon/binance-bnb-logo.png';

import { useWeb3React } from '@web3-react/core';
import { NFTType } from '../../types';
import { getNftContract } from '../../../../utils/contract';
import useMarket from '../../../../hooks/useMarket';
import {
  cancelBuyUserNft,
  cancelSale,
  selectUserSerials,
} from '../../../../services/market.service';
import { LoadingButton } from '@mui/lab';
import sliceFloatNumber from '../../../../utils/sliceFloatNumber';
import { getChainId } from '../../../../utils/commonUtils';

interface SaleItemTypes {
  _id: string;
  collection_id: string;
  createdAt: Date;
  nft_id: string;
  price: number;
  quantity: number;
  seller: string;
  sold: number;
  token_id: string;
  priceUsd: number;
  quote: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ListingsProps {
  id: string;
  listingMutateHandler: boolean;
  nft: NFTType;
  myNftMutateHandler: boolean;
  setMyNftMutateHandler: (b: boolean) => void;
  setItemActivityMutateHandler: (b: boolean) => void;
}

const Listings: React.FC<ListingsProps> = ({
  id,
  listingMutateHandler,
  nft,
  myNftMutateHandler,
  setMyNftMutateHandler,
  setItemActivityMutateHandler,
}) => {
  const context = useWeb3React();
  const { account, library } = context;
  const [selectedID, setSelectedID] = useState<string | null>(null);
  const [saleList, setSaleList] = useState<SaleItemTypes[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isBuyingLoading, setIsBuyingLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const { buyNFT, stopSelling } = useMarket();

  const url = `${process.env.REACT_APP_API_SERVER}/admin-api/market/saleList/${id}?page=${
    page + 1
  }&size=${rowsPerPage}`;

  const { data, mutate, error } = useSWR(url, fetcher);

  useEffect(() => {
    mutate();
  }, [page]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBuy = async (row: SaleItemTypes) => {
    // console.log(row, nft);
    setIsBuyingLoading(true);
    try {
      // serials 에서 buyer 및 buying 처리 (api 호출) select-user-serials
      // sale에서 sold 올리기 sold가 0인것이 없으면 에러 처리 후 serials에서 buyer, stautus 변경
      const userSerial = await selectUserSerials(id, account, row.seller, row.quantity, row._id);
      // console.log(userSerial);

      // 사용자가 판매한 Nft를 지갑을 통해 구매
      const nftContract = getNftContract(
        library,
        nft.collection_id.contract_address,
        nft.collection_id.contract_type,
      );
      const result = await buyNFT(
        nftContract,
        parseInt(row.token_id, 16),
        row.seller,
        row.quantity,
        row.quantity,
        row.price,
        row.quote,
        getChainId(nft.collection_id.network),
      );
      // console.log(result);
      if (result === 1) {
        await mutate();
        setMyNftMutateHandler(true);
        setItemActivityMutateHandler(true);
      }
      // 사용자 구매 내역을 서버에 전송 (sold count 수정)
    } catch (e) {
      // cancel buy (api 호출)
      await cancelBuyUserNft(id, row.token_id, account, row.seller, row._id);
      await mutate();
      setMyNftMutateHandler(true);
      setItemActivityMutateHandler(true);
    }
    setIsBuyingLoading(false);
  };

  const handleCancel = async (row: SaleItemTypes) => {
    setIsCancelLoading(true);
    try {
      // nftContract, tokenId, quantity, price, quote
      // const nftContract = getNftContract(
      //   library,
      //   nft.collection_id.contract_address,
      //   nft.collection_id.contract_type,
      // );
      const stopResult = await stopSelling(
        nft.collection_id.contract_address,
        parseInt(row.token_id, 16),
        row.quantity,
        row.price,
        row.quote,
        getChainId(nft.collection_id.network),
      );
      // console.log(stopResult);
      // sale collection 에서 삭제.
      const result = await cancelSale(account, row._id);

      if (result.status === 1) {
        await mutate();
        setMyNftMutateHandler(true);
        setItemActivityMutateHandler(true);
      }
    } catch (e) {
      console.log(e);
    }
    setIsCancelLoading(false);
  };

  useEffect(() => {
    if (data && data?.data !== undefined) {
      const result = data?.data?.items.map((sale: SaleItemTypes) => ({
        ...sale,
      }));

      setSaleList(result);
      // setPageSize(data?.data?.headers.x_pages_count);
      setRowCount(data?.data?.headers.x_total_count);
    }
  }, [data]);

  useEffect(() => {
    if (listingMutateHandler) {
      mutate();
    }
  }, [listingMutateHandler]);

  return (
    <SectionWrapper title={'Listing'} icon={<FormatListBulletedOutlinedIcon />}>
      <Box
        sx={{
          borderRadius: '5px',
          margin: '20px 30px',
          // padding: '10px',
        }}
      >
        <TableContainer>
          <Table aria-labelledby="tableTitle" size={'small'}>
            <TableHead sx={{ backgroundColor: '#F7FBFD' }}>
              <TableRow>
                <TableCell align={'left'} padding={'normal'}>
                  Unit Price
                </TableCell>
                <TableCell align={'left'} padding={'normal'}>
                  USD Unit Price
                </TableCell>
                <TableCell align={'left'} padding={'normal'}>
                  Quantity
                </TableCell>
                {/*<TableCell align={'left'} padding={'normal'}>*/}
                {/*  Expiration*/}
                {/*</TableCell>*/}
                <TableCell align={'left'} padding={'normal'}>
                  From
                </TableCell>
                <TableCell align={'left'} padding={'normal'}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {saleList.map((row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row._id}
                    onClick={() => setSelectedID(row._id)}
                    sx={{ backgroundColor: '#ffffff' }}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        {row?.quote === 'klay' && <img src={klayLogo} alt="klay" height="16px" />}
                        {row?.quote === 'talk' && <img src={talkLogo} alt="klay" height="16px" />}
                        {row?.quote === 'bnb' && <img src={bnbLogo} alt="bnb" height="16px" />}

                        <Typography color="textSecondary" variant={'h6'}>
                          {row.price}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6">
                        {`$ ${sliceFloatNumber(row.priceUsd.toString())}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6">
                        {row.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6">
                        {splitAddress(row.seller)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {account && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {row.seller === account ? (
                            <LoadingButton
                              variant={'contained'}
                              size={'small'}
                              loading={
                                (isBuyingLoading || isCancelLoading) && row._id === selectedID
                              }
                              disabled={
                                (isBuyingLoading || isCancelLoading) && row._id !== selectedID
                              }
                              onClick={() => handleCancel(row)}
                              sx={{ width: '70px' }}
                            >
                              Cancel
                            </LoadingButton>
                          ) : (
                            <LoadingButton
                              variant={'contained'}
                              size={'small'}
                              loading={
                                (isCancelLoading || isBuyingLoading) && row._id === selectedID
                              }
                              disabled={
                                (isCancelLoading || isBuyingLoading) && row._id !== selectedID
                              }
                              onClick={() => handleBuy(row)}
                              sx={{ width: '70px' }}
                            >
                              Buy
                            </LoadingButton>
                          )}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{ backgroundColor: '#ffffff' }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rowCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </SectionWrapper>
  );
};

export default Listings;
