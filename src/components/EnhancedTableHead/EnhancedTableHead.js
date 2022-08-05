import { useTranslation } from 'react-i18next';
import { Box, TableCell, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material';
import CustomCheckbox from '../forms/custom-elements/CustomCheckbox';

import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React from 'react';

export default function EnhancedTableHead(props) {
  const { t } = useTranslation();
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {onSelectAllClick !== undefined && (
          <TableCell padding="checkbox">
            <CustomCheckbox
              color="primary"
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputprops={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
        )}

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <Typography variant="subtitle1" fontWeight="500">
                {/*{t`${headCell.label}`}*/}
                {t(`${headCell.label}`)}
              </Typography>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
