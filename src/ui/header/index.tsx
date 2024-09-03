import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { StyledHeader } from './style';

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleAuthenticate = () => {
        localStorage.clear();
        navigate('/login');
    }

    return (
        <StyledHeader>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Belcor
                        </Typography>
                        <Button color="inherit" onClick={handleAuthenticate}>
                            { token && 'Logout' }
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>
        </StyledHeader>
    )
}

export default Header