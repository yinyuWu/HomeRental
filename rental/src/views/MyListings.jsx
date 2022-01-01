import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';

const useStyles = makeStyles({
  container: {
    position: 'relative',
    width: '80%',
    margin: '20vh auto'
  },
  createBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#008489',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#008489'
    }
  },
  list: {
    marginTop: '2rem'
  },
  formGroupTitle: {
    margin: '2rem 0 0 0',
    '&:first-child': {
      margin: 0
    }
  },
  uploadBtn: {
    marginBottom: '2.5rem',
    width: '100%'
  },
  formSubmitBtn: {
    backgroundColor: '#008489',
    color: '#fff',
    width: '30%',
    alignSelf: 'flex-end',
    marginTop: '1rem',
    '&:hover': {
      backgroundColor: '#008489'
    }
  },
  image: {
    maxWidth: '100%',
    height: '8rem'
  },
  amenities: {
    display: 'flex',
    justifyContent: 'space-between'
  }
});

function CreateDialog(props) {
  const { open, onClose } = props;
  const classes = useStyles();
  const [listing, setListing] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setListing({ ...listing, [name]: value });
  }

  const handleCreate = () => {
    console.log('create a listing');
  }

  return  (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>Create a New Listing</DialogTitle>
      <DialogContent dividers>
        <Box component="form" onSubmit={handleCreate} sx={{ display: 'flex', flexDirection: 'column', p: 1, m: 1 }}>
          <h4 className={classes.formGroupTitle}>Listing Title</h4>
          <TextField
            required
            label="Listing Title"
            variant="outlined"
            margin="normal"
            name="title"
            value={listing.title || ''}
            onChange={handleChange}
          />
           <h4 className={classes.formGroupTitle}>Address</h4>
           <TextField
            required
            label="Street"
            variant="outlined"
            margin="normal"
            name="street"
            value={listing.street || ''}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default function MyListings() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <div className={classes.container}>
      <h3>My Listings</h3>
      <Button className={classes.createBtn} onClick={() => setOpen(true)}>Create a New Listing</Button>
      <CreateDialog open={open} onClose={ () => setOpen(false) } />
    </div>
  )
}
