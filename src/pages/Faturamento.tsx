import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, AttachMoney, Build, Inventory } from '@mui/icons-material';
import api from '../utils/api';

interface FaturamentoMensal {
  ano: number;
  mes: number;
  totalOrdens: number;
  totalServicos: number;
  totalMaoDeObra: number;
  totalPecas: number;
}

interface ResumoFaturamento {
  mesAtual: {
    total: number;
    maoDeObra: number;
    pecas: number;
    quantidadeOrdens: number;
  };
  mesAnterior: {
    total: number;
    maoDeObra: number;
    pecas: number;
    quantidadeOrdens: number;
  };
  variacao: number;
}

interface OrdemFaturamento {
  id: string;
  veiculoId: string;
  dataEntrada: string;
  status: string;
  valorTotal: number;
  maoDeObra: number;
  mecanico: string;
}

const Faturamento = () => {
  const [dadosMensais, setDadosMensais] = useState<FaturamentoMensal[]>([]);
  const [resumo, setResumo] = useState<ResumoFaturamento | null>(null);
  const [ordensMes, setOrdensMes] = useState<OrdemFaturamento[]>([]);
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const fetchDadosFaturamento = useCallback(async () => {
    try {
      setLoading(true);
      
      const [comparativoRes, resumoRes, mensalRes] = await Promise.all([
        api.get(`/faturamento/comparativo-mensal?ano=${anoSelecionado}`),
        api.get(`/faturamento/resumo-mensal?ano=${anoSelecionado}&mes=${mesSelecionado}`),
        api.get(`/faturamento/mensal?ano=${anoSelecionado}&mes=${mesSelecionado}`)
      ]);

      setDadosMensais(comparativoRes.data);
      setResumo(resumoRes.data);
      setOrdensMes(mensalRes.data.ordens || []);
    } catch (error) {
      console.error('Erro ao carregar dados de faturamento:', error);
    } finally {
      setLoading(false);
    }
  }, [anoSelecionado, mesSelecionado]);   

  useEffect(() => {
    fetchDadosFaturamento();
  }, [fetchDadosFaturamento]);

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído':
      case 'Entregue':
        return 'success';
      case 'Em andamento':
        return 'warning';
      case 'Aguardando aprovação':
        return 'info';
      case 'Cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  // Dados para gráfico de barras
  const dadosGraficoBarras = dadosMensais.map(item => ({
    mes: meses[item.mes - 1],
    Serviços: item.totalServicos,
    'Mão de Obra': item.totalMaoDeObra,
    Peças: item.totalPecas
  }));

  // Dados para gráfico de pizza do mês atual
  const dadosGraficoPizza = resumo ? [
    { name: 'Mão de Obra', value: resumo.mesAtual.maoDeObra },
    { name: 'Peças', value: resumo.mesAtual.pecas }
  ] : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Carregando dados de faturamento...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 1 }}>
          Faturamento
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Análise detalhada do faturamento da oficina
        </Typography>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Ano</InputLabel>
                <Select
                  value={anoSelecionado}
                  label="Ano"
                  onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                >
                  {[2023, 2024, 2025].map(ano => (
                    <MenuItem key={ano} value={ano}>{ano}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Mês</InputLabel>
                <Select
                  value={mesSelecionado}
                  label="Mês"
                  onChange={(e) => setMesSelecionado(Number(e.target.value))}
                >
                  {meses.map((mes, index) => (
                    <MenuItem key={index} value={index + 1}>{mes}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Cards de Resumo */}
      {resumo && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: `linear-gradient(135deg, #1976d2 0%, #1565c0 100%)`,
                color: 'white'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney sx={{ mr: 1 }} />
                  <Typography variant="h6">Faturamento Total</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#f8f9fa' }}>
                  {formatarValor(resumo.mesAtual.total)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {resumo.variacao >= 0 ? (
                    <TrendingUp sx={{ mr: 0.5 }} />
                  ) : (
                    <TrendingDown sx={{ mr: 0.5 }} />
                  )}
                  <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                    {resumo.variacao >= 0 ? '+' : ''}{resumo.variacao.toFixed(1)}% vs mês anterior
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
                color: 'white'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Build sx={{ mr: 1 }} />
                  <Typography variant="h6">Mão de Obra</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {formatarValor(resumo.mesAtual.maoDeObra)}
                </Typography>
                <Typography variant="body2">
                  {((resumo.mesAtual.maoDeObra / resumo.mesAtual.total) * 100).toFixed(1)}% do total
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${alpha(theme.palette.success.main, 0.8)} 100%)`,
                color: 'white'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Inventory sx={{ mr: 1 }} />
                  <Typography variant="h6">Peças</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {formatarValor(resumo.mesAtual.pecas)}
                </Typography>
                <Typography variant="body2">
                  {((resumo.mesAtual.pecas / resumo.mesAtual.total) * 100).toFixed(1)}% do total
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${alpha(theme.palette.info.main, 0.8)} 100%)`,
                color: 'white'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ mr: 1 }} />
                  <Typography variant="h6">Ordens</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {resumo.mesAtual.quantidadeOrdens}
                </Typography>
                <Typography variant="body2">
                  {resumo.mesAnterior.quantidadeOrdens} no mês anterior
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Comparativo Mensal - {anoSelecionado}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosGraficoBarras}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatarValor(Number(value))} />
                  <Legend />
                  <Bar dataKey="Serviços" fill={theme.palette.primary.main} />
                  <Bar dataKey="Mão de Obra" fill={theme.palette.secondary.main} />
                  <Bar dataKey="Peças" fill={theme.palette.success.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Composição do Faturamento - {meses[mesSelecionado - 1]}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dadosGraficoPizza}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name }) => name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dadosGraficoPizza.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatarValor(Number(value))}
                    labelFormatter={(name) => `Categoria: ${name}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
    </Grid>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ordens de Serviço - {meses[mesSelecionado - 1]} de {anoSelecionado}
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Data Entrada</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Mecânico</TableCell>
                  <TableCell align="right">Mão de Obra</TableCell>
                  <TableCell align="right">Valor Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordensMes.map((ordem) => (
                  <TableRow key={ordem.id}>
                    <TableCell>#{ordem.id}</TableCell>
                    <TableCell>
                      {new Date(ordem.dataEntrada).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={ordem.status} 
                        size="small"
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        color={getStatusColor(ordem.status) as any}
                      />
                    </TableCell>
                    <TableCell>{ordem.mecanico || 'Não informado'}</TableCell>
                    <TableCell align="right">{formatarValor(ordem.maoDeObra)}</TableCell>
                    <TableCell align="right">{formatarValor(ordem.valorTotal)}</TableCell>
                  </TableRow>
                ))}
                {ordensMes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhuma ordem de serviço encontrada para este período
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Faturamento;
