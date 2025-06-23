// DizimistaItem.js

import React from 'react';

const DizimistaItem = ({ client, deleteClient, setEditingClient }) => {
  return (
    <div>
      <h3>{client.name}</h3>
      <p>Email: {client.email}</p>
      <p>Telefone: {client.telefone}</p>
      <button onClick={() => setEditingClient(client)}>Editar</button>
      <button onClick={() => deleteClient(client.titular_id)}>Deletar</button>
    </div>
  );
};

export default DizimistaItem;
