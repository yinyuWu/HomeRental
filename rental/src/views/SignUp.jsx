import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Joi from 'joi-browser';
import AlertDialog from '../components/AlertDialog';
import { Auth } from 'aws-amplify';

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

const schema = {
  name: Joi.string().required().label('Name'),
  email: Joi.string().email().required().label('email'),
  password: Joi.string().required().min(5).max(128).label('Password'),
  confirmPassword: Joi.string().required()
}

export default function SignUp() {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [error, setError] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateInput = (name, value) => {
    const inputSchema = { [name]: schema[name] };
    const input = { [name]: value };
    const joiErrorObj = Joi.validate(input, inputSchema);
    const joiError = joiErrorObj.error;
    if (!joiError) return null;
    return joiError.details[0].message;
  }

  const validate = () => {
    const options = { abortEarly: false };
    const joiErrorObj = Joi.validate(user, schema, options);
    const joiError = joiErrorObj.error;
    if (!joiError) return null;
    const errorMessages = {};
    joiError.details.forEach(e => {
      errorMessages[e.path[0]] = e.message
    });
    setError(errorMessages);
    return errorMessages;
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  }

  const handleBlur = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'confirmPassword') {
      const errors = { ...error };
      if (value !== user.password) errors.confirmPassword = 'Password does not match';
      else delete errors.confirmPassword;
      setError(errors);
      return;
    }
    const errors = { ...error };
    const errorMessage = validateInput(name, value);
    if (errorMessage) errors[name] = errorMessage;
    else delete errors[name];
    setError(errors);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    // validate form
    const errors = validate();
    let match = true;
    if (user.password !== user.confirmPassword) {
      match = false;
    }
    if (errors || !match) {
      console.log('fail to sign up');
      setLoading(false);
      return;
    }
    // call register api
    try {
      const response = await Auth.signUp({
        username: user.name,
        password: user.password,
        attributes: {
          email: user.email
        }
      });
      console.log(response);
      setLoading(false);
    } catch (errorResponse) {
      console.log('error signing up:', errorResponse.message);
      setOpen(true);
      setLoading(false);
      setError({ input: errorResponse.message });
    }
  }

  return (
    <div className={classes.signup}>
      <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', p: 1, m: 1 }}>
        <h4 className={classes.title}>AirBrb Register</h4>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', '& > :not(style)': { width: '45%' } }}>
          <TextField
            required
            label="Email"
            variant="outlined"
            margin="normal"
            name="email"
            value={user.email || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={error.email && error.email.length > 0}
            helperText={error.email}
          />
          <TextField
            required
            label="Name"
            variant="outlined"
            margin="normal"
            name="name"
            value={user.name || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={error.name && error.name.length > 0}
            helperText={error.name}
          />
        </Box>
        <TextField
          required
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          name="password"
          value={user.password || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={error.password && error.password.length > 0}
          helperText={error.password}
        />
        <TextField
          required
          label="Confirm Password"
          type="password"
          variant="outlined"
          margin="normal"
          name="confirmPassword"
          value={user.confirmPassword || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={error.confirmPassword && error.confirmPassword.length > 0}
          helperText={error.confirmPassword}
        />
        <Button variant="contained" className={classes.btn} type="submit" disabled={loading}>{ loading ? 'Registering' : 'Register'}</Button>
      </Box>
      <AlertDialog open={open} onClose={handleClose} text={error.input} />
    </div>
  )
}
