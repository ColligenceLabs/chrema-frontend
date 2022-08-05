import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  FormControlLabel,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import CustomCheckbox from '../../components/forms/custom-elements/CustomCheckbox';
import CustomSwitch from '../../components/forms/custom-elements/CustomSwitch';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import EnhancedTableToolbar from '../../components/EnhancedTableToolbar';
import EnhancedTableHead from '../../components/EnhancedTableHead';
import { stableSort, getComparator } from '../../utils/tableUtils';
import { headCells } from './tableConfig';
import { getTransactionData } from '../../services/transaction.service';
import TransactionDetailModal from './TransactionDetailModal';
import splitAddress from '../../utils/splitAddress';
import useCopyToClipBoard from '../../hooks/useCopyToClipBoard';

const Transaction = () => {
  const { t } = useTranslation();

  const [rows, setRows] = useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState({});

  const { copyToClipBoard, copyResult, copyMessage, copyDone, setCopyDone } = useCopyToClipBoard();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
  };

  const setFilters = async (props) => {
    setSearchKeyword(props.searchKeyword);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const emptyRows = rowsPerPage - rows.length;

  const fetchTransactions = async () => {
    await getTransactionData(page, rowsPerPage).then(({ data }) => {
      setRows(data.items);
      setTotalCount(data.headers.x_total_count || 0);
    });
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, rowsPerPage, searchKeyword]);

  return (
    <PageContainer title="Transaction" description="this is transaction page">
      <Breadcrumb title="Transaction" subtitle="Transaction Information" />
      <Box>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} setFilters={setFilters} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                headCells={headCells}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  // .filter((row) => (searchQuery !== '' ? row.uid === searchQuery : row))
                  .map((row, index) => {
                    const isItemSelected = isSelected(row._id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        // onClick={(event) => handleClick(event, row.uid)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row._id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <CustomCheckbox
                            color="primary"
                            checked={isItemSelected}
                            inputprops={{
                              'aria-labelledby': labelId,
                            }}
                            onClick={(event) => handleClick(event, row._id)}
                          />
                        </TableCell>

                        <TableCell
                          sx={{ cursor: 'pointer' }}
                          onClick={() => copyToClipBoard(row.seller.admin_address)}
                        >
                          <Typography color="textSecondary" variant="h6">
                            {/*{row.seller.admin_address}*/}
                            {splitAddress(row.seller.admin_address)}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{ cursor: 'pointer' }}
                          onClick={() => copyToClipBoard(row.buyer)}
                        >
                          <Typography color="textSecondary" variant="h6">
                            {splitAddress(row.buyer)}
                          </Typography>
                        </TableCell>
                        {/*<TableCell style={{ minWidth: 150 }}>*/}
                        {/*  <Typography color="textSecondary" variant="h6">*/}
                        {/*    row.tokenId*/}
                        {/*  </Typography>*/}
                        {/*</TableCell>*/}
                        <TableCell style={{ minWidth: 90 }}>
                          <Typography color="textSecondary" variant="h6">
                            {row.price}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{ cursor: 'pointer' }}
                          onClick={() => copyToClipBoard(row.tx_id)}
                        >
                          <Typography color="textSecondary" variant="h6">
                            {splitAddress(row.tx_id)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box
                              sx={{
                                backgroundColor:
                                  row.status === 'processing'
                                    ? (theme) => theme.palette.success.main
                                    : row.status === 'success'
                                    ? (theme) => theme.palette.warning.main
                                    : row.status === 'suspend'
                                    ? (theme) => theme.palette.error.main
                                    : (theme) => theme.palette.secondary.main,
                                borderRadius: '100%',
                                height: '10px',
                                width: '10px',
                              }}
                            />
                            <Typography
                              color="textSecondary"
                              variant="h6"
                              sx={{
                                ml: 0.5,
                              }}
                            >
                              {row.status}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell style={{ minWidth: 200 }}>
                          <Typography color="textSecondary" variant="h6">
                            {new Date(row.createdAt).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ minWidth: 90 }}>
                          <Box>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedTransaction(row);
                                setOpenDetailModal(true);
                              }}
                            >
                              <AlbumOutlinedIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {/*{emptyRows > 0 && (*/}
                {/*  <TableRow*/}
                {/*    style={{*/}
                {/*      height: (dense ? 33 : 53) * emptyRows,*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    <TableCell colSpan={6} />*/}
                {/*  </TableRow>*/}
                {/*)}*/}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<CustomSwitch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>
      <TransactionDetailModal
        open={openDetailModal}
        handleCloseDetailModal={handleCloseDetailModal}
        row={selectedTransaction}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={copyDone}
        autoHideDuration={2000}
        onClose={() => {
          setCopyDone(false);
        }}
      >
        <Alert variant="filled" severity={copyResult ? 'success' : 'error'} sx={{ width: '100%' }}>
          {copyMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default Transaction;
