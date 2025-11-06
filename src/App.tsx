import { ThemeProvider, createTheme, CssBaseline, useMediaQuery } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { ptBR } from '@mui/material/locale';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Veiculos from './pages/Veiculos';
import Servicos from './pages/Servicos';
import Pecas from './pages/Pecas';
import OrdensServico from './pages/OrdensServico';
import Login from './pages/Login';
import { useState } from 'react';
import './App.css'
import Orcamentos from './pages/Orcamentos';
import Faturamento from './pages/Faturamento';

const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#1a237e',
        dark: '#000051',
        light: '#534bae',
        contrastText: '#ffffff'
      },
      secondary: {
        main: '#ff6f00',
        dark: '#c43e00',
        light: '#ffa040',
        contrastText: '#000000'
      },
      background: {
        default: '#f8fafc',
        paper: '#ffffff'
      },
      text: {
        primary: '#1e293b',
        secondary: '#64748b'
      },
      success: {
        main: '#10b981',
        contrastText: '#ffffff'
      },
      warning: {
        main: '#f59e0b',
        contrastText: '#ffffff'
      },
      error: {
        main: '#ef4444',
        contrastText: '#ffffff'
      },
      info: {
        main: '#3b82f6',
        contrastText: '#ffffff'
      }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
        fontSize: '2rem',
        background: 'linear-gradient(45deg, #1a237e 30%, #ff6f00 90%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
      h6: {
        fontWeight: 600,
      }
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px 0 rgba(0,0,0,0.15)',
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            padding: '8px 16px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
            }
          },
          containedPrimary: {
            background: 'linear-gradient(45deg, #1a237e 30%, #303f9f 90%)',
            boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .2)',
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          elevation3: {
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1) !important',
          }
        }
      }
    }
  },
  ptBR
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ nome: string, email: string } | null>(null);
  // const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogin = (userData: { nome: string, email: string }) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
        <Container 
          maxWidth="xl" 
          sx={{ 
            mt: isAuthenticated ? 4 : 0, 
            mb: 4, 
            px: { xs: 2, sm: 3 },
            ml: isAuthenticated && !isMobile ? `240px` : 0,
            width: isAuthenticated && !isMobile ? `calc(100% - 240px)` : '100%',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/clientes" element={isAuthenticated ? <Clientes /> : <Navigate to="/login" />} />
            <Route path="/veiculos" element={isAuthenticated ? <Veiculos /> : <Navigate to="/login" />} />
            <Route path="/servicos" element={isAuthenticated ? <Servicos /> : <Navigate to="/login" />} />
            <Route path="/pecas" element={isAuthenticated ? <Pecas /> : <Navigate to="/login" />} />
            <Route path="/ordens" element={isAuthenticated ? <OrdensServico /> : <Navigate to="/login" />} />
            <Route path="/orcamentos" element={isAuthenticated ? <Orcamentos /> : <Navigate to="/login" />} />
            <Route path="/faturamento" element={isAuthenticated ? <Faturamento /> : <Navigate to="/login" />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  )
}

export default App