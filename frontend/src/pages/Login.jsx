import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Alert, CssBaseline, TextField, Typography } from '@mui/material';
import CenteredContainer from '../components/style/CenteredContainer';
import FormBox from '../components/style/FormBox';
import LoginFormContainer from '../components/style/LoginFormContainer';
import SubmitFormButton from '../components/style/SubmitFormButton';
import { apiCallPost } from '../utils/apiCalls';
import { Context, useContext } from '../context';

export default function Login () {
  const { getters, setters } = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate();

  if (getters.token !== null) {
    return <Navigate to='/dashboard' />
  }

  const submitHandler = (e) => {
    e.preventDefault();
    if (!password || !email) {
      setErrorMessage('Please fill in the fields');
      return;
    }

    const reqBody = { email, password }
    apiCallPost('/admin/auth/login', reqBody)
      .then(data => {
        setters.setToken(data.token);
        setters.setUserName(email);
        navigate('/dashboard')
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
          Log in
        </Typography>
        <FormBox component='form' noValidate>
          <TextField
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }} // Add margin to the bottom
          />
          <TextField
            required
            fullWidth
            type='password'
            id='password'
            label='Password'
            name='password'
            autoComplete='password'
            onChange={e => setPassword(e.target.value)}
          />
          <SubmitFormButton
            type='submit'
            fullWidth
            variant='contained'
            onClick={e => submitHandler(e)}
          >
            Log in
          </SubmitFormButton>
          {errorMessage !== '' &&
            <Alert variant='outlined' severity='error' sx={{ mt: 2, width: '100%' }}>
              {errorMessage}
            </Alert>}
        </FormBox>
        <Typography variant='body2' sx={{ mt: 2 }}>
          Don&apos;t have an account? <Link to='/register' style={{ fontWeight: 'bold' }}>Sign up</Link>
        </Typography>
      </LoginFormContainer>
    </CenteredContainer>
  );
}
