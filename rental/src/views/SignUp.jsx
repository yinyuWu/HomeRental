import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  signup: {
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
  mobileSignUp: {
    width: '80%',
    margin: '0 auto'
  }
})

export default function SignUp() {
  const classes = useStyles();

  return (
    <div className={classes.signup}>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', p: 1, m: 1 }}>
        <h4 className={classes.title}>AirBrb Register</h4>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', '& > :not(style)': { width: '45%' } }}>
          <TextField
            required
            label="Email"
            variant="outlined"
            margin="normal"
            name="email"
          />
          <TextField
            required
            label="Name"
            variant="outlined"
            margin="normal"
            name="name"
          />
        </Box>
        <TextField
          required
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          name="password"
        />
        <TextField
          required
          label="Confirm Password"
          type="password"
          variant="outlined"
          margin="normal"
          name="confirmPassword"
        />
        <Button variant="contained" className={classes.btn}>Register</Button>
      </Box>
    </div>
  )
}
