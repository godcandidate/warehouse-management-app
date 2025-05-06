import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography, useTheme } from '@mui/material';
import warehouseImage from '../assets/images/warehouse-background.jpg';

const AuthLayout: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        backgroundImage: `url(${warehouseImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
          >
            Warehouse Management System
          </Typography>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
