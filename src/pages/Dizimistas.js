import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ClientList from '../components/Dizimista/DizimistaList';
import DizimistaForm from '../components/Dizimista/DizimistaForm';

const Dizimistas = () => {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchClients();
    
  }, []);
  useEffect(() => {
    if (editingClient) {
      setOpen(true);
    }
  }, [editingClient]);
  
  const fetchClients = async () => {
    const response = await axios.get('http://localhost:8080/titular');
    setClients(response.data);
  };

  const addClient = async (client) => {
    const response = await axios.post('http://localhost:8080/titular', client);
    setClients([...clients, response.data]);
    handleClose();
  };

  const updateClient = async (titular_id, updatedClient) => {
    console.log("updatedClient",updatedClient)
    const response = await axios.put(`http://localhost:8080/titular/${titular_id}`, updatedClient);
    setClients(clients.map(client => client.titular_id === titular_id ? response.data : client));
    setEditingClient(null);
    handleClose();
  };

  const deleteClient = async (titular_id) => {
    await axios.delete(`http://localhost:8080/titular/${titular_id}`);
    setClients(clients.filter(client => client.titular_id !== titular_id));
  };

  const handleClickOpen = () => {
    setEditingClient(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Dizimistas
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Dizimista
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingClient ? 'Editar' : 'Add Dizimista'}</DialogTitle>
        <DialogContent>
        <DizimistaForm
        addDizimista={addClient}
        editingDizimista={editingClient}
        updateDizimista={updateClient}
        handleClose={handleClose}
      />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <ClientList
        clients={clients}
        deleteClient={deleteClient}
        setEditingClient={setEditingClient}
      />
    </Container>
  );
};

export default Dizimistas;
