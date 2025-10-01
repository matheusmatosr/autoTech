import { Box, Grid, Typography, Card, CardContent, CardHeader, List, ListItem, ListItemText, Divider, Chip, alpha } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import {
  People as PeopleIcon,
  DirectionsCar as CarIcon,
  Build as BuildIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

interface Cliente {
  id: string;
  nome: string;
}

interface Veiculo {
  id: string;
  marca: string;
  modelo: string;
  placa: string;
}

interface OrdemServico {
  id: string;
  veiculoId: string;
  dataEntrada: string;
  status: string;
  valorTotal: number;
}

const StatCard = ({ icon, title, value, subtitle, color }: { icon: React.ReactNode, title: string, value: string | number, subtitle: string, color: string }) => (
  <Card 
    sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255,255,255,0.1)',
        clipPath: 'circle(20% at 80% 20%)',
      }
    }}
  >
    <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ 
          bgcolor: 'rgba(255,255,255,0.2)', 
          borderRadius: 2, 
          p: 1,
          mr: 2 
        }}>
          {icon}
        </Box>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        {value}
      </Typography>
      <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 650 }}>
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [clientesRes, veiculosRes, ordensRes] = await Promise.all([
          api.get('/clientes'),
          api.get('/veiculos'),
          api.get('/ordens_servico')
        ]);
        
        setClientes(clientesRes.data);
        setVeiculos(veiculosRes.data);
        setOrdensServico(ordensRes.data);
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalClientes = clientes.length;
  const totalVeiculos = veiculos.length;
  const ordensEmAndamento = ordensServico.filter(ordem => ordem.status === 'Em andamento').length;
  const faturamentoTotal = ordensServico.reduce((acc, ordem) => acc + ordem.valorTotal, 0);

  const ordensRecentes = [...ordensServico]
    .sort((a, b) => new Date(b.dataEntrada).getTime() - new Date(a.dataEntrada).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento': return 'warning';
      case 'Concluído': return 'success';
      case 'Aguardando aprovação': return 'info';
      case 'Cancelado': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ width: 50, height: 50, border: '3px solid #1a237e', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', mx: 'auto', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Carregando dados...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visão geral do seu negócio
        </Typography>
      </Box>

      {/* Cards de estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PeopleIcon />}
            title="Clientes"
            value={totalClientes}
            subtitle="Total cadastrado"
            color="#3b82f6"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CarIcon />}
            title="Veículos"
            value={totalVeiculos}
            subtitle="Total cadastrado"
            color="#10b981"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<BuildIcon />}
            title="Ordens Ativas"
            value={ordensEmAndamento}
            subtitle="Em andamento"
            color="#f59e0b"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<MoneyIcon />}
            title="Faturamento"
            value={`R$ ${faturamentoTotal.toFixed(2)}`}
            subtitle="Total acumulado"
            color="#ef4444"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Ordens de serviço recentes */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Ordens de Serviço Recentes</Typography>
                </Box>
              }
              sx={{ 
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default'
              }}
            />
            <CardContent
              sx={{
                p: 0,
                maxHeight: 400,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#cbd5e1',
                  borderRadius: 3,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              {ordensRecentes.length > 0 ? (
                <List disablePadding>
                  {ordensRecentes.map((ordem, index) => {
                    const veiculo = veiculos.find(v => v.id === ordem.veiculoId);
                    return (
                      <Box key={ordem.id}>
                        <ListItem sx={{ py: 2, px: 3 }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  OS #{ordem.id}
                                </Typography>
                                <Chip 
                                  label={ordem.status} 
                                  size="small"
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  color={getStatusColor(ordem.status) as any}
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.primary">
                                  {veiculo ? `${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}` : 'Veículo não encontrado'}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Data: {new Date(ordem.dataEntrada).toLocaleDateString('pt-BR')}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                    Valor: R$ {ordem.valorTotal.toFixed(2)}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < ordensRecentes.length - 1 && <Divider />}
                      </Box>
                    );
                  })}
                </List>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Nenhuma ordem de serviço encontrada
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Clientes recentes */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Clientes Recentes</Typography>
                </Box>
              }
              sx={{ 
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default'
              }}
            />
            <CardContent
              sx={{
                p: 0,
                maxHeight: 400,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#cbd5e1',
                  borderRadius: 3,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              {clientes.length > 0 ? (
                <List disablePadding>
                  {clientes.slice(0, 6).map((cliente, index) => (
                    <Box key={cliente.id}>
                      <ListItem sx={{ py: 2, px: 3 }}>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight={600}>
                              {cliente.nome}
                            </Typography>
                          }
                          secondary={`ID: ${cliente.id}`}
                        />
                      </ListItem>
                      {index < Math.min(clientes.length - 1, 5) && <Divider />}
                    </Box>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Nenhum cliente encontrado
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default Dashboard;