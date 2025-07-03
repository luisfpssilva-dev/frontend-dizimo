// DizimistaGrid.js
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box } from '@mui/material';

const DizimistaGrid = ({ clients, deleteClient, setEditingClient }) => {
  const columns = [
    { field: 'name', headerName: 'Nome', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'telefone', headerName: 'Telefone', flex: 1 },
    {
      field: 'acoes',
      headerName: 'Ações',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setEditingClient(params.row)}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => deleteClient(params.row.titular_id)}
          >
            Deletar
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={clients}
        columns={columns}
        getRowId={(row) => row.titular_id}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f0f0f0',
            fontWeight: 'bold',
          },
        }}
      />
    </Box>
  );
};

export default DizimistaGrid;
