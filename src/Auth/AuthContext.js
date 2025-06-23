import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Cria o contexto
const AuthContext = createContext();

// Cria um hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [user_id, setUserId] = useState(null);
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/login', { username, password });
      const token = response.data.token;
      const user_id = response.data.user_id;
      setToken(token);
      setUserId(user_id);
      setUser({ username });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username }));
      localStorage.setItem('user_id', user_id );
      navigate('/clients'); // Redireciona para a página de clientes após o login
    } catch (error) {
      console.error('Failed to login', error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    navigate('/login'); // Redireciona para a página de login após o logout
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('user_id');

    if (storedUser && storedToken && storedUserId) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setUserId(storedUserId);
    }
  }, []);

  return (
<AuthContext.Provider value={{ user, login, logout, token, user_id }}>      {children}
    </AuthContext.Provider>
  );
};
