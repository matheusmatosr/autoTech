import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  InputAdornment,
  TableSortLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import 'dayjs/locale/pt-br';
import dayjs, { Dayjs } from 'dayjs';
import api from '../utils/api';

interface Orcamento {
  id: string;
  veiculoId: string;
  dataCriacao: string;
  dataValidade: string;
  status: string;
  descricao: string;
  observacoes: string;
  servicosIds: string[];
  pecasIds: string[];
  valorTotal: number;
}

interface Veiculo {
  id: string;
  clienteId: string;
  marca: string;
  modelo: string;
  placa: string;
  ano: number;
}

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  valor: number;
  tempoEstimado: string;
}

interface Peca {
  id: string;
  nome: string;
  codigo: string;
  marca: string;
  preco: number;
  quantidade: number;
}

interface OrcamentoFormData {
  veiculoId: string;
  dataValidade: Dayjs;
  status: string;
  descricao: string;
  observacoes: string;
  servicosIds: string[];
  pecasIds: string[];
  valorTotal: number;
}

const statusOptions = [
  'Pendente',
  'Aprovado',
  'Rejeitado',
  'Expirado'
];

const orcamentoVazio: OrcamentoFormData = {
  veiculoId: '',
  dataValidade: dayjs().add(7, 'day'),
  status: 'Pendente',
  descricao: '',
  observacoes: '',
  servicosIds: [],
  pecasIds: [],
  valorTotal: 0
};

