import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import SectionWrapper from '../SectionWrapper';
import { CollectionDetailResponse, NFTType } from '../../../types';
import splitAddress from '../../../../../utils/splitAddress';

interface DetailInformationProps {
  collection: CollectionDetailResponse;
  nft: NFTType;
}
const DetailInformation: React.FC<DetailInformationProps> = ({ nft, collection }) => {
  const [contractType, setContractType] = useState('');

  useEffect(() => {
    switch (collection.network) {
      case 'ethereum':
      case 'binance':
        if (collection.contract_type === 'KIP17') setContractType('ERC721');
        else setContractType('ERC1155');
        break;
      default:
        setContractType(collection.contract_type);
    }
  }, [collection]);

  const handleViewExplorer = (chain: string, address: string) => {
    let url = '';
    switch (chain) {
      case 'ethereum':
        url =
          process.env.REACT_APP_MAINNET === 'true'
            ? `https://etherscan.io/address/${address}`
            : `https://ropsten.etherscan.io/address/${address}`;
        break;
      case 'klaytn':
        url =
          process.env.REACT_APP_MAINNET === 'true'
            ? `https://scope.klaytn.com/account/${address}?tabId=txList`
            : `https://baobab.scope.klaytn.com/account/${address}?tabId=txList`;
        break;
      case 'solana':
        url =
          process.env.REACT_APP_MAINNET === 'true'
            ? `https://solscan.io/account/${address}?cluster=mainnet-beta`
            : `https://solscan.io/account/${address}?cluster=devnet`;
        break;
    }

    window.open(url, '_blank');
  };

  return (
    <>
      <SectionWrapper title={'Description'} icon={'align-left'} maxHeight={'200px'}>
        <Box
          sx={{
            backgroundColor: '#F7FBFD',
            borderRadius: '5px',
            margin: '20px 30px',
            padding: '10px',
          }}
        >
          <Typography variant={'body2'} sx={{ paddingX: 1 }}>
            {nft.metadata.description}
          </Typography>
        </Box>
      </SectionWrapper>
      <SectionWrapper
        title={
          collection.name !== '' || collection.name !== undefined
            ? `${collection.name}`
            : `${collection.contract_address}`
        }
        icon={'pocket'}
        maxHeight={'200px'}
        toggled={false}
      >
        <Box sx={{ p: 2, display: 'flex' }}>
          <img
            src={collection.image_link}
            alt={collection.name}
            style={{
              width: '100px',
              height: '100px',
              border: '1px solid #d6d6d6',
              objectFit: 'cover',
              borderRadius: '20%',
            }}
          />

          <Typography variant={'body2'} sx={{ paddingX: 1, display: 'inline' }}>
            {collection.description}
          </Typography>
        </Box>
      </SectionWrapper>
      <SectionWrapper title={'Details'} icon={'align-center'} maxHeight={'220px'} toggled={false}>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant={'body2'}>Contract Address</Typography>
            <Typography
              variant={'body2'}
              sx={{ cursor: 'pointer' }}
              onClick={() => handleViewExplorer(collection.network, collection.contract_address)}
              color={'primary'}
            >
              {splitAddress(collection.contract_address)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant={'body2'}>Token ID</Typography>
            <Typography variant={'body2'}>{nft.metadata.tokenId}</Typography>
          </Box>
          {nft.metadata.external_url && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant={'body2'}>External Url</Typography>
              <Typography
                variant={'body2'}
                color={'primary'}
                onClick={() => {
                  window.open(nft.metadata.external_url, '_blank');
                }}
                sx={{ cursor: 'pointer' }}
              >
                {nft.metadata.external_url ? nft.metadata.external_url : '-'}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant={'body2'}>Token Standard</Typography>
            {/*<Typography variant={'body2'}>{collection.contract_type}</Typography>*/}
            <Typography variant={'body2'}>{contractType}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant={'body2'}>Blockchain</Typography>
            <Typography variant={'body2'}>{collection.network.toUpperCase()}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant={'body2'}>Creator Earnings</Typography>
            <Typography variant={'body2'}>{`${collection.fee_percentage / 10}%`}</Typography>
          </Box>
          {nft?.quote !== 'krw' && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant={'body2'}>Brokerage fee</Typography>
              <Typography variant={'body2'}>{`${process.env.REACT_APP_CREATOR_FEE}%`}</Typography>
            </Box>
          )}
        </Box>
      </SectionWrapper>
    </>
  );
};

export default DetailInformation;
