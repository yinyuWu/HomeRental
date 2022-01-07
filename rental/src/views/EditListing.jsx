import React from 'react';
import { useState } from 'react';
import { makeStyles, styled } from '@mui/styles';
import { Box, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';

const useStyles = makeStyles({
  edit: {
    marginTop: '15vh'
  },
  editTitle: {
    alignSelf: 'center',
    fontSize: '2rem'
  },
  formGroupTitle: {
    margin: '2rem 0 0 0',
    '&:first-child': {
      margin: 0
    }
  },
  uploadBtn: {
    margin: '1rem 0 2.5rem 0',
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
  amenities: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  propertyImages: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  image: {
    width: '30%',
    height: 'auto',
    margin: '1rem 1rem 1rem 0'
  }
})

const Input = styled('input')({
  display: 'none'
})

export default function EditListing() {
  const classes = useStyles();
  const [listing, setListing] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setListing({ ...listing, [name]: value });
  }

  const handleBedsChange = (e) => {
    const id = parseInt(e.target.name.split('-')[1]);
    const value = e.target.value;
    const list = listing.bedrooms;
    list[id].numOfBeds = value;
    setListing({ ...listing, bedrooms: list });
  }

  return (
    <div className={classes.edit}>
      <Box component="form" sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 1,
        m: 1
      }}>
        <h2 className={classes.editTitle}>Edit My Property</h2>
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
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          '& > :not(style)': {
            width: '45%'
          }
        }}>
          <TextField
            required
            label="City"
            variant="outlined"
            margin="normal"
            name="city"
            value={listing.city || ''}
            onChange={handleChange}
          />
          <TextField
            required
            label="State"
            variant="outlined"
            margin="normal"
            name="state"
            value={listing.state || ''}
            onChange={handleChange}
          />
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          '& > :not(style)': {
            width: '45%'
          }
        }}>
          <TextField
            required
            label="Postcode"
            variant="outlined"
            margin="normal"
            name="postcode"
            value={listing.postcode || ''}
            onChange={handleChange}
          />
          <TextField
            required
            label="Country"
            variant="outlined"
            margin="normal"
            name="country"
            value={listing.country || ''}
            onChange={handleChange}
          />
        </Box>
        <h4 className={classes.formGroupTitle}>Property Info</h4>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          '& > :not(style)': {
            width: '45%'
          }
        }}>
          <FormControl variant="outlined" margin="normal">
            <InputLabel id="bathrooms-label">Bathrooms</InputLabel>
            <Select
              labelId="bathrooms-label"
              id="bathrooms-select"
              name="bathrooms"
              value={listing.bathrooms || ''}
              label="Bathrooms"
              onChange={handleChange}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" margin="normal">
            <InputLabel id="type-label">Property Type</InputLabel>
            <Select
              labelId="type-label"
              id="type-select"
              name="type"
              value={listing.type || ''}
              label="Property Type"
              onChange={handleChange}
            >
              <MenuItem value={1}>Apartment</MenuItem>
              <MenuItem value={2}>House</MenuItem>
              <MenuItem value={3}>Loft</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TextField
          required
          label="Price per night"
          variant="outlined"
          margin="normal"
          name="price"
          value={listing.price || ''}
          onChange={handleChange}
        />
        {listing.bedrooms && listing.bedrooms.map(bedroom => {
          return (<FormControl variant="outlined" margin="normal" key={bedroom.id}>
            <InputLabel id={`bedroom-${bedroom.id}`}>{`Bedroom ${bedroom.id + 1}`}</InputLabel>
            <Select
              labelId={`bedroom-${bedroom.id}`}
              id={`bedroom-${bedroom.id}-select`}
              value={bedroom.numOfBeds}
              name={`bedroom-${bedroom.id}`}
              label={`Bedroom ${bedroom.id + 1}`}
              onChange={handleBedsChange}
            >
              <MenuItem value={1}>1 bed</MenuItem>
              <MenuItem value={2}>2 beds</MenuItem>
              <MenuItem value={3}>3 beds</MenuItem>
              <MenuItem value={4}>4 beds</MenuItem>
            </Select>
          </FormControl>)
        })}
      </Box>
    </div>
  )
}
