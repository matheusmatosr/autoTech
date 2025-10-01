import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Grid,
  CssBaseline,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import Register from './Register';
import api from '../utils/api';
import logo from '../assets/logo.png'

const defaultTheme = createTheme();

interface LoginProps {
  onLogin: (userData: { nome: string, email: string }) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email,
        senha
      });

      if (response.data.success) {
        onLogin({
          nome: response.data.user.nome,
          email: response.data.user.email
        });
        navigate('/');
      } else {
        setError(response.data.message || 'Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error('Erro no login:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRegister = () => {
    setOpenRegister(true);
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            minHeight: '95vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }
          }}
        >
          <Paper
            elevation={8}
            sx={{
              padding: { xs: 4, sm: 6 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: 450,
              borderRadius: 3,
              background: '#ffffffff',
              border: '2px solid',
              borderColor: 'primary.main',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(45deg, #1a237e 30%, #ff6f00 90%)',
              }
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: 250,
                height: 90,
                mb: 1,
                objectFit: 'cover'
              }}
            />
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 4,
                textAlign: 'center',
                maxWidth: 300,
                fontSize: '1rem'
              }}
            >
              Sistema de Gestão Automotiva
            </Typography>
            
            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              noValidate 
              sx={{ 
                mt: 1,
                width: '100%'
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="senha"
                label="Senha"
                type="password"
                id="senha"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                variant="outlined"
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
              />
              
              {error && (
                <Typography 
                  color="error" 
                  variant="body2" 
                  sx={{ 
                    mt: 1,
                    p: 2,
                    bgcolor: 'error.light',
                    borderRadius: 2,
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: 'error.main'
                  }}
                >
                  {error}
                </Typography>
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #1a237e 30%, #303f9f 90%)',
                  boxShadow: '0 4px 15px 0 rgba(26, 35, 126, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px 0 rgba(26, 35, 126, 0.4)',
                    background: 'linear-gradient(45deg, #151c6e 30%, #2a38a0 90%)',
                  },
                  '&:disabled': {
                    background: '#e2e8f0',
                    color: '#64748b'
                  }
                }}
                disabled={loading}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ 
                      width: 20, 
                      height: 20, 
                      border: '2px solid #fff', 
                      borderTop: '2px solid transparent', 
                      borderRadius: '50%', 
                      animation: 'spin 1s linear infinite',
                      mr: 2 
                    }} />
                    Carregando...
                  </Box>
                ) : (
                  'Entrar'
                )}
              </Button>
              
              <Grid container justifyContent="center">
                <Grid item>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Não possui acesso ao sistema?
                    </Typography>
                    <Link 
                      href="#" 
                      variant="body2" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenRegister();
                      }}
                      sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        fontWeight: 600,
                        fontSize: '1rem',
                        '&:hover': {
                          color: 'primary.dark',
                          textDecoration: 'underline',
                        }
                      }}
                    >
                      Solicitar Cadastro
                    </Link>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>

        {/* Modal de Cadastro */}
        <Dialog 
          open={openRegister} 
          onClose={handleCloseRegister} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
              border: '2px solid',
              borderColor: 'primary.main'
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: 600,
              py: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LockOutlinedIcon sx={{ mr: 2 }} />
              Solicitação de Cadastro
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ p: 4 }}>
            <Register onClose={handleCloseRegister} />
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={handleCloseRegister}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                fontWeight: 600,
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  borderColor: 'primary.dark'
                }
              }}
            >
              Voltar para Login
            </Button>
          </DialogActions>
        </Dialog>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Container>
    </ThemeProvider>
  );
};

export default Login;