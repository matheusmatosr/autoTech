import { AppBar, Box, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme, Avatar, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import logo from '../assets/logoMenor.jpeg'

interface NavbarProps {
  user: { nome: string, email: string } | null;
  onLogout: () => void;
}

const navItems = [
  { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { text: 'Clientes', path: '/clientes', icon: <PeopleIcon /> },
  { text: 'Veículos', path: '/veiculos', icon: <DirectionsCarIcon /> },
  { text: 'Serviços', path: '/servicos', icon: <BuildIcon /> },
  { text: 'Peças', path: '/pecas', icon: <BuildIcon /> },
  { text: 'OS', path: '/ordens', icon: <AssignmentIcon /> },
];

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {navItems.map((item) => (
          <ListItem 
            component={Link} 
            to={item.path} 
            key={item.text}
            sx={{ 
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              cursor: 'pointer'
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem 
          onClick={handleLogout}
          sx={{ 
            color: 'inherit',
            textDecoration: 'none',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
            cursor: 'pointer'
          }}
        >
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: 150,
              height: 65,
              border: '1px solid blue', 
              borderRadius: 1.5,            
              padding: '2px',
              ml: 10             
            }}
          />
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              {navItems.map((item) => (
                <Button 
                  key={item.text} 
                  component={Link} 
                  to={item.path} 
                  sx={{ 
                    color: '#ffffff',
                    mx: 1,
                    fontWeight: 600,
                    padding: '8px 16px',
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 0 5px rgba(255, 255, 255, 0.3)'
                    } 
                  }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
              <IconButton
                onClick={handleMenuOpen}
                sx={{ p: 0, ml: 2 }}
              >
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {user?.nome.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="subtitle1">{user?.nome}</Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="body2">{user?.email}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Sair
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>

      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Navbar;