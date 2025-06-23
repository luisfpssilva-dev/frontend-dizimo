import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DizimistaList = ({ clients, deleteClient, setEditingClient }) => {
  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Lista de Dizimistas
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
                <IconButton edge="end" aria-label="edit" onClick={() => setEditingClient(client)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => deleteClient(client.titular_id)}>
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

export default DizimistaList;