const Orcamentos = () => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [orcamentosFiltered, setOrcamentosFiltered] = useState<Orcamento[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [formData, setFormData] = useState<OrcamentoFormData>(orcamentoVazio);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [orcamentoParaDeletar, setOrcamentoParaDeletar] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [ordenacao, setOrdenacao] = useState<{
    campo: keyof Orcamento | '';
    direcao: 'asc' | 'desc';
  }>({ campo: '', direcao: 'asc' });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const orcamentosRes = await api.get('/orcamentos');
      const orcamentosData = orcamentosRes.data;
      setOrcamentos(orcamentosData);
      setOrcamentosFiltered(orcamentosData);
      
      const veiculosRes = await api.get('/veiculos');
      setVeiculos(veiculosRes.data);
      
      const clientesRes = await api.get('/clientes');
      setClientes(clientesRes.data);
      
      const servicosRes = await api.get('/servicos');
      setServicos(servicosRes.data);
      
      const pecasRes = await api.get('/pecas');
      setPecas(pecasRes.data);
      
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar dados',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenForm = (orcamento?: Orcamento) => {
    if (orcamento) {
      setFormData({
        veiculoId: orcamento.veiculoId,
        dataValidade: dayjs(orcamento.dataValidade),
        status: orcamento.status,
        descricao: orcamento.descricao,
        observacoes: orcamento.observacoes,
        servicosIds: orcamento.servicosIds,
        pecasIds: orcamento.pecasIds,
        valorTotal: orcamento.valorTotal
      });
      setEditingId(orcamento.id);
    } else {
      setFormData(orcamentoVazio);
      setEditingId(null);
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setFormData(orcamentoVazio);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Dayjs | null) => {
    setFormData(prev => ({
      ...prev,
      dataValidade: date || dayjs().add(7, 'day')
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMultiSelectChange = (e: any, field: 'servicosIds' | 'pecasIds') => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calcular valor total baseado nos serviços e peças selecionados
  useEffect(() => {
    let total = 0;

    // Somar valor dos serviços
    formData.servicosIds.forEach(servicoId => {
      const servico = servicos.find(s => s.id === servicoId);
      if (servico) {
        total += servico.valor;
      }
    });

    // Somar valor das peças
    formData.pecasIds.forEach(pecaId => {
      const peca = pecas.find(p => p.id === pecaId);
      if (peca) {
        total += peca.preco;
      }
    });

    setFormData(prev => ({
      ...prev,
      valorTotal: total
    }));
  }, [formData.servicosIds, formData.pecasIds, servicos, pecas]);

  const handleSubmit = async () => {
    try {
      const orcamentoData = {
        ...formData,
        dataValidade: formData.dataValidade.toISOString()
      };

      if (editingId) {
        await api.put(`/orcamentos/${editingId}`, orcamentoData);
        setSnackbar({
          open: true,
          message: 'Orçamento atualizado com sucesso',
          severity: 'success'
        });
      } else {
        await api.post('/orcamentos', orcamentoData);
        setSnackbar({
          open: true,
          message: 'Orçamento adicionado com sucesso',
          severity: 'success'
        });
      }
      handleCloseForm();
      fetchData();
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao salvar orçamento',
        severity: 'error'
      });
    }
  };

  const handleOpenDelete = (id: string) => {
    setOrcamentoParaDeletar(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setOrcamentoParaDeletar(null);
  };

  const handleDelete = async () => {
    if (orcamentoParaDeletar) {
      try {
        await api.delete(`/orcamentos/${orcamentoParaDeletar}`);
        setSnackbar({
          open: true,
          message: 'Orçamento excluído com sucesso',
          severity: 'success'
        });
        fetchData();
      } catch (error) {
        console.error('Erro ao excluir orçamento:', error);
        setSnackbar({
          open: true,
          message: 'Erro ao excluir orçamento',
          severity: 'error'
        });
      }
      handleCloseDelete();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getVeiculoInfo = (veiculoId: string) => {
    const veiculo = veiculos.find(v => v.id === veiculoId);
    if (!veiculo) return 'Veículo não encontrado';
    return `${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})`;
  };

  const getClienteInfo = (veiculoId: string) => {
    const veiculo = veiculos.find(v => v.id === veiculoId);
    if (!veiculo) return 'Cliente não encontrado';

    const cliente = clientes.find(c => c.id === veiculo.clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'warning';
      case 'Aprovado':
        return 'success';
      case 'Rejeitado':
        return 'error';
      case 'Expirado':
        return 'default';
      default:
        return 'default';
    }
  };

  const handlePrintOrcamento = (orcamento: Orcamento) => {
    // Buscar informações relacionadas
    const veiculo = veiculos.find(v => v.id === orcamento.veiculoId);
    const cliente = veiculo ? clientes.find(c => c.id === veiculo.clienteId) : null;

    // Buscar serviços e peças
    const servicosSelecionados = servicos.filter(s => orcamento.servicosIds.includes(s.id));
    const pecasSelecionadas = pecas.filter(p => orcamento.pecasIds.includes(p.id));

    // Criar conteúdo para impressão
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setSnackbar({
        open: true,
        message: 'Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.',
        severity: 'error'
      });
      return;
    }

    // Estilo para a página de impressão
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Orçamento #${orcamento.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #0d47a1;
            padding-bottom: 10px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #0d47a1;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            background-color: #f5f5f5;
            padding: 5px;
          }
          .info-row {
            display: flex;
            margin-bottom: 5px;
          }
          .info-label {
            font-weight: bold;
            width: 150px;
          }
          .info-value {
            flex: 1;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
          }
          .total {
            text-align: right;
            font-weight: bold;
            font-size: 18px;
            margin-top: 20px;
            border-top: 2px solid #0d47a1;
            padding-top: 10px;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .signature {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
          }
          .signature-line {
            width: 200px;
            border-top: 1px solid #333;
            margin-top: 10px;
            text-align: center;
          }
          .observacoes {
            background-color: #f9f9f9;
            padding: 10px;
            border-radius: 5px;
            border-left: 4px solid #ff6f00;
          }
          .validade {
            background-color: #fff3e0;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            text-align: center;
            font-weight: bold;
          }
          @media print {
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">ORÇAMENTO #${orcamento.id}</div>
          <div>Oficina ReAuto</div>
        </div>
        
        <div class="validade">
          Válido até: ${new Date(orcamento.dataValidade).toLocaleDateString('pt-BR')}
        </div>
        
        <div class="section">
          <div class="section-title">Informações do Cliente</div>
          <div class="info-row">
            <div class="info-label">Nome:</div>
            <div class="info-value">${cliente ? cliente.nome : 'Cliente não encontrado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Telefone:</div>
            <div class="info-value">${cliente ? cliente.telefone : '-'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Email:</div>
            <div class="info-value">${cliente ? cliente.email : '-'}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Informações do Veículo</div>
          <div class="info-row">
            <div class="info-label">Marca/Modelo:</div>
            <div class="info-value">${veiculo ? `${veiculo.marca} ${veiculo.modelo}` : 'Veículo não encontrado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Placa:</div>
            <div class="info-value">${veiculo ? veiculo.placa : '-'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Ano:</div>
            <div class="info-value">${veiculo ? veiculo.ano : '-'}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Descrição do Serviço</div>
          <div class="info-value">${orcamento.descricao || 'Nenhuma descrição fornecida'}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Serviços Propostos</div>
          <table>
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Descrição</th>
                <th>Tempo Estimado</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${servicosSelecionados.length > 0 ?
                servicosSelecionados.map(servico => `
                  <tr>
                    <td>${servico.nome}</td>
                    <td>${servico.descricao}</td>
                    <td>${servico.tempoEstimado}</td>
                    <td>${formatarValor(servico.valor)}</td>
                  </tr>
                `).join('') :
                '<tr><td colspan="4" style="text-align: center">Nenhum serviço proposto</td></tr>'
              }
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <div class="section-title">Peças Necessárias</div>
          <table>
            <thead>
              <tr>
                <th>Peça</th>
                <th>Código</th>
                <th>Marca</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${pecasSelecionadas.length > 0 ?
                pecasSelecionadas.map(peca => `
                  <tr>
                    <td>${peca.nome}</td>
                    <td>${peca.codigo}</td>
                    <td>${peca.marca}</td>
                    <td>${formatarValor(peca.preco)}</td>
                  </tr>
                `).join('') :
                '<tr><td colspan="4" style="text-align: center">Nenhuma peça necessária</td></tr>'
              }
            </tbody>
          </table>
        </div>
        
        <div class="total">
          Valor Total: ${formatarValor(orcamento.valorTotal)}
        </div>
        
        ${orcamento.observacoes ? `
          <div class="section">
            <div class="section-title">Observações</div>
            <div class="observacoes">${orcamento.observacoes}</div>
          </div>
        ` : ''}
        
        <div class="signature">
          <div>
            <div class="signature-line">Assinatura do Cliente</div>
          </div>
          <div>
            <div class="signature-line">Assinatura do Responsável</div>
          </div>
        </div>
        
        <div class="footer">
          <p>Oficina ReAuto - Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          <p>Status: ${orcamento.status}</p>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; background-color: #0d47a1; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Imprimir
          </button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = function () {
      printWindow.focus();
    };
  };

  const handleFiltroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valorFiltro = event.target.value.toLowerCase();
    setFiltro(valorFiltro);
    aplicarFiltros(valorFiltro, filtroStatus);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFiltroStatusChange = (event: any) => {
    const status = event.target.value;
    setFiltroStatus(status);
    aplicarFiltros(filtro, status);
  };

  const aplicarFiltros = (textoFiltro: string, statusFiltro: string) => {
    let resultado = [...orcamentos];

    // Aplicar filtro de texto
    if (textoFiltro) {
      resultado = resultado.filter(orcamento => {
        const clienteNome = getClienteInfo(orcamento.veiculoId).toLowerCase();
        const veiculoInfo = getVeiculoInfo(orcamento.veiculoId).toLowerCase();
        const dataCriacao = new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR').toLowerCase();
        const dataValidade = new Date(orcamento.dataValidade).toLocaleDateString('pt-BR').toLowerCase();
        const valorFormatado = orcamento.valorTotal.toString().toLowerCase();

        return clienteNome.includes(textoFiltro) ||
          veiculoInfo.includes(textoFiltro) ||
          dataCriacao.includes(textoFiltro) ||
          dataValidade.includes(textoFiltro) ||
          valorFormatado.includes(textoFiltro) ||
          orcamento.status.toLowerCase().includes(textoFiltro);
      });
    }

    // Aplicar filtro de status
    if (statusFiltro) {
      resultado = resultado.filter(orcamento => orcamento.status === statusFiltro);
    }

    // Aplicar ordenação se existir
    if (ordenacao.campo !== '') {
      resultado = ordenarOrcamentos(resultado);
    }

    setOrcamentosFiltered(resultado);
  };

  const handleOrdenacaoChange = (campo: keyof Orcamento) => {
    const ehMesmoCampo = ordenacao.campo === campo;
    const novaDirecao = ehMesmoCampo && ordenacao.direcao === 'asc' ? 'desc' : 'asc';

    const novaOrdenacao: {
      campo: keyof Orcamento | '';
      direcao: 'asc' | 'desc';
    } = {
      campo,
      direcao: novaDirecao
    };

    setOrdenacao(novaOrdenacao);
    setOrcamentosFiltered(ordenarOrcamentos(orcamentosFiltered, campo, novaDirecao));
  };

  const ordenarOrcamentos = (orcamentos: Orcamento[], campo: keyof Orcamento | '' = ordenacao.campo, direcao: 'asc' | 'desc' = ordenacao.direcao) => {
    if (campo === '' || typeof campo !== 'string') return orcamentos;

    return [...orcamentos].sort((a, b) => {
      if (campo === 'valorTotal') {
        return direcao === 'asc' ? a.valorTotal - b.valorTotal : b.valorTotal - a.valorTotal;
      }

      if (campo === 'dataCriacao' || campo === 'dataValidade') {
        const dataA = new Date(a[campo]).getTime();
        const dataB = new Date(b[campo]).getTime();
        return direcao === 'asc' ? dataA - dataB : dataB - dataA;
      }

      if (campo === 'veiculoId') {
        const veiculoA = getVeiculoInfo(a.veiculoId).toLowerCase();
        const veiculoB = getVeiculoInfo(b.veiculoId).toLowerCase();
        return direcao === 'asc'
          ? veiculoA.localeCompare(veiculoB, 'pt-BR')
          : veiculoB.localeCompare(veiculoA, 'pt-BR');
      }

      const valorA = String(a[campo]).toLowerCase();
      const valorB = String(b[campo]).toLowerCase();

      return direcao === 'asc'
        ? valorA.localeCompare(valorB, 'pt-BR')
        : valorB.localeCompare(valorA, 'pt-BR');
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Orçamentos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Novo Orçamento
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar orçamentos por cliente, veículo, data, valor ou status"
              value={filtro}
              onChange={handleFiltroChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="filtro-status-label">Filtrar por Status</InputLabel>
              <Select
                labelId="filtro-status-label"
                value={filtroStatus}
                onChange={handleFiltroStatusChange}
                label="Filtrar por Status"
              >
                <MenuItem value="">Todos os Status</MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer 
          component={Paper} 
          elevation={3} 
          sx={{ 
            overflowX: 'auto', 
            maxHeight: 500,
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={ordenacao.campo === 'veiculoId'}
                    direction={ordenacao.campo === 'veiculoId' ? ordenacao.direcao : 'asc'}
                    onClick={() => handleOrdenacaoChange('veiculoId')}
                  >
                    Cliente
                  </TableSortLabel>
                </TableCell>
                <TableCell>Veículo</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={ordenacao.campo === 'dataCriacao'}
                    direction={ordenacao.campo === 'dataCriacao' ? ordenacao.direcao : 'asc'}
                    onClick={() => handleOrdenacaoChange('dataCriacao')}
                  >
                    Data Criação
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={ordenacao.campo === 'dataValidade'}
                    direction={ordenacao.campo === 'dataValidade' ? ordenacao.direcao : 'asc'}
                    onClick={() => handleOrdenacaoChange('dataValidade')}
                  >
                    Data Validade
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={ordenacao.campo === 'status'}
                    direction={ordenacao.campo === 'status' ? ordenacao.direcao : 'asc'}
                    onClick={() => handleOrdenacaoChange('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={ordenacao.campo === 'valorTotal'}
                    direction={ordenacao.campo === 'valorTotal' ? ordenacao.direcao : 'asc'}
                    onClick={() => handleOrdenacaoChange('valorTotal')}
                  >
                    Valor Total
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orcamentosFiltered.length > 0 ? (
                orcamentosFiltered.map((orcamento) => (
                  <TableRow key={orcamento.id}>
                    <TableCell>{orcamento.id}</TableCell>
                    <TableCell>{getClienteInfo(orcamento.veiculoId)}</TableCell>
                    <TableCell>{getVeiculoInfo(orcamento.veiculoId)}</TableCell>
                    <TableCell>{new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{new Date(orcamento.dataValidade).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Chip
                        label={orcamento.status}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        color={getStatusChipColor(orcamento.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatarValor(orcamento.valorTotal)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenForm(orcamento)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handlePrintOrcamento(orcamento)}
                        size="small"
                      >
                        <PrintIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDelete(orcamento.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Nenhum orçamento cadastrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Formulário de Orçamento */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Editar Orçamento' : 'Novo Orçamento'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="veiculo-label">Veículo</InputLabel>
                <Select
                  labelId="veiculo-label"
                  name="veiculoId"
                  value={formData.veiculoId}
                  onChange={handleSelectChange}
                  label="Veículo"
                >
                  {veiculos.map((veiculo) => (
                    <MenuItem key={veiculo.id} value={veiculo.id}>
                      {veiculo.marca} {veiculo.modelo} - {veiculo.placa} ({getClienteInfo(veiculo.id)})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                  label="Data de Validade"
                  value={formData.dataValidade}
                  onChange={handleDateChange}
                  slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="descricao"
                label="Descrição do Serviço"
                type="text"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={formData.descricao}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="servicos-label">Serviços</InputLabel>
                <Select
                  labelId="servicos-label"
                  multiple
                  value={formData.servicosIds}
                  onChange={(e) => handleMultiSelectChange(e, 'servicosIds')}
                  label="Serviços"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => {
                        const servico = servicos.find(s => s.id === value);
                        return (
                          <Chip key={value} label={servico ? servico.nome : value} size="small" />
                        );
                      })}
                    </Box>
                  )}
                >
                  {servicos.map((servico) => (
                    <MenuItem key={servico.id} value={servico.id}>
                      {servico.nome} - {formatarValor(servico.valor)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="pecas-label">Peças</InputLabel>
                <Select
                  labelId="pecas-label"
                  multiple
                  value={formData.pecasIds}
                  onChange={(e) => handleMultiSelectChange(e, 'pecasIds')}
                  label="Peças"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => {
                        const peca = pecas.find(p => p.id === value);
                        return (
                          <Chip key={value} label={peca ? peca.nome : value} size="small" />
                        );
                      })}
                    </Box>
                  )}
                >
                  {pecas.map((peca) => (
                    <MenuItem key={peca.id} value={peca.id}>
                      {peca.nome} - {formatarValor(peca.preco)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="observacoes"
                label="Observações"
                type="text"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={formData.observacoes}
                onChange={handleInputChange}
                placeholder="Observações adicionais para o cliente"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Valor Total: {formatarValor(formData.valorTotal)}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Orcamentos;
