import { Box, Collapse, TableCell, Typography, TableRow } from '@mui/material'
import React, { useState } from 'react'
import { DynamicObject, HeadCell } from '../../../pages/home';

interface TableRowProps {
  row: DynamicObject;
  headCells: HeadCell[];
}

const CustomTableRow = ({ row, headCells }: TableRowProps) => {

  const [collapse, setCollapse] = useState(false);

  const newRow = headCells.map((cell, index) => {
    const handleCollapse = () => setCollapse(prev => !prev);

    if (cell.render) {
        const element = cell.render(row, handleCollapse);
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
        {newRow}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={collapse} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="body1" component="div">
                {headCells[0]?.info ? row[headCells[0].info] : 'No data'}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default CustomTableRow