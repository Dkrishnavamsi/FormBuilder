import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Tabs, Tab } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Build, Preview, List } from '@mui/icons-material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentTab = () => {
    switch (location.pathname) {
      case '/create':
        return 0;
      case '/preview':
        return 1;
      case '/myforms':
        return 2;
      default:
        return 0;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    const routes = ['/create', '/preview', '/myforms'];
    navigate(routes[newValue]);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Build sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Form Builder
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth={false} sx={{ px: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
          <Tabs value={getCurrentTab()} onChange={handleTabChange} sx={{ px: 3 }}>
            <Tab icon={<Build />} label="Create" />
            <Tab icon={<Preview />} label="Preview" />
            <Tab icon={<List />} label="My Forms" />
          </Tabs>
        </Box>
        
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default Layout;