import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'; // mint
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // sale
import FireplaceIcon from '@mui/icons-material/Fireplace'; // burn
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'; // transfer
import LinkIcon from '@mui/icons-material/Link';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTheme } from '@mui/material/styles';
import SectionWrapper from '../DetailComponents/SectionWrapper';
import useSWR from 'swr';
import klayLogo from '../../../../assets/images/network_icon/klaytn-klay-logo.png';
import talkLogo from '../../../../assets/images/logos/talken_icon.png';
import bnbLogo from '../../../../assets/images/network_icon/binance-bnb-logo.png';

import sliceFloatNumber from '../../../../utils/sliceFloatNumber';
import splitAddress from '../../../../utils/splitAddress';

interface ItemActivityProps {
  id: string;
  contractType: string;
  itemActivityMutateHandler: boolean;
  setItemActivityMutateHandler: (b: boolean) => void;
}

interface ActivityTypes {
  block_date: Date;
  block_number: number;
  contract_address: string;
  createdAt: Date;
  chain_id: string;
  from: string;
  nft_id: string;
  price: number;
  quantity: number;
  quote: string;
  to: string;
  token_id: string;
  tx_id: string;
  type: number;
  updatedAt: Date;
  __v: number;
  _id: string;
}

const EVENT_TYPE = [
  { value: 0, name: 'BURN' },
  { value: 1, name: 'MINT' },
  { value: 2, name: 'LIST' },
  { value: 3, name: 'SALE' },
  { value: 4, name: 'CANCEL' },
  { value: 5, name: 'TRANSFER' },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ItemActivity: React.FC<ItemActivityProps> = ({
  id,
  contractType,
  itemActivityMutateHandler,
  setItemActivityMutateHandler,
}) => {
  const theme = useTheme();
  const [selectedFilter, setSelectedFilter] = useState([] as any);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rowCount, setRowCount] = useState(0);
  const [activityList, setActivityList] = useState([]);

  const url = `${process.env.REACT_APP_API_SERVER}/admin-api/market/nft-events/${id}?page=${
    page + 1
  }&size=${rowsPerPage}&types=${selectedFilter.toString()}`;
  const { data, mutate } = useSWR(url, fetcher);

  const getEventCaptionByValue = (value: number) => {
    const result = EVENT_TYPE.filter((item) => item.value === value);
    return result ? result[0].name : '-';
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //todo eth, solana tx url 주소 수정 필요
  const handleViewExplorerByTx = (chain: string, tx: string) => {
    let url = '';
    switch (chain) {
      case '1':
      case '3':
        url =
          process.env.REACT_APP_MAINNET === 'true'
            ? `https://etherscan.io/address/${tx}`
            : `https://ropsten.etherscan.io/address/${tx}`;
        break;
      case '8217':
      case '1001':
        url =
          process.env.REACT_APP_MAINNET === 'true'
            ? `https://scope.klaytn.com/tx/${tx}?tabId=txList`
            : `https://baobab.scope.klaytn.com/tx/${tx}?tabId=txList`;
        break;
      case '56':
      case '97':
        url =
          process.env.REACT_APP_MAINNET === 'true'
            ? `https://bscscan.com/tx/${tx}`
            : `https://testnet.bscscan.com/tx/${tx}`;

      // case 'solana':
      //   url =
      //     process.env.REACT_APP_MAINNET === 'true'
      //       ? `https://solscan.io/account/${tx}?cluster=mainnet-beta`
      //       : `https://solscan.io/account/${tx}?cluster=devnet`;
      //   break;
    }

    window.open(url, '_blank');
  };

  useEffect(() => {
    if (data && data?.data !== undefined) {
      const result = data?.data?.items.map((activity: ActivityTypes) => ({
        ...activity,
      }));

      setActivityList(result);
      setRowCount(data?.data?.headers.x_total_count);
    }
  }, [data]);

  useEffect(() => {
    mutate().then((res) => {
      if (res.data && res.data?.data !== undefined) {
        const result = res?.data?.items.map((activity: ActivityTypes) => ({
          ...activity,
        }));

        setActivityList(result);
        setRowCount(res?.data?.headers.x_total_count);
      }
      setItemActivityMutateHandler(false);
    });
  }, [itemActivityMutateHandler]);

  return (
    <SectionWrapper title={'Item Activity'} icon={'activity'} toggled={true}>
      <Box sx={{ backgroundColor: '#f0faf5', p: 1, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, pb: 1 }}>
          <Select
            multiple
            fullWidth
            value={selectedFilter}
            onChange={(event) => setSelectedFilter(event.target.value)}
            sx={{ p: 0, m: 0, backgroundColor: 'white' }}
            renderValue={(selected) => (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                {selected.map((item: any, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                      backgroundColor: `${theme.palette.primary.main}`,
                      px: 2,
                      borderRadius: '10px',
                    }}
                  >
                    <Typography variant={'subtitle2'} color={'white'}>
                      {getEventCaptionByValue(item)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {EVENT_TYPE.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          {selectedFilter.length > 0 && (
            <Button variant={'contained'} onClick={() => setSelectedFilter([])}>
              Clear
            </Button>
          )}
        </Box>
        <Box sx={{ height: '368px', backgroundColor: 'white' }}>
          <TableContainer>
            <Table aria-labelledby="tableTitle" size={'small'}>
              <TableHead>
                <TableRow sx={{ height: '50px' }}>
                  <TableCell align={'left'} padding={'normal'}>
                    Event
                  </TableCell>
                  <TableCell align={'left'} padding={'normal'}>
                    Price
                  </TableCell>
                  {contractType === 'KIP37' && (
                    <TableCell align={'left'} padding={'normal'}>
                      Amount
                    </TableCell>
                  )}
                  <TableCell align={'left'} padding={'normal'}>
                    From
                  </TableCell>
                  <TableCell align={'left'} padding={'normal'}>
                    To
                  </TableCell>
                  <TableCell align={'left'} padding={'normal'}>
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activityList &&
                  activityList.map((row: ActivityTypes) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row._id}
                        sx={{ height: '50px' }}
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
                            {row.type === 0 && <FireplaceIcon fontSize={'small'} />}
                            {row.type === 1 && <AddShoppingCartIcon fontSize={'small'} />}
                            {(row.type === 2 || row.type === 3) && (
                              <ShoppingCartIcon fontSize={'small'} />
                            )}
                            {row.type === 4 && <CancelIcon fontSize={'small'} />}
                            {row.type === 5 && <CompareArrowsIcon fontSize={'small'} />}
                            <Typography color="textSecondary" variant={'h6'}>
                              {getEventCaptionByValue(row.type)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {row.type !== 1 && row.type !== 0 ? (
                            <Box sx={{ display: 'flex', gap: 0.7, alignItems: 'center' }}>
                              {row.quote === 'klay' && (
                                <img src={klayLogo} alt="klay" height="16px" />
                              )}
                              {row.quote === 'talk' && (
                                <img src={talkLogo} alt="talk" height="16px" />
                              )}
                              {row.quote === 'bnb' && <img src={bnbLogo} alt="bnb" height="16px" />}
                              {row.quote === 'krw' && (
                                <Typography variant={'h6'} color={'text.primary'} sx={{ mr: -0.3 }}>
                                  ￦
                                </Typography>
                              )}
                              <Typography color="textSecondary" variant="h6">
                                {`${sliceFloatNumber(row.price.toString())}`}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography color="textSecondary" variant="h6">
                              -
                            </Typography>
                          )}
                        </TableCell>
                        {contractType === 'KIP37' && (
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              {row.quantity}
                            </Typography>
                          </TableCell>
                        )}
                        <TableCell>
                          <Typography color="textSecondary" variant="h6">
                            {row.type === 1 ? splitAddress(row.to) : splitAddress(row.from)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography color="textSecondary" variant="h6">
                            {row.type === 1 ? splitAddress(row.from) : splitAddress(row.to)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.75,
                              cursor: 'pointer',
                            }}
                            onClick={() => handleViewExplorerByTx(row.chain_id, row.tx_id)}
                          >
                            <Typography color="primary" variant="h6">
                              {new Date(row.createdAt).toLocaleString()}
                            </Typography>
                            <LinkIcon color={'primary'} />
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rowCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>
    </SectionWrapper>
  );
};

export default ItemActivity;
