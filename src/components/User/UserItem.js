import React from 'react';

const UserForm = ({ user, deleteUser, setEditingUser }) => {
  return (
    <div>
      <h3>{user.nome}</h3>
      <p>Usuário: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Telefone: {user.telefone}</p>
      <button onClick={() => setEditingUser(user)}>Editar</button>
      <button onClick={() => deleteUser(user.id)}>Deletar</button>
    </div>
  );
};

export default UserForm;
