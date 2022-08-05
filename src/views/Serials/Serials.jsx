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
  FormControlLabel,
  Typography,
  IconButton,
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
import { getSerialsData } from '../../services/serials.service';
import SerialsDetailModal from './SerialsDetailModal';
import splitAddress from '../../utils/splitAddress';

const Serials = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchStatus, setSearchStatus] = useState('');
  const [searchNftId, setSearchNftId] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedSerial, setSelectedSerial] = useState({});

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
    setSearchStatus(props.status);
    setSearchNftId(props.selectedNft);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const fetchSerials = async () => {
    await getSerialsData(page, rowsPerPage, searchStatus, searchNftId).then(({ data }) => {
      setRows(data.items);
      setTotalCount(data.headers.x_total_count);
    });
  };

  useEffect(() => {
    fetchSerials();
  }, [page, rowsPerPage, searchStatus, searchNftId]);

  return (
    <PageContainer title="Trace NFT" description="this is Trace NFT page">
      <Breadcrumb title="Trace NFT" subtitle="Trace NFT Information" />
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
                {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      // onClick={(event) => handleClick(event, row.no)}
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
                      <TableCell style={{ minWidth: 150 }}>
                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                          {row.nft_id?.metadata.name}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ minWidth: 170 }}>
                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                          {row.index}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ minWidth: 100 }}>
                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                          {row.owner_id ? splitAddress(row.owner_id) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ minWidth: 150 }}>
                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                          {parseInt(row.token_id, 16) ?? '-'}
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
                            variant="body1"
                            fontWeight="400"
                            sx={{
                              ml: 1,
                            }}
                          >
                            {row.status}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell style={{ minWidth: 200 }}>
                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                          {new Date(row.createdAt).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ minWidth: 200 }}>
                        <Typography color="textSecondary" variant="h6">
                          <Box>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedSerial(row);
                                setOpenDetailModal(true);
                              }}
                            >
                              <AlbumOutlinedIcon />
                            </IconButton>
                          </Box>
                        </Typography>
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
      <SerialsDetailModal
        open={openDetailModal}
        handleCloseDetailModal={handleCloseDetailModal}
        row={selectedSerial}
      />
    </PageContainer>
  );
};

export default Serials;
