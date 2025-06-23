import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const UserList = ({ users, deleteUser, setEditingUser }) => {
  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Lista de Usuários
      </Typography>
      {users.length === 0 ? (
        <Typography variant="body1">Lista vazia</Typography>
      ) : (
        <List>
          {users.map(user => (
            <ListItem key={user.id}>
              <ListItemText
                primary={user.nome}
                secondary={`Usuário: ${user.username} | Email: ${user.email} | Telefone: ${user.telefone}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(user)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => deleteUser(user.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default UserList;
