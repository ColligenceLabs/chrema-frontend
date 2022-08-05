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
} from '@mui/material';
import CustomCheckbox from '../../components/forms/custom-elements/CustomCheckbox';
import CustomSwitch from '../../components/forms/custom-elements/CustomSwitch';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import EnhancedTableToolbar from '../../components/EnhancedTableToolbar';
import EnhancedTableHead from '../../components/EnhancedTableHead';
import { headCells } from './tableConfig';
import { stableSort, getComparator } from '../../utils/tableUtils';
import CollectionDetailModal from './CollectionDetailModal';
import { deleteCollections, getCollectionData } from '../../services/collections.service';
import { getCreatorData } from '../../services/creator.service';
import { useSelector } from 'react-redux';
import DeleteDialog from '../../components/DeleteDialog';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { useNavigate } from 'react-router-dom';

const Collections = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedDetailRow, setSelectedDetailRow] = useState({});
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchCreatorId, setSearchCreatorId] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [deleteInAction, setDeleteInAction] = useState(false);
  const [finishDelete, setFinishDelete] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const {
    user: {
      infor: { level, id },
    },
  } = useSelector((state) => state.auth);

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

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const handleDetailModalOpen = (row) => {
    setSelectedDetailRow(row);
    setOpenDetailModal(true);
  };

  const openDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleDetailModalClose = () => {
    setOpenDetailModal(false);
  };

  const setFilters = async (props) => {
    setSearchKeyword(props.searchKeyword);
    setSearchCreatorId(props.creatorId);
    setSearchStatus(props.status);
  };

  const onDelete = async (multiFlag = true) => {
    let deleteArray = [];

    if (deleteInAction) {
      deleteArray = deleteArray.concat(selectedDetailRow._id);
    } else {
      deleteArray = selected;
    }
    const res = await deleteCollections({ ids: deleteArray });
    if (res.data.status === 0) {
      setDeleteMessage(res.data.message);
    } else {
      setSelected([]);
    }
    setOpenDeleteModal(false);
    setDeleteInAction(false);
    setFinishDelete(true);

    await fetchCollections();
  };

  const handleDeleteClose = () => {
    setOpenDeleteModal(false);
  };

  const handleCollectionUpdate = (row) => {
    navigate(`/collection/update`, {
      state: {
        ...row,
      },
    });
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const fetchCollections = async () => {
    const {
      data: { items: creatorList },
    } = await getCreatorData();

    await getCollectionData(
      page,
      rowsPerPage,
      level.toLowerCase() === 'creator' ? id : searchCreatorId,
      searchKeyword,
      searchStatus,
    ).then(({ data }) => {
      const collectionArray = data.items.map((item) => {
        let temp = creatorList?.find((creator) => creator._id === item.creator_id._id);

        return { ...item, creator_name: temp?.full_name };
      });

      setRows(collectionArray);
      setTotalCount(data.headers.x_total_count);
    });
  };

  useEffect(async () => {
    await fetchCollections();
  }, [getCollectionData, page, rowsPerPage, searchKeyword, searchCreatorId, searchStatus]);

  return (
    <PageContainer title="Collections" description="this is collections page">
      <Breadcrumb title="Collections" subtitle="Collections Information" />
      <Box>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            setFilters={setFilters}
            onDelete={openDelete}
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
                {stableSort(rows, getComparator(order, orderBy))
                  // .filter((row) => (searchQuery !== '' ? row.uid === searchQuery : row))
                  .map((row, index) => {
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
                        {/*<TableCell>*/}
                        {/*  <Typography color="textSecondary" variant="h6">*/}
                        {/*    {row._id}*/}
                        {/*  </Typography>*/}
                        {/*</TableCell>*/}
                        <TableCell>
                          <Typography color="textSecondary" variant="h6">
                            {row.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography color="textSecondary" variant="h6">
                            {row.creator_name}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ minWidth: 200 }}>
                          <Typography color="textSecondary" variant="h6">
                            {new Date(row.createdAt).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box
                              sx={{
                                backgroundColor:
                                  row.status === 'Active'
                                    ? (theme) => theme.palette.success.main
                                    : row.status === 'Pending'
                                    ? (theme) => theme.palette.warning.main
                                    : row.status === 'Completed'
                                    ? (theme) => theme.palette.primary.main
                                    : row.status === 'Cancel'
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
                          <Box>
                            {/*<IconButton>*/}
                            {/*  <RefreshOutlinedIcon />*/}
                            {/*</IconButton>*/}
                            <IconButton onClick={() => handleDetailModalOpen(row)}>
                              <AlbumOutlinedIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setSelectedDetailRow(row);
                                setDeleteInAction(true);
                                openDelete();
                              }}
                            >
                              <DeleteOutlinedIcon />
                            </IconButton>
                            <IconButton onClick={() => handleCollectionUpdate(row)}>
                              <ModeEditOutlineOutlinedIcon />
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
      <DeleteDialog
        title="Collection 삭제"
        open={openDeleteModal}
        handleDeleteClose={handleDeleteClose}
        doDelete={onDelete}
      />
      <CollectionDetailModal
        open={openDetailModal}
        closeDetailModal={handleDetailModalClose}
        row={selectedDetailRow}
      />
    </PageContainer>
  );
};

export default Collections;
