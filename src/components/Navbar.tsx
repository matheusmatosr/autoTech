import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Avatar, 
  useMediaQuery,
  useTheme,
  IconButton
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useState } from 'react';
import logo from '../assets/logoMenor.jpeg';

interface NavbarProps {
  user: { nome: string, email: string } | null;
  onLogout: () => void;
}

const navItems = [
  { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { text: 'Clientes', path: '/clientes', icon: <PeopleIcon /> },
  { text: 'Veículos', path: '/veiculos', icon: <DirectionsCarIcon /> },
  { text: 'Serviços', path: '/servicos', icon: <BuildIcon /> },
  { text: 'Peças', path: '/pecas', icon: <InventoryIcon /> },
  { text: 'Orçamentos', path: '/orcamentos', icon: <RequestQuoteIcon /> },
  { text: 'Ordem de serviço', path: '/ordens', icon: <AssignmentTurnedInIcon /> },
];

const drawerWidth = 240;

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    onLogout();
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #1a237e 0%, #303f9f 100%)',
      color: 'white'
    }}>
      {/* Logo */}
      <Box sx={{ 
        p: 2, 
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            width: '100%',
            height: 'auto',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 1.5,
            padding: '2px',
            backgroundColor: 'white'
          }}
        />
      </Box>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, p: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem 
              component={Link} 
              to={item.path} 
              key={item.text}
              sx={{ 
                color: 'inherit',
                textDecoration: 'none',
                borderRadius: 2,
                mb: 0.5,
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 400
                }}
              />
            </ListItem>
          );
        })}
      </List>

      {/* User Info and Logout */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'secondary.main', 
              width: 32, 
              height: 32,
              mr: 1,
              fontSize: '0.8rem'
            }}
          >
            {user?.nome.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap sx={{ fontSize: '0.8rem' }}>
              {user?.nome}
            </Typography>
            <Typography variant="caption" noWrap sx={{ 
              fontSize: '0.7rem',
              opacity: 0.8
            }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
        
        <ListItem 
          onClick={handleLogout}
          sx={{ 
            color: 'inherit',
            textDecoration: 'none',
            borderRadius: 2,
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Sair" 
            primaryTypographyProps={{
              fontSize: '0.9rem'
            }}
          />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Desktop Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Navbar;
