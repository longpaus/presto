import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Alert, CssBaseline, TextField, Typography } from '@mui/material'
import CenteredContainer from '../components/style/CenteredContainer';
import FormBox from '../components/style/FormBox';
import LoginFormContainer from '../components/style/LoginFormContainer';
import SubmitFormButton from '../components/style/SubmitFormButton';
import { apiCallPost } from '../utils/apiCalls';
import { Context, useContext } from '../context';

function Register () {
  const { getters, setters } = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('');

  const navigate = useNavigate();

  if (getters.token !== null) {
    return <Navigate to='/dashboard' />
  }

  const submitHandler = (e) => {
    e.preventDefault();
    if (!name || !password || !confirmPassword || !email) {
      setErrorMessage('Please fill in the fields');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('password and confirm password do not match')
      return;
    }

    const reqBody = { email, password, name }
    apiCallPost('/admin/auth/register', reqBody)
      .then(data => {
        setters.setToken(data.token);
        navigate('/dashboard');
      })
      .catch(error => {
        setErrorMessage(error);
      })
  }
  return (
    <CenteredContainer>
      <CssBaseline />
      <LoginFormContainer>
        <Typography component='h1' variant='h6' fontWeight='bold'>
          Sign Up
        </Typography>
        <FormBox component='form' noValidate>
        <TextField
            required
            fullWidth
            id='name'
            label='Name'
            name='Name'
            autoComplete='Name'
            autoFocus
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }} // Add margin to the bottom
          />
          <TextField
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }} // Add margin to the bottom
          />
          <TextField
            required
            fullWidth
            id='password'
            label='Password'
            name='password'
            autoComplete='password'
            onChange={e => setPassword(e.target.value)}
            sx={{ mb: 2 }} // Add margin to the bottom
          />
            <TextField
            required
            fullWidth
            id='confirmPassword'
            label='Confirm password'
            name='confirmPassword'
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <SubmitFormButton
            type='submit'
            fullWidth
            variant='contained'
            onClick={e => submitHandler(e)}
          >
            Create Account
          </SubmitFormButton>
          {errorMessage !== '' &&
            <Alert variant='outlined' severity='error' sx={{ mt: 2, width: '100%' }}>
              {errorMessage}
            </Alert>
          }
        </FormBox>
        <Typography variant='body2' sx={{ mt: 2 }}>
          Already have an account? <Link to='/login' style={{ fontWeight: 'bold' }}>Log in</Link>
        </Typography>
      </LoginFormContainer>
    </CenteredContainer>
  );
}

export default Register;
