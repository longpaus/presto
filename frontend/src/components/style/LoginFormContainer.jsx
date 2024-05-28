import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const LoginFormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  border: '1px solid #ccc',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '8px',
  paddingTop: '20px',
  paddingBottom: '50px',

  [theme.breakpoints.down(550)]: {
    width: '350px', // Set a fixed width of 350px for screens smaller than 550px
  },
  [theme.breakpoints.up(550)]: {
    width: '500px', // Set a fixed width of 500px for screens >= 400px
  },
}));
export default LoginFormContainer;
