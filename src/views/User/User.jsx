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
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import EnhancedTableToolbar from '../../components/EnhancedTableToolbar';
import EnhancedTableHead from '../../components/EnhancedTableHead';
import { stableSort, getComparator } from '../../utils/tableUtils';
import { headCells } from './tableConfig';
import UserDetailModal from './UserDetailModal';
import { deleteUser, getUserData } from '../../services/user.service';
import DeleteDialog from '../../components/DeleteDialog';

const User = () => {
  const { t } = useTranslation();

  const [rows, setRows] = useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [userDetailModal, setUserDetailModal] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState({});
  const [searchKeyword, setSearchKeyword] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

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

  const handleUserDetailModal = (row) => {
    setSelectedUserDetail(row);
    setUserDetailModal(true);
  };

  const closeUserDetailModal = () => {
    setUserDetailModal(false);
  };

  const onDelete = async () => {
    const res = await deleteUser(selected);
    await fetchUsers();
    setOpenDeleteModal(false);
  };

  const openDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteModal(false);
  };

  const setFilters = async (props) => {
    setSearchKeyword(props.searchKeyword);
    setUserStatus(props.status);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const emptyRows = rowsPerPage - rows.length;

  const fetchUsers = async () => {
    await getUserData(page, rowsPerPage, searchKeyword, userStatus).then(({ data }) => {
      setRows(data.items);
      setTotalCount(data.headers.x_total_count);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [getUserData, page, rowsPerPage, searchKeyword, userStatus]);

  return (
    <PageContainer title="User" description="this is users page">
      <Breadcrumb title={t('User')} subtitle={t('User Information')} />
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
                        <TableCell>
                          <Typography color="textSecondary" variant="h6">
                            {row.uid}
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
                        <TableCell>
                          <Typography color="textSecondary" variant="h6">
                            {new Date(row.createdAt).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <IconButton>
                              <RefreshOutlinedIcon />
                            </IconButton>
                            <IconButton onClick={() => handleUserDetailModal(row)}>
                              <AlbumOutlinedIcon />
                            </IconButton>
                            <IconButton>
                              <DeleteOutlinedIcon />
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
      <UserDetailModal
        open={userDetailModal}
        closeUserDetailModal={closeUserDetailModal}
        row={selectedUserDetail}
      />
      <DeleteDialog
        title="USER 삭제"
        open={openDeleteModal}
        handleDeleteClose={handleDeleteClose}
        doDelete={onDelete}
      />
    </PageContainer>
  );
};

export default User;
