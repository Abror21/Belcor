import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const IconElement = () => {

  const [open, setOpen] = useState(false);

  return (
    <IconButton
      aria-label="expand row"
      size="small"
      onClick={() => setOpen(!open)}
    >
      {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
    </IconButton>
  )
}

export default IconElement