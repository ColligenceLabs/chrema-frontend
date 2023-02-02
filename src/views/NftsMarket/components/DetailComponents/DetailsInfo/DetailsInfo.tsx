import React, { useEffect, useState } from 'react';
import { CollectionDetailResponse, NFTType } from '../../../types';
import { Box, Typography } from '@mui/material';
import splitAddress from '../../../../../utils/splitAddress';
import SectionWrapper from '../SectionWrapper';
import { styled } from '@mui/material/styles';

interface DetailInformationProps {
  collection: CollectionDetailResponse;
  nft: NFTType;
}

const DetailSectionWrap = styled(Box)`
  display: flex;
  justify-content: space-between;
  background-color: #f7fbfd;
  padding: 15px;
  border-radius: 5px;
`;

const DetailTypography = styled(Typography)`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #706c83;
`;
const DetailsInfo: React.FC<DetailInformationProps> = ({ nft, collection }) => {
  const [contractType, setContractType] = useState('');
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

  return (
    <SectionWrapper title={'Details'} icon={'align-center'}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <DetailSectionWrap>
          <DetailTypography>Contract Address</DetailTypography>
          <DetailTypography
            sx={{ cursor: 'pointer' }}
            onClick={() => handleViewExplorer(collection.network, collection.contract_address)}
          >
            {splitAddress(collection.contract_address)}
          </DetailTypography>
        </DetailSectionWrap>
        <DetailSectionWrap>
          <DetailTypography>Token ID</DetailTypography>
          <DetailTypography>{nft.metadata.tokenId}</DetailTypography>
        </DetailSectionWrap>
        {nft.metadata.external_url && (
          <DetailSectionWrap>
            <DetailTypography>External Url</DetailTypography>
            <DetailTypography
              onClick={() => {
                window.open(nft.metadata.external_url, '_blank');
              }}
              sx={{ cursor: 'pointer' }}
            >
              {nft.metadata.external_url ? nft.metadata.external_url : '-'}
            </DetailTypography>
          </DetailSectionWrap>
        )}
        <DetailSectionWrap>
          <DetailTypography>Token Standard</DetailTypography>
          {/*<Typography variant={'body2'}>{collection.contract_type}</Typography>*/}
          <DetailTypography>{contractType}</DetailTypography>
        </DetailSectionWrap>
        <DetailSectionWrap>
          <DetailTypography>Blockchain</DetailTypography>
          <DetailTypography>{collection.network.toUpperCase()}</DetailTypography>
        </DetailSectionWrap>
        <DetailSectionWrap>
          <DetailTypography>Creator Earnings</DetailTypography>
          <DetailTypography>{`${collection.fee_percentage / 10}%`}</DetailTypography>
        </DetailSectionWrap>
        {nft?.quote !== 'krw' && (
          <DetailSectionWrap>
            <DetailTypography>Brokerage fee</DetailTypography>
            <DetailTypography>{`${process.env.REACT_APP_CREATOR_FEE}%`}</DetailTypography>
          </DetailSectionWrap>
        )}
      </Box>
    </SectionWrapper>
  );
};

export default DetailsInfo;
