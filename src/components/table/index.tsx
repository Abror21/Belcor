import React, { useState } from 'react'
import { StyledTable } from './style'
import { Box, CircularProgress, IconButton, Paper, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography } from '@mui/material';
import UITable from '@mui/material/Table';
import { visuallyHidden } from '@mui/utils';
import { DynamicObject, HeadCell } from '../../pages/home';

type Order = 'asc' | 'desc';

interface TableProps {
    loading: boolean;
    pagination?: boolean;
    paginationPerPageOptions?: number[];
    data: DynamicObject[];
    headCells: HeadCell[];
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}
function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const Table = ({
    loading,
    pagination = false,
    paginationPerPageOptions = [10, 25, 50],
    data,
    headCells
}: TableProps) => {
    console.log('headCells: ', headCells);
    console.log('data: ', data);

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const visibleRows = [...data]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: any,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    //     const selectedIndex = selected.indexOf(id);
    //     let newSelected: readonly number[] = [];

    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selected, id);
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selected.slice(1));
    //     } else if (selectedIndex === selected.length - 1) {
    //         newSelected = newSelected.concat(selected.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(
    //             selected.slice(0, selectedIndex),
    //             selected.slice(selectedIndex + 1),
    //         );
    //     }
    //     setSelected(newSelected);
    // };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => {
        handleRequestSort(event, property);
    };
    console.log('visibleRows: ', visibleRows);


    return (
        <StyledTable>
            {
                visibleRows.length > 0 ?
                    <Paper sx={{ width: '100%', mb: 2, position: 'relative', }}>
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: 'green',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                        <TableContainer>
                            <UITable>
                                <TableHead>
                                    <TableRow>
                                        {headCells.map((headCell) => {
                                            console.log('headCell: ', headCell);
                                            if (!headCell.label) {
                                                // const el = headCell.render();
                                                return (
                                                    <TableCell
                                                        key={headCell.id}
                                                        padding='normal'
                                                    >

                                                    </TableCell>
                                                )
                                            } else {
                                                return (
                                                    <TableCell
                                                        key={headCell.id}
                                                        padding='normal'
                                                        sortDirection={orderBy === headCell.id ? order : false}
                                                    >
                                                        <TableSortLabel
                                                            active={orderBy === headCell.id}
                                                            direction={orderBy === headCell.id ? order : 'asc'}
                                                            onClick={createSortHandler(headCell.id)}
                                                        >
                                                            <b>{headCell.label}</b>
                                                            {orderBy === headCell.id ? (
                                                                <Box component="span" sx={visuallyHidden}>
                                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                                </Box>
                                                            ) : null}
                                                        </TableSortLabel>
                                                    </TableCell>
                                                )
                                            }
                                        }
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleRows.map((row, index) => {
                                        const newRows = headCells.map((cell, index) => {
                                            if (cell.render) {
                                                const element = cell.render(row);
                                                return (
                                                    <TableCell>
                                                        {element}
                                                    </TableCell>
                                                )
                                            } else {
                                                return (
                                                    <TableCell>
                                                        {row[cell.id]}
                                                    </TableCell>
                                                )
                                            }
                                        })

                                        return (
                                            <>
                                                <TableRow
                                                    hover
                                                    // onClick={(event) => handleClick(event, row.id)}
                                                    tabIndex={-1}
                                                    key={row.id}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    {/* <TableCell>
                                                        <IconButton
                                                            aria-label="expand row"
                                                            size="small"
                                                        // onClick={() => setOpen(!open)}
                                                        >
                                                            {true ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell> */}
                                                    {newRows}
                                                </TableRow>
                                                <TableRow>

                                                </TableRow>
                                            </>
                                        );
                                    })}
                                </TableBody>
                            </UITable>
                        </TableContainer>
                        {
                            pagination &&
                            <TablePagination
                                rowsPerPageOptions={paginationPerPageOptions}
                                component="div"
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        }
                    </Paper>
                    :
                    <Typography variant="body1" gutterBottom style={{ textAlign: 'center' }}>
                        No Data
                    </Typography>
            }
        </StyledTable>
    )
}

export default Table