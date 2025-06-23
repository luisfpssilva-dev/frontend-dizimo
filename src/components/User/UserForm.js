import React, { useState, useEffect } from 'react';
import { TextField, Box, Button } from '@mui/material';

const UserForm = ({ addUser, editingUser, updateUser, handleClose }) => {
  const [user, setuser] = useState({ name: '', email: '', telefone: '', username: '' });

  useEffect(() => {
    if (editingUser) {
      setuser(editingUser);
    } else {
      setuser({ name: '', email: '', telefone: '', username: ''  });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, user);
    } else {
      addUser(user);
    }
    setuser({ name: '', email: '', telefone: '', username: ''  });
    handleClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, mb: 3 }}>
      <TextField
        label="Nome"
        name="nome"
        value={user.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Usuário"
        name="nome"
        value={user.username}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={user.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Telefone"
        name="telefone"
        value={user.telefone}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {editingUser ? 'Update' : 'Salvar'}
      </Button>
    </Box>
  );
};

export default UserForm;
