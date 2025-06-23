import React from 'react';

const DizimistaForm = ({ client, deleteClient, setEditingClient }) => {
  return (
    <div>
      <h3>{client.nome}</h3>
      <p>Email: {client.email}</p>
      <p>Telefone: {client.telefone}</p>
      <button onClick={() => setEditingClient(client)}>Editar</button>
      <button onClick={() => deleteClient(client.id)}>Deletar</button>
    </div>
  );
};

export default DizimistaForm;
