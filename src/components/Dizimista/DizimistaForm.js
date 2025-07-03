import React, { useState, useEffect } from 'react';
import {
  TextField,
  Box,
  Button,
  MenuItem,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAuth } from '../../Auth/AuthContext';

const DizimistaForm = ({ addDizimista, editingDizimista, updateDizimista, handleClose }) => {
  const [dizimista, setDizimista] = useState({ name: '', numero_dizimista:'', email: '', telefone: '', cpf:'', data_nascimento:'', sexo:'', comunidade_id: '', dependentes: [] });
  const [comunidadeError, setComunidadeError] = useState(false);
  const [comunidades, setComunidades] = useState([]);
  const [dependentes, setDependentes] = useState([]);
  const [newDependente, setNewDependente] = useState({ name: '', sexo: '', tipo_dependente: '', titular_id: '', user_id: '' });
  const [prestacoes, setPrestacoes] = useState([]);
  const [newPayment, setNewPayment] = useState({ amount: '', description: '' });
  const [activeTab, setActiveTab] = useState(0);
  const { user_id } = useAuth();

  useEffect(() => {
    const fetchComunidades = async () => {
      const response = await axios.get('http://localhost:8080/comunidade');
      setComunidades(response.data);
    };

    const fetchPrestacoes = async (titular_id) => {
      try {
        const response = await axios.get(`http://localhost:8080/payments?titular_id=${titular_id}`);
        setPrestacoes(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setPrestacoes([]); // Sem dados, assume vazio
        } else {
          console.error('Erro ao buscar prestações:', error);
        }
      }
    };

    const fetchDependentes = async (titular_id) => {
      try {
        const response = await axios.get(`http://localhost:8080/dependente/${titular_id}`);
        setDependentes(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setDependentes([]); // Sem dependentes, tudo bem
        } else {
          console.error('Erro ao buscar dependentes:', error);
        }
      }
    };

    fetchComunidades();
    if (editingDizimista?.titular_id) {
      fetchDependentes(editingDizimista.titular_id);
      setDizimista(current => ({ ...current, ...editingDizimista, dependentes: editingDizimista.dependentes || [] }));
      setNewDependente(prev => ({ ...prev, titular_id: editingDizimista.titular_id, user_id }));
      fetchPrestacoes(editingDizimista.titular_id);
    }
  }, [editingDizimista, user_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDizimista({ ...dizimista, [name]: value });
  };

  const handleNewPaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPayment(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPayment = async () => {
    try {
      if (!editingDizimista?.titular_id) {
        alert("Erro: titular_id não encontrado.");
        return;
      }
      if (!user_id) {
        alert("Erro: user_id não encontrado.");
        return;
      }
  
      const payload = {
        amount: parseFloat(newPayment.amount),
        description: newPayment.description,
        titular_id: editingDizimista.titular_id,
        user_id: Number(user_id)
      };
  
      console.log("Enviando pagamento:", payload);
  
      const response = await axios.post('http://localhost:8080/payments', payload);
      setPrestacoes(prev => [...prev, response.data]);
      setNewPayment({ amount: '', description: '' });
    } catch (error) {
      console.error("Erro ao criar pagamento:", error.response?.data || error.message);
      alert("Erro ao criar pagamento: " + (error.response?.data?.message || "verifique os dados."));
    }
  };
  

  const handleMarkAsPaid = async (paymentId) => {
    const payload = {
      amount: 0,
      description: 'Pagamento efetuado',
      client_id: editingDizimista.titular_id,
      user_id
    };
    const response = await axios.put(`http://localhost:8080/payments/${paymentId}`, payload);
    setPrestacoes(prev => prev.map(p => p.id_payment === paymentId ? { ...p, payment_date: response.data.payment_date } : p));
  };

  const handleDependenteChange = (e) => {
    const { name, value } = e.target;
    setNewDependente(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDependente = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:8080/dependente', newDependente);
    setDizimista(prev => ({ ...prev, dependentes: [...prev.dependentes, response.data] }));
    setNewDependente({ name: '', sexo: '', tipo_dependente: '', titular_id: editingDizimista.titular_id, user_id });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dizimista.comunidade_id) {
      setComunidadeError(true);
      return;
    }
    setComunidadeError(false);
    const dizimistaComUserId = { ...dizimista, user_id };
    editingDizimista ? updateDizimista(editingDizimista.titular_id, dizimistaComUserId) : addDizimista(dizimistaComUserId);
    setDizimista({ name: '', numero_dizimista:'', email: '', telefone: '', cpf:'', data_nascimento:'', sexo:'', comunidade_id: '', dependentes: [] });
    handleClose();
  };

  const handleTabChange = (e, newValue) => setActiveTab(newValue);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, mb: 3, minHeight: '400px', minWidth: '500px' }}>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Dados do Dizimista" />
        <Tab label="Dependentes" />
        <Tab label="Prestações" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          <TextField label="Nome" name="name" value={dizimista.name} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Número do Dizimista" name="numero_dizimista" value={dizimista.numero_dizimista} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Email" name="email" type="email" value={dizimista.email} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Telefone" name="telefone" value={dizimista.telefone} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="CPF" name="cpf" value={dizimista.cpf} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Data Nascimento" name="data_nascimento" type="date" value={dizimista.data_nascimento} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth margin="normal" required />
          <TextField label="Sexo" name="sexo" value={dizimista.sexo} onChange={handleChange} fullWidth margin="normal" required />
          <TextField select label="Comunidade" name="comunidade_id" value={dizimista.comunidade_id} onChange={handleChange} fullWidth margin="normal" required error={comunidadeError} helperText={comunidadeError ? 'Por favor, selecione uma comunidade.' : ''}>
            {comunidades.map(c => <MenuItem key={c.comunidade_id} value={c.comunidade_id}>{c.nome}</MenuItem>)}
          </TextField>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={!dizimista.comunidade_id}>Salvar</Button>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6">Dependentes</Typography>
          {dependentes.length > 0 ? (
            <List>{dependentes.map(dep => (
              <ListItem key={dep.dependente_id}>
                <ListItemText primary={dep.name} secondary={`Sexo: ${dep.sexo}, Tipo: ${dep.tipo_dependente}`} />
              </ListItem>
            ))}</List>
          ) : <Typography>Nenhum dependente cadastrado.</Typography>}

          <Typography variant="h6" sx={{ mt: 3 }}>Adicionar Dependente</Typography>
          <Box component="form" onSubmit={handleAddDependente}>
            <TextField label="Nome do Dependente" name="name" value={newDependente.name} onChange={handleDependenteChange} fullWidth margin="normal" required />
            <TextField label="Sexo" name="sexo" value={newDependente.sexo} onChange={handleDependenteChange} fullWidth margin="normal" required />
            <TextField label="Tipo de Dependente" name="tipo_dependente" value={newDependente.tipo_dependente} onChange={handleDependenteChange} fullWidth margin="normal" required />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Adicionar Dependente</Button>
          </Box>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6">Prestações</Typography>

          <Box display="flex" gap={2} my={2}>
            <TextField label="Valor" name="amount" type="number" value={newPayment.amount} onChange={handleNewPaymentChange} required />
            <TextField label="Descrição" name="description" value={newPayment.description} onChange={handleNewPaymentChange} required />
            <Button variant="contained" onClick={handleAddPayment}>Criar Pagamento</Button>
          </Box>

          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Valor</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Data de Criação</TableCell>
                  <TableCell>Data de Vencimento</TableCell>
                  <TableCell>Data de Pagamento</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prestacoes.length > 0 ? prestacoes.map(p => (
                  <TableRow key={p.id_payment} style={{ backgroundColor: p.payment_date ? 'lightgreen' : 'inherit' }}>
                    <TableCell>R${p.amount.toFixed(2)}</TableCell>
                    <TableCell>{p.description}</TableCell>
                    <TableCell>{p.date_created}</TableCell>
                    <TableCell>{p.due_date || 'Não especificada'}</TableCell>
                    <TableCell>
                      {p.payment_date || (
                        <Button variant="outlined" color="success" size="small" onClick={() => handleMarkAsPaid(p.id_payment)}>
                          Marcar como Pago
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={5} align="center">Nenhuma prestação cadastrada.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

DizimistaForm.propTypes = {
  addDizimista: PropTypes.func.isRequired,
  editingDizimista: PropTypes.object,
  updateDizimista: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default DizimistaForm;