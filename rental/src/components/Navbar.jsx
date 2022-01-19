import React from 'react';
import { makeStyles } from '@mui/styles';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';

const useStyles = makeStyles({
  nav: {
    backgroundColor: '#fff',
    color: '#484848'
  },
  navbar: {
    justifyContent: 'space-between'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '3.33%',
    width: '100%',
    justifyContent: 'space-between'
  },
  listings: {
    display: 'flex',
  },
  outlinedLink: {
    color: '#FF5A5F',
    textDecoration: 'none',
    marginLeft: '1.5rem',
    border: '1px solid #FF5A5F',
    borderRadius: '4px',
    padding: '.5rem',
    '&:hover': {
      backgroundColor: '#FF5A5F',
      color: '#fff'
    }
  },
  filledLink: {
    backgroundColor: '#FF5A5F',
    color: '#fff',
    textDecoration: 'none',
    marginLeft: '1.5rem',
    borderRadius: '4px',
    padding: '.5rem'
  },
  navlink: {
    display: 'block',
    fontSize: '1.1rem',
    color: '#484848',
    margin: '0 1.8rem',
    textDecoration: 'none',
    '&::after': {
      content: '""',
      position: 'relative',
      bottom: '-.25rem',
      borderTop: '2px solid #484848',
      display: 'block',
      margin: '0 auto',
      transition: 'all 200ms ease-in-out',
      width: '0',
    },
    '&:hover::after': {
      width: '100%'
    }
  },
  navbarMenuBtn: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  mobileFilledBtn: {
    backgroundColor: '#FF5A5F',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    padding: '.5rem',
    width: '100%',
    textAlign: 'center'
  },
  mobileOutlinedBtn: {
    color: '#FF5A5F',
    textDecoration: 'none',
    border: '1px solid #FF5A5F',
    borderRadius: '4px',
    padding: '.5rem',
    width: '100%',
    textAlign: 'center',
    '&:hover': {
      backgroundColor: '#FF5A5F',
      color: '#fff'
    }
  }
});

export default function Navbar(props) {
  const classes = useStyles();

  const handleLogout = async () => {
    // console.log('logout...');
    try {
      await Auth.signOut({ global: true });
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      window.location = '/';
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (
    <AppBar>
      <Toolbar className={classes.nav}>
        <Typography variant='h6' component='div' sx={{ color: '#FF5A5F', fontSize: '1.8rem', fontWeight: 700 }}>
          AirRent
        </Typography>
        {props.user
          ? <div className={classes.links}>
            <div className={classes.listings}>
              <Link to="/" className={classes.navlink}>All Listings</Link>
              <Link to="/my-listings" className={classes.navlink}>My Listings</Link>
            </div>
            <Button className={classes.outlinedLink} variant="outlined" onClick={handleLogout}>Logout</Button>
          </div>
          : <div className={classes.links}>
            <Link to="/" className={classes.navlink}>All Listings</Link>
            <div>
              <Link to="/signup" className={classes.outlinedLink}>Register</Link>
              <Link to="/signin" className={classes.filledLink}>Login</Link>
            </div>
          </div>}
      </Toolbar>
    </AppBar>
  )
}
