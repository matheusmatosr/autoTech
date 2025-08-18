import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';

interface RegisterProps {
  onClose: () => void;
  onRegisterSuccess?: () => void;
}

const Register = ({ onClose, onRegisterSuccess }: RegisterProps) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('cliente');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/auth/register', {
        nome,
        email,
        telefone,
        senha,
        tipoUsuario
      });

      if (response.data.success) {
        if (onRegisterSuccess) onRegisterSuccess();
        if (onClose) onClose();
      } else {
        setError(response.data.message || 'Erro no cadastro');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error('Erro no cadastro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            autoComplete="name"
            name="nome"
            required
            fullWidth
            id="nome"
            label="Nome Completo"
            autoFocus
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="telefone"
            label="Telefone"
            type="tel"
            id="telefone"
            autoComplete="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="senha"
            label="Senha"
            type="password"
            id="senha"
            autoComplete="new-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="confirmarSenha"
            label="Confirmar Senha"
            type="password"
            id="confirmarSenha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="tipo-usuario-label">Tipo de Usuário</InputLabel>
            <Select
              labelId="tipo-usuario-label"
              id="tipoUsuario"
              value={tipoUsuario}
              label="Tipo de Usuário"
              onChange={(e) => setTipoUsuario(e.target.value)}
            >
              <MenuItem value="cliente">Cliente</MenuItem>
              <MenuItem value="mecanico">Mecânico</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
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
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </Button>
    </Box>
  );
};

export default Register;