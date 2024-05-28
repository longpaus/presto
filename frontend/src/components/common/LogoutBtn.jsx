import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { apiCallPost } from '../../utils/apiCalls';
import { Context, useContext } from '../../context';

export default function LogoutBtn () {
  const { getters, setters } = useContext(Context);
  const navigate = useNavigate();

  const logout = () => {
    apiCallPost('/admin/auth/logout', {}, getters.token)
      .then(() => {
        setters.setToken(null);
        navigate('/login')
      })
      .catch(error => {
        console.log(error);
      })
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={logout}
    >
      Logout
    </Button>
  );
}
