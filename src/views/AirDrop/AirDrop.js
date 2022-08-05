import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  FormControlLabel,
  Typography,
  IconButton,
  Chip,
  Switch,
  Snackbar,
  Alert,
} from '@mui/material';
import CustomCheckbox from '../../components/forms/custom-elements/CustomCheckbox';
import CustomSwitch from '../../components/forms/custom-elements/CustomSwitch';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import EnhancedTableToolbar from '../../components/EnhancedTableToolbar';
import EnhancedTableHead from '../../components/EnhancedTableHead';
import { stableSort, getComparator } from '../../utils/tableUtils';
import { headCells } from './tableConfig';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
// import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { deleteNft, getNFTData } from '../../services/nft.service';
import { useSelector } from 'react-redux';
import ScheduleDialog from '../NFTs/ScheduleDialog';
import DeleteDialog from '../../components/DeleteDialog';
import TransferDialog from '../../components/TransferDialog/TransferDialog';
import { useTranslation } from 'react-i18next';
import AirdropDetailModal from './AirdropDetailModal';
import splitAddress from '../../utils/splitAddress';
import useCopyToClipBoard from '../../hooks/useCopyToClipBoard';

const AirDrop = () => {
  const { t } = useTranslation();

  const [rows, setRows] = useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [sendModal, setSendModal] = useState(false);
  const [selectedAirDrop, setSelectedAirDrop] = useState({});
  const [deleteInAction, setDeleteInAction] = useState(false);
  const [finishDelete, setFinishDelete] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const {
    user: {
      infor: { level, id },
    },
  } = useSelector((state) => state.auth);
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

  const setFilters = async (props) => {
    setSearchKeyword(props.searchKeyword);
  };

  const onDelete = async () => {
    let deleteAirdrop = [];

    if (deleteInAction) {
      deleteAirdrop = deleteAirdrop.concat(selectedAirDrop._id);
    } else {
      deleteAirdrop = selected;
    }
    const res = await deleteNft(deleteAirdrop);
    if (res.data.status === 0) {
      setDeleteMessage(res.data.message);
    }
    setOpenDeleteModal(false);
    setDeleteInAction(false);
    setFinishDelete(true);

    await fetchAirDrops();
  };

  const openSchedule = () => {
    setOpenScheduleModal(true);
  };

  const handleCloseModal = () => {
    setOpenScheduleModal(false);
    fetchAirDrops();
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
  };

  const openDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteModal(false);
  };

  const handleSendModal = (row) => {
    setSelectedAirDrop(row);
    setSendModal(true);
  };

  const handleCloseSendModal = async () => {
    setSendModal(false);
    await fetchAirDrops();
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const emptyRows = rowsPerPage - rows.length;

  const fetchAirDrops = async () => {
    await getNFTData(
      1,
      page,
      rowsPerPage,
      searchKeyword,
      undefined,
      level.toLowerCase() === 'creator' ? id : undefined,
    ).then(({ data }) => {
      setRows(data.items);
      setTotalCount(data.headers.x_total_count);
    });
  };

  useEffect(() => {
    fetchAirDrops();
  }, [getNFTData, page, rowsPerPage, searchKeyword]);

  return (
    <PageContainer title="AirDrop" description="this is AirDrop page">
      <Breadcrumb title="AirDrop" subtitle="AirDrop Information" />
      <Box>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            setFilters={setFilters}
            onDelete={openDelete}
            openSchedule={openSchedule}
          />
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
                {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
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
                        onClick={() => copyToClipBoard(row.collection_id?.contract_address)}
                      >
                        <Typography color="textSecondary" variant="h6">
                          {splitAddress(row.collection_id?.contract_address)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                          {row.metadata.name}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ minWidth: 90 }}>
                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                          {row.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {row.selling_status === 1 ? (
                          <Chip
                            label="On sale"
                            color="primary"
                            size={'small'}
                            style={{ margin: '0.5px 0px', fontSize: '10px', height: '18px' }}
                          />
                        ) : (
                          <Chip
                            label="Off sale"
                            color={'secondary'}
                            size={'small'}
                            style={{ margin: '0.5px 0px', fontSize: '10px', height: '18px' }}
                          />
                        )}
                        <Chip
                          label={`Total Mint : ${row.quantity}`}
                          color={'error'}
                          size={'small'}
                          style={{ margin: '0.5px 0px', fontSize: '10px', height: '18px' }}
                        />
                        <Chip
                          label={`Selling Quantity : ${row.quantity_selling}`}
                          color={'success'}
                          size={'small'}
                          style={{ margin: '0.5px 0px', fontSize: '10px', height: '18px' }}
                        />
                        <Chip
                          label={`Prices : ${row.price}`}
                          color={'warning'}
                          size={'small'}
                          style={{ margin: '0.5px 0px', fontSize: '10px', height: '18px' }}
                        />
                      </TableCell>
                      <TableCell style={{ minWidth: 150 }}>
                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                          {row.creator_id?.full_name}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Box
                            sx={{
                              backgroundColor:
                                row.status === 'active'
                                  ? (theme) => theme.palette.success.main
                                  : row.status === 'inactive'
                                  ? (theme) => theme.palette.warning.main
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
                      <TableCell style={{ minWidth: 130 }}>
                        <Switch
                          checked={row.selling}
                          // onChange={handleChange}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </TableCell>
                      <TableCell style={{ minWidth: 200 }}>
                        <Chip
                          label={new Date(row.start_date).toLocaleString()}
                          color={'success'}
                          size={'small'}
                          style={{ margin: '0.5px 0px', fontSize: '10px', height: '18px' }}
                        />
                        <Chip
                          label={new Date(row.end_date).toLocaleString()}
                          color={'error'}
                          size={'small'}
                          style={{ margin: '0.5px 0px', fontSize: '10px', height: '18px' }}
                        />
                      </TableCell>
                      <TableCell style={{ minWidth: 200 }}>
                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                          {new Date(row.createdAt).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ minWidth: 200 }}>
                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                          <Box>
                            <IconButton
                              size={'small'}
                              disabled={row.quantity_selling === row.transfered}
                              onClick={() => handleSendModal(row)}
                            >
                              <SendOutlinedIcon />
                            </IconButton>
                            <IconButton
                              size={'small'}
                              onClick={() => {
                                setSelectedAirDrop(row);
                                setOpenDetailModal(true);
                              }}
                            >
                              <AlbumOutlinedIcon />
                            </IconButton>
                            {/*<IconButton*/}
                            {/*  onClick={() => {*/}
                            {/*    setSelectedAirDrop(row);*/}
                            {/*    setDeleteInAction(true);*/}
                            {/*    openDelete();*/}
                            {/*  }}*/}
                            {/*>*/}
                            {/*  <DeleteOutlinedIcon />*/}
                            {/*</IconButton>*/}
                          </Box>
                        </Typography>
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
      <ScheduleDialog
        open={openScheduleModal}
        handleCloseModal={handleCloseModal}
        selected={selected}
      />
      <DeleteDialog
        title="AirDrop 삭제"
        open={openDeleteModal}
        handleDeleteClose={handleDeleteClose}
        doDelete={onDelete}
      />
      <TransferDialog
        open={sendModal}
        handleCloseModal={handleCloseSendModal}
        item={selectedAirDrop}
        type={selectedAirDrop.collection_id?.contract_type}
      />
      <AirdropDetailModal
        open={openDetailModal}
        handleCloseDetailModal={handleCloseDetailModal}
        row={selectedAirDrop}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={finishDelete}
        autoHideDuration={2000}
        onClose={() => {
          setFinishDelete(false);
        }}
      >
        <Alert
          variant="filled"
          severity={deleteMessage === null ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {deleteMessage === null ? t('Success delete NFTs.') : t(`${deleteMessage}`)}
        </Alert>
      </Snackbar>
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

export default AirDrop;
