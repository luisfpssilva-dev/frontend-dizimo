import React, { useState, useEffect } from 'react';
import { TextField, Box, Button, MenuItem, Tabs, Tab, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, List, ListItem, ListItemText } from '@mui/material';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAuth } from '../../Auth/AuthContext';

const DizimistaForm = ({ addDizimista, editingDizimista, updateDizimista, handleClose }) => {
  const [dizimista, setDizimista] = useState({ 
    name: '', email: '', telefone: '', cpf:'', data_nascimento:'', sexo:'', numero_dizimista:'', comunidade_id: '', dependentes: []
  });
  const [comunidadeError, setComunidadeError] = useState(false);
  const [comunidades, setComunidades] = useState([]);
  const [newDependente, setNewDependente] = useState({ name: '', sexo: '', tipo_dependente: '', titular_id: '', user_id: '' });
  const [prestacoes, setPrestacoes] = useState([]); // Estado para as prestações
  const [activeTab, setActiveTab] = useState(0);
  const { user_id } = useAuth();

  useEffect(() => {
    const fetchComunidades = async () => {
      try {
        const response = await axios.get('http://localhost:8080/comunidade');
        setComunidades(response.data);
      } catch (error) {
        console.error('Erro ao buscar comunidades:', error);
      }
    };

    const fetchPrestacoes = async (titular_id) => {
      try {
        const response = await axios.get(`http://localhost:8080/payments?titular_id=${titular_id}`);
        setPrestacoes(response.data);
      } catch (error) {
        console.error('Erro ao buscar prestações:', error);
      }
    };

    fetchComunidades();
    if (editingDizimista) {
      setDizimista(editingDizimista);
      setNewDependente((prev) => ({ ...prev, titular_id: editingDizimista.titular_id, user_id }));
      fetchPrestacoes(editingDizimista.titular_id); // Busca prestações do titular
    }
  }, [editingDizimista, user_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDizimista({ ...dizimista, [name]: value });
  };

  const handleDependenteChange = (e) => {
    const { name, value } = e.target;
    setNewDependente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validar comunidade
    if (!dizimista.comunidade_id || dizimista.comunidade_id === '') {
      setComunidadeError(true);
      return; // NÃO envia
    } else {
      setComunidadeError(false);
    }
  
    const dizimistaComUserId = { ...dizimista, user_id };
  
    if (editingDizimista) {
      updateDizimista(editingDizimista.titular_id, dizimistaComUserId);
    } else {
      addDizimista(dizimistaComUserId);
    }
  
    // Só limpa e fecha se a comunidade estiver válida
    setDizimista({ name: '', email: '', telefone: '', cpf:'', data_nascimento:'', sexo:'', numero_dizimista:'', comunidade_id: '', dependentes: [] });
    handleClose();
  };

  const handleAddDependente = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/dependente', newDependente);
      setDizimista((prev) => ({
        ...prev,
        dependentes: [...prev.dependentes, response.data]
      }));
      setNewDependente({ name: '', sexo: '', tipo_dependente: '', titular_id: editingDizimista.titular_id, user_id });
    } catch (error) {
      console.error('Erro ao adicionar dependente:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ mt: 3, mb: 3, minHeight: '400px', minWidth: '500px' }}
    >
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Dados do Dizimista" />
        <Tab label="Dependentes" />
        <Tab label="Prestações" />
      </Tabs>

      <Box sx={{ minHeight: '300px' }}> 
        {activeTab === 0 && (
          <Box>
            <TextField
              label="Nome"
              name="name"
              value={dizimista.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={dizimista.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Telefone"
              name="telefone"
              value={dizimista.telefone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="CPF"
              name="cpf"
              value={dizimista.cpf}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Data Nascimento"
              name="data_nascimento"
              value={dizimista.data_nascimento}
              onChange={handleChange}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Sexo"
              name="sexo"
              value={dizimista.sexo}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
                select
                label="Comunidade"
                name="comunidade_id"
                value={dizimista.comunidade_id}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={comunidadeError}
                helperText={comunidadeError ? "Por favor, selecione uma comunidade." : ""}
            >
              {comunidades.map((comunidade) => (
                <MenuItem key={comunidade.comunidade_id} value={comunidade.comunidade_id}>
                  {comunidade.nome}
                </MenuItem>
              ))}
            </TextField>
            <Button 
  type="submit" 
  variant="contained" 
  color="primary" 
  sx={{ mt: 2 }} 
  // AQUI ESTÁ A MÁGICA
  disabled={!dizimista.comunidade_id}
>
  {editingDizimista ? 'Salvar' : 'Salvar'}
</Button>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>Dependentes</Typography>
            {dizimista.dependentes && dizimista.dependentes.length > 0 ? (
              // eslint-disable-next-line react/jsx-no-undef
              <List>
                {dizimista.dependentes.map((dependente) => (
                  // eslint-disable-next-line react/jsx-no-undef
                  <ListItem key={dependente.dependente_id}>
                    <ListItemText
                      primary={dependente.name}
                      secondary={`Sexo: ${dependente.sexo}, Tipo: ${dependente.tipo_dependente}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1">Nenhum dependente cadastrado.</Typography>
            )}

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Adicionar Dependente</Typography>
            <Box component="form" onSubmit={handleAddDependente}>
              <TextField
                label="Nome do Dependente"
                name="name"
                value={newDependente.name}
                onChange={handleDependenteChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Sexo"
                name="sexo"
                value={newDependente.sexo}
                onChange={handleDependenteChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Tipo de Dependente"
                name="tipo_dependente"
                value={newDependente.tipo_dependente}
                onChange={handleDependenteChange}
                fullWidth
                margin="normal"
                required
              />
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Adicionar Dependente
              </Button>
            </Box>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
          <Typography variant="h6" gutterBottom>Prestações</Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ backgroundColor: '#ccc9c0' }}>Valor</TableCell>
                  <TableCell style={{ backgroundColor: '#ccc9c0' }}>Descrição</TableCell>
                  <TableCell style={{ backgroundColor: '#ccc9c0' }}>Data de Criação</TableCell>
                  <TableCell style={{ backgroundColor: '#ccc9c0' }}>Data de Vencimento</TableCell>
                  <TableCell style={{ backgroundColor: '#ccc9c0' }}>Data de Pagamento</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prestacoes && prestacoes.length > 0 ? (
                  prestacoes.map((prestacao) => (
                    <TableRow key={prestacao.id_payment} style={{ backgroundColor: prestacao.payment_date ? 'lightgreen' : 'none' }}>
                      <TableCell>R${prestacao.amount.toFixed(2)}</TableCell>
                      <TableCell>{prestacao.description}</TableCell>
                      <TableCell>{prestacao.date_created}</TableCell>
                      <TableCell>{prestacao.due_date || 'Não especificada'}</TableCell>
                      <TableCell>{prestacao.payment_date || 'Não paga'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Nenhuma prestação cadastrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        )}
      </Box>
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
