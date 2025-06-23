import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Home from './pages/Home';
import Dizimistas from './pages/Dizimistas';
import Login from './pages/Login';
import { useAuth } from './Auth/AuthContext';
import SidebarMenu from './components/menu/Menu';
import ProtectedRoute from './Auth/ProtectedRoute';

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <AppBar position="static" style={{ margin: 0 }}>
        <Toolbar>
          {user && <SidebarMenu />}
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Dizimo
          </Typography>
          {!user && <Button color="inherit" component={Link} to="/login">Login</Button>}
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dizimistas" 
            element={
              <ProtectedRoute element={<Dizimistas />} />
            }
          />
        </Routes>
      </Container>
    </>
  );
};

export default App;
