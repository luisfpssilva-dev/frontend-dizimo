import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import UserList from '../components/User/UserList';
import UserForm from '../components/User/UserForm';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:8080/users');
    setUsers(response.data);
  };

  const adduser = async (user) => {
    const response = await axios.post('http://localhost:8080/users', user);
    setUsers([...users, response.data]);
    handleClose();
  };

  const updateUser = async (id, updatedUser) => {
    const response = await axios.put(`http://localhost:8080/users/${id}`, updatedUser);
    setUsers(users.map(user => user.id === id ? response.data : user));
    setEditingUser(null);
    handleClose();
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:8080/users/${id}`);
    setUsers(users.filter(user => user.id !== id));
  };

  const handleClickOpen = () => {
    setEditingUser(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Usuários
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Usuário
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingUser ? 'Editar' : 'Add User'}</DialogTitle>
        <DialogContent>
          <UserForm
            adduser={adduser}
            editinguser={editingUser}
            updateuser={updateUser}
            handleClose={handleClose}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <UserList
        users={users}
        deleteuser={deleteUser}
        setEditinguser={setEditingUser}
      />
    </Container>
  );
};

export default Users;
