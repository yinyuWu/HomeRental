import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Button, TextField } from '@mui/material';
import { Auth } from 'aws-amplify';
import AlertDialog from '../components/AlertDialog';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  signin: {
    width: '50%',
    margin: '20vh auto'
  },
  title: {
    fontSize: '1.6rem'
  },
  btn: {
    backgroundColor: '#008489',
    color: '#fff',
    padding: '1rem',
    marginTop: '1rem',
    '&:hover': {
      backgroundColor: '#008489'
    }
  },
  mobileSignIn: {
    width: '80%',
    margin: '0 auto'
  }
})

export default function SignIn() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({})

  const handleClose = () => {
    setOpen(false);
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // call register api
    try {
      const response = await Auth.signIn(user.email, user.password);
      console.log(response);
      setLoading(false);
      localStorage.setItem('username', response.username);
      localStorage.setItem('email', response.attributes.email);
      navigate('/');
    } catch (errorResponse) {
      console.log('error signing in', errorResponse);
      setError({ input: errorResponse.message });
      setOpen(true);
      setLoading(false);
    }
  }

  return (
    <div className={classes.signin}>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', p: 1, m: 1 }} onSubmit={handleLogin}>
        <h4 className={classes.title}>Login</h4>
        <TextField
          required
          label="Email"
          variant="outlined"
          margin="normal"
          name="email"
          value={user.email || ''}
          onChange={handleChange}
        />
        <TextField
          required
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          name="password"
          value={user.password || ''}
          onChange={handleChange}
        />
        <Button variant="contained" className={classes.btn} type="submit" disabled={loading}>{loading ? 'Login...' : 'Login'}</Button>
      </Box>
      <AlertDialog open={open} onClose={handleClose} text={error.input}/>
    </div>
  )
}
