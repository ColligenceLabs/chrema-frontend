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
  Switch,
} from '@mui/material';
import CustomCheckbox from '../../components/forms/custom-elements/CustomCheckbox';
import CustomSwitch from '../../components/forms/custom-elements/CustomSwitch';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import EnhancedTableToolbar from '../../components/EnhancedTableToolbar';
import EnhancedTableHead from '../../components/EnhancedTableHead';
import StatusDialog from '../../components/StatusDialog';
import { headCells } from './tableConfig';
import { stableSort, getComparator } from '../../utils/tableUtils';
import { getCreatorData } from '../../services/creator.service';
import { updateAdminsStatus, updateMultiAdminsStatus } from '../../services/admins.service';
import AdminsDetailModal from '../Admins/AdminsDetailModal';
import useUserInfo from '../../hooks/useUserInfo';
// import { WhitelistedCreator } from '@colligence/metaplex-common/dist/lib/models/metaplex';
// import { saveAdmin } from '../../solana/actions/saveAdmin';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { useConnection } from '@colligence/metaplex-common';
import { useNavigate } from 'react-router-dom';

const Creator = () => {
  const { t } = useTranslation();
  const { id } = useUserInfo();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedAdmin, setSelectedAdmin] = useState({});
  const [statusOpen, setStatusOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [adminDetailModal, setAdminDetailModal] = useState(false);

  // const connection = useConnection();
  // const wallet = useWallet();

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

  const handleUserUpdate = (row) => {
    navigate(`/creator/update`, {
      state: {
        ...row,
      },
    });
  };

  const handleUserDetailModal = (row) => {
    setSelectedAdmin(row);
    setAdminDetailModal(true);
  };

  const closeUserDetailModal = () => {
    setAdminDetailModal(false);
  };

  const handleStatusOpen = (row) => {
    setSelectedAdmin(row);
    setStatusOpen(true);
  };

  const handleStatusClose = () => {
    setStatusOpen(false);
  };

  const updateStatus = async (id, status, solana) => {
    const newStatus = status === 'active' ? 'inactive' : 'active';
    await updateAdminsStatus(id, newStatus).then((res) => {
      if (res.status === 1) {
        setRows(rows.map((row) => (row._id === id ? { ...row, status: newStatus } : row)));
      }
    });

    // TODO : In case of Solana creator add creator here
    // if (newStatus === 'active' && solana !== '' && solana !== undefined) {
    //   const newWhitelistedCreator = new WhitelistedCreator({
    //     activated: true,
    //     address: solana,
    //   });
    //   const updatedCreators = { [solana]: newWhitelistedCreator };
    //   if (connection && wallet) {
    //     // isPublic = always false : we don't permit a public store.
    //     await saveAdmin(connection, wallet, false, Object.values(updatedCreators));
    //   }
    // }

    setStatusOpen(false);
  };

  const setFilters = async (props) => {
    setSearchName(props.full_name);
    setSearchStatus(props.status);
  };

  const changeAdminStatus = async (toStatus) => {
    const data = {
      _comment: 'active, inactive, suspend',
      ids: selected,
      status: toStatus,
    };
    const res = await updateMultiAdminsStatus(id, data);
    if (res.status === 1) {
      await fetchCreator();
      setSelected([]);
    }
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  // const emptyRows = rowsPerPage - rows.length;

  const fetchCreator = async () => {
    await getCreatorData(page, rowsPerPage, searchName, searchStatus).then(({ data }) => {
      const rowWithoutSuspendUser = data.items.filter((row) => row.status !== 'suspend');
      setRows(rowWithoutSuspendUser);
      setTotalCount(data.headers.x_total_count);
    });
  };

  useEffect(() => {
    fetchCreator();
  }, [getCreatorData, page, rowsPerPage, searchName, searchStatus]);

  return (
    <PageContainer title={t('Service Title')} description={t('Service Description')}>
      <Breadcrumb title={'Creator'} subtitle={'Creator Information'} />

      <Box>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            setFilters={setFilters}
            changeAdminStatus={changeAdminStatus}
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
                rowCount={rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      // onClick={(event) => handleClick(event, row.name)}
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
                          {row.full_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textSecondary" variant="h6">
                          {row.description.length > 20
                            ? `${row.description.slice(0, 20)}...`
                            : row.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textSecondary" variant="h6">
                          {row.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textSecondary" variant="h6">
                          <Box display="flex" alignItems="center">
                            <Switch
                              onClick={() => handleStatusOpen(row)}
                              checked={row.status === 'active'}
                              color="error"
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
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textSecondary" variant="h6">
                          {new Date(row.createdAt).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <IconButton onClick={() => handleUserDetailModal(row)}>
                            <AlbumOutlinedIcon />
                          </IconButton>
                          <IconButton onClick={() => handleUserUpdate(row)}>
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
                {/*      height: (dense ? 53 : 73) * emptyRows,*/}
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
      <AdminsDetailModal
        open={adminDetailModal}
        closeUserDetailModal={closeUserDetailModal}
        row={selectedAdmin}
      />
      <StatusDialog
        open={statusOpen}
        handleStatusClose={handleStatusClose}
        updateStatus={() =>
          updateStatus(selectedAdmin._id, selectedAdmin.status, selectedAdmin.solana_address)
        }
      />
    </PageContainer>
  );
};

export default Creator;
