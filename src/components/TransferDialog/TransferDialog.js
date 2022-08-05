import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Snackbar,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import CustomTextField from '../forms/custom-elements/CustomTextField';
import { useWeb3React } from '@web3-react/core';
import { useKipContract, useKipContractWithKaikas } from '../../hooks/useContract';
import useNFT from '../../hooks/useNFT';
import contracts from '../../config/constants/contracts';
import { batchRegisterNFT, kasTransferNFT } from '../../services/nft.service';
import { LoadingButton } from '@mui/lab';

const TransferDialog = ({ open, handleCloseModal, item, type }) => {
  const theme = useTheme();
  const { account, library } = useWeb3React();

  const [contractAddr, setContractAddr] = useState(contracts.kip17[1001]);
  const [contractType, setContractType] = useState('KIP17');
  const kipContract = useKipContract(contractAddr, contractType);
  const kipKaikasContract = useKipContractWithKaikas(contractAddr, contractType);
  const { transferNFT, transferNFTWithKaikas, isTransfering } = useNFT(
    kipContract,
    kipKaikasContract,
    account,
  );

  const [errorMessage, setErrorMessage] = useState();
  const [successFlag, setSuccessFlag] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState(1);
  const [maxAmount, setMaxAmount] = useState(0);

  useEffect(() => {
    if (item !== undefined) {
      if (item && item.collection_id) {
        setContractAddr(item.collection_id.contract_address);
        setContractType(type);
        setMaxAmount(item.sell_amount - item.transfered);
      }
    }
    return () => setMaxAmount(0);
  }, [item, isTransfering]);

  const handleChangeToAddress = (e) => {
    setToAddress(e.target.value);
  };

  const handleChangeAmount = (e) => {
    setAmount(e.target.value > maxAmount ? maxAmount : e.target.value);
  };

  const handleTransfer = async () => {
    // toAddress, amount
    const tokenId = item.metadata.tokenId;
    const nftId = item._id;
    const useKAS = process.env.REACT_APP_USE_KAS ?? 'false';

    if (useKAS === 'true') {
      const formData = {
        nft_id: nftId,
        from_address: account,
        to_address: toAddress,
        tokenId,
        amount,
      };
      // TODO : isTransfering 사용하여 Send 버튼 로딩 표시...
      await kasTransferNFT(formData)
        .then(async (res) => {
          if (res.data.status === 1) {
            setErrorMessage(null);
            setSuccessFlag(true);
          } else {
            setErrorMessage(res.data.message.error._message);
            setSuccessFlag(false);
          }
        })
        .catch((error) => {
          setSuccessFlag(false);
          setErrorMessage(error);
        });
    } else {
      if (library.connection.url !== 'metamask' && library.connection.url !== 'eip-1193:') {
        const [success, error] = await transferNFTWithKaikas(
          tokenId,
          toAddress,
          amount,
          nftId,
          contractType,
        );

        // api finish =>  success ? setSuccessFlag(true), setErrorMessage(null) : setSuccessFlag(false),  setErrorMessage(error.message)
        success ? setSuccessFlag(true) : setSuccessFlag(false);
        success ? setErrorMessage(null) : setErrorMessage(error);
      } else {
        const [success, error] = await transferNFT(tokenId, toAddress, amount, nftId, contractType);

        // api finish =>  success ? setSuccessFlag(true), setErrorMessage(null) : setSuccessFlag(false),  setErrorMessage(error.message)
        success ? setSuccessFlag(true) : setSuccessFlag(false);
        success ? setErrorMessage(null) : setErrorMessage(error);
      }
    }
    setOpenSnackbar(true);
    handleClose();
  };

  const handleClose = () => {
    setToAddress('');
    handleCloseModal();
  };

  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        // onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle style={{ background: `${theme.palette.primary.main}` }}>
          <Typography variant="title" color="white">
            {`Transfer ${item.type === 0 ? 'NFT' : 'AirDrop'} : ${item?.metadata?.name}`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <CustomFormLabel htmlFor="toAddress">{t('To Address')}</CustomFormLabel>
          <CustomTextField
            id="toAddress"
            name="toAddress"
            variant="outlined"
            fullWidth
            size="small"
            value={toAddress}
            onChange={handleChangeToAddress}
          />
          {type === 'KIP37' && (
            <>
              <Box
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
              >
                <CustomFormLabel htmlFor="amount">{t('Amount')}</CustomFormLabel>
                <Typography variant="caption" color="primary" sx={{ mr: 1 }}>
                  {t('Balance')} : {maxAmount}
                </Typography>
              </Box>
              <CustomTextField
                id="amount"
                name="amount"
                type="number"
                variant="outlined"
                fullWidth
                size="small"
                value={amount || ''}
                onChange={handleChangeAmount}
              />
            </>
          )}
        </DialogContent>

        <Divider />
        <DialogActions style={{ marginRight: '20px', padding: '10px' }}>
          <Button variant="outlined" onClick={handleClose}>
            {t('Cancel')}
          </Button>
          <LoadingButton onClick={handleTransfer} loading={isTransfering} variant="contained">
            {t('Send')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openSnackbar}
        autoHideDuration={successFlag ? 2000 : 3000}
        onClose={() => {
          setOpenSnackbar(false);
        }}
      >
        <Alert
          onClose={() => {
            setOpenSnackbar(false);
          }}
          variant="filled"
          severity={successFlag ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {successFlag ? 'Success' : errorMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default TransferDialog;
