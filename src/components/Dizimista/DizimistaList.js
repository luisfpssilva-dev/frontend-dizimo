import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  IconButton,
  Box,
  Typography,
  TextField,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DizimistaList = ({ clients, deleteClient, setEditingClient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: 'name', headerName: 'Nome', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'telefone', headerName: 'Telefone', flex: 1 },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            aria-label="editar"
            size="small"
            onClick={() => setEditingClient(params.row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="deletar"
            size="small"
            onClick={() => deleteClient(params.row.titular_id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Lista de Dizimistas
      </Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Buscar por nome"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
      </Stack>

      {filteredClients.length === 0 ? (
        <Typography variant="body1">Nenhum dizimista encontrado</Typography>
      ) : (
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={filteredClients}
            columns={columns}
            getRowId={(row) => row.titular_id}
            pageSize={10}
            rowsPerPageOptions={[10, 25]}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default DizimistaList;
