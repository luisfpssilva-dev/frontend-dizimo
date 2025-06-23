import React, { useState } from 'react';
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import StoreIcon from '@mui/icons-material/Store';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../Auth/AuthContext';

function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      style={{ width: 250 }}
    >
      <List>
        <ListItem button component={Link} to="/dizimistas">
          <ListItemIcon><StoreIcon /></ListItemIcon>
          <ListItemText primary="Dizimistas" />
        </ListItem>
        <ListItem button component={Link} to="/users">
          <ListItemIcon><StoreIcon /></ListItemIcon>
          <ListItemText primary="Usuários" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={logout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  return (
    <div>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={toggleDrawer(true)}
        style={{ marginLeft: 20 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor='left'
        open={isOpen}
        onClose={toggleDrawer(false)}
      >
        {list()}
      </Drawer>
    </div>
  );
}

export default SidebarMenu;
