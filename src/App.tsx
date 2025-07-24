import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
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

const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#0d47a1',
        dark: '#002171',
        light: '#5472d3',
        contrastText: '#ffffff'
      },
      secondary: {
        main: '#d32f2f',
        dark: '#9a0007',
        light: '#ff6659',
        contrastText: '#ffffff'
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff'
      },
      text: {
        primary: '#212121',
        secondary: '#757575'
      }
    },
  },
  ptBR
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ nome: string, email: string } | null>(null);

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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/clientes" element={isAuthenticated ? <Clientes /> : <Navigate to="/login" />} />
            <Route path="/veiculos" element={isAuthenticated ? <Veiculos /> : <Navigate to="/login" />} />
            <Route path="/servicos" element={isAuthenticated ? <Servicos /> : <Navigate to="/login" />} />
            <Route path="/pecas" element={isAuthenticated ? <Pecas /> : <Navigate to="/login" />} />
            <Route path="/ordens" element={isAuthenticated ? <OrdensServico /> : <Navigate to="/login" />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  )
}

export default App
