import React, { useState } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DizimistaForm from './DizimistaForm'; // Importa o formulário de edição
import axios from 'axios';

const DizimistaList = ({ clients, deleteClient, setEditingClient, updateDizimista }) => {
  const [open, setOpen] = useState(false); // Estado para controlar o modal
  const [selectedClient, setSelectedClient] = useState(null); // Cliente selecionado para edição

  const handleEditClick = async (client) => {
    try {
      // Faz a requisição para obter o titular com dependentes
      const response = await axios.get(`http://localhost:8080/titular/${client.titular_id}`);
      console.log("Dados do titular com dependentes:", response.data); // Log para verificar a resposta
      setSelectedClient(response.data); // Define o cliente selecionado com dependentes
      setOpen(true); // Abre o modal
    } catch (error) {
      console.error("Erro ao buscar titular:", error);
    }
  };

  const handleClose = () => {
    setOpen(false); // Fecha o modal
    setSelectedClient(null); // Limpa o cliente selecionado
  };

  const handleUpdateClient = (updatedClient) => {
    updateDizimista(selectedClient.titular_id, updatedClient); // Atualiza o cliente
    handleClose(); // Fecha o modal após atualização
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Lista de Dizimista
      </Typography>
      {clients.length === 0 ? (
        <Typography variant="body1">Lista vazia</Typography>
      ) : (
        <List>
          {clients.map(client => (
            <ListItem key={client.titular_id}>
              <ListItemText
                primary={`Nome: ${client.name}`}
                secondary={`Email: ${client.email} | Telefone: ${client.telefone}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(client)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => deleteClient(client.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {/* Modal para edição */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Dizimista</DialogTitle>
        <DialogContent>
          {selectedClient && (
            <DizimistaForm
              addDizimista={() => {}} // Não usamos addDizimista neste caso
              editingDizimista={selectedClient}
              updateDizimista={handleUpdateClient}
              handleClose={handleClose}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DizimistaList;
