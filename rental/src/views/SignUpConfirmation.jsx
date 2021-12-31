import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Button, TextField } from '@mui/material';
import { Auth } from 'aws-amplify';
import AlertDialog from '../components/AlertDialog';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  confirm: {
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

export default function SignUpConfirmation() {
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

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    // call register api
    try {
      await Auth.confirmSignUp(localStorage.getItem('username'), user.code);
      setLoading(false);
      navigate('/signin')
    } catch (errorResponse) {
      console.log('error signing in', errorResponse);
      setError({ input: errorResponse.message });
      setOpen(true);
      setLoading(false);
    }
  }

  return (
    <div className={classes.confirm}>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', p: 1, m: 1 }} onSubmit={handleConfirm}>
        <h4 className={classes.title}>Sign Up Confirmation</h4>
        <TextField
          required
          label="Confirmation Code"
          variant="outlined"
          margin="normal"
          name="code"
          value={user.code || ''}
          onChange={handleChange}
        />
        <Button variant="contained" className={classes.btn} type="submit" disabled={loading}>{loading ? 'Confirming...' : 'Confirm'}</Button>
      </Box>
      <AlertDialog open={open} onClose={handleClose} text={error.input}/>
    </div>
  )
}
