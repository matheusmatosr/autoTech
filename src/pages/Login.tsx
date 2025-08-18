import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Link,
  Grid,
  CssBaseline,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import axios from 'axios';
import Register from './Register';

const defaultTheme = createTheme();

interface LoginProps {
  onLogin: (userData: { nome: string, email: string }) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('admin@autotech.com');
  const [senha, setSenha] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Credenciais padrão
    if (email === 'admin@autotech.com' && senha === 'admin123') {
      setTimeout(() => {
        onLogin({
          nome: 'Administrador',
          email: 'admin@autotech.com'
        });
        navigate('/');
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
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
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            border: '1px solid gray',
            bgcolor: '#e1f0fc9d',
            borderRadius: '10px',
            padding: '30px'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
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
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Entrar'}
            </Button>
            <Grid container>
              <Grid item>
                <Link 
                  href="#" 
                  variant="body2" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenRegister();
                  }}
                >
                  Não tem uma conta? Cadastre-se
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Modal de Cadastro */}
        <Dialog open={openRegister} onClose={handleCloseRegister} maxWidth="sm" fullWidth>
          <DialogTitle>Cadastro de Novo Usuário</DialogTitle>
          <DialogContent>
            <Register onClose={handleCloseRegister} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRegister}>Fechar</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default Login;