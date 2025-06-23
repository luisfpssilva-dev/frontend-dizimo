import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './Auth/AuthContext';
import App from './App';

const AppWrapper = () => {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
};

export default AppWrapper;
