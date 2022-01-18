import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, InputAdornment, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Button, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchRounded } from '@mui/icons-material';
import { DateRangePicker, LocalizationProvider } from '@mui/lab';
import DateFnsAdapter from '@mui/lab/AdapterDateFns';
import ListingItem from '../components/ListingItem';
import { API, graphqlOperation } from 'aws-amplify';
import { listListings } from '../graphql/queries';

const useStyles = makeStyles({
  home: {
    width: '70%',
    margin: '2rem auto'
  },
  itemList: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '6rem'
  },
  filter: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '5rem'
  },
  filterSearchBox: {
    width: '50%'
  },
  mobileFilterSearchBox: {
    width: '100%',
    marginBottom: '1rem'
  },
  filterInput: {
    width: '45%',
    '&:first-child': {
      marginRight: '.3rem'
    }
  },
  filterTop: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  mobileFilterTop: {
    display: 'flex',
    flexDirection: 'column'
  },
  filterBottom: {
    marginTop: '1rem',
    display: 'flex'
  },
  mobileFilterBottom: {
    display: 'flex',
    flexDirection: 'column'
  },
  filterBtns: {
    width: '50%',
    margin: '1.5rem auto',
    display: 'flex',
    justifyContent: 'space-between'
  },
  searchBtn: {
    width: '30%',
    color: '#008489',
    border: '1px solid #008489'
  },
  resetBtn: {
    width: '30%',
    backgroundColor: '#008489',
    '&:hover': {
      backgroundColor: '#008489'
    }
  }
});

export default function Home() {
  const classes = useStyles();
  const mobile = useMediaQuery('(max-width: 800px)');
  const navigate = useNavigate();
  const [search, setSearch] = useState({});
  const [value, setValue] = useState([null, null]);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSearch({ ...search, [name]: value });
  }

  const handleReset = () => {
    setFilteredListings(listings);
    setSearch({});
  }

  const getAllListings = () => {
    try {
      const listingData = API.graphql(graphqlOperation(listListings));
      const listings = listingData.data.listListings.items;
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={classes.home}>
      <Box className={classes.filter} component="form">
        <div className={classes.filterTop}>
          <TextField name="text" value={search.text || ''} onChange={handleChange} label="Search" variant="outlined" inputProps={{
            startadornment: (
              <InputAdornment position="start">
                <SearchRounded />
              </InputAdornment>
            )
          }} className={classes.filterSearchBox} />
          <LocalizationProvider dateAdapter={DateFnsAdapter}>
            <DateRangePicker
              startText="Check-in"
              endText="Check-out"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField {...startProps} />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField {...endProps} />
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
        </div>
        <div className={classes.filterBottom}>
          <Box mr={2}>
            <Typography>Bedrooms</Typography>
            <div>
              <TextField label="min" margin="dense" name="minBeds" value={search.minBeds || ''} onChange={handleChange} className={classes.filterInput} />
              <TextField label="max" margin="dense" name="maxBeds" value={search.maxBeds || ''} onChange={handleChange} className={classes.filterInput} />
            </div>
          </Box>
          <Box mr={2}>
            <Typography>Price</Typography>
            <div>
              <TextField label="min" margin="dense" name="minPrice" value={search.minPrice || ''} onChange={handleChange} className={classes.filterInput} />
              <TextField label="max" margin="dense" name="maxPrice" value={search.maxPrice || ''} onChange={handleChange} className={classes.filterInput} />
            </div>
          </Box>
          <Box sx={{ width: '20%' }}>
            <Typography>Rating</Typography>
            <FormControl fullWidth margin="dense">
              <InputLabel id="rating-select-label">Rating</InputLabel>
              <Select labelId="rating-select-label" id="rating-select" name="rating" value={search.rating || ''} onChange={handleChange} margin="dense" label="Rating" fullWidth>
                <MenuItem value={1}>1 star</MenuItem>
                <MenuItem value={2}>2 star</MenuItem>
                <MenuItem value={3}>3 star</MenuItem>
                <MenuItem value={4}>4 star</MenuItem>
                <MenuItem value={5}>5 star</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className={classes.filterBtns}>
          <Button variant="contained" className={classes.resetBtn} onClick={handleReset}>Reset</Button>
          <Button className={classes.searchBtn} type="submit">Search</Button>
        </div>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', mt: 5, columnGap: 2, rowGap: 3 }}>
        {filteredListings.map(listing => {
          return (<Box sx={{ justifySelf: mobile && 'center', width: mobile ? '300px' : 'auto' }} gridColumn={mobile ? 'span 3' : 'span 1'} key={listing.id} onClick={() => navigate(`/listings/${listing.id}`)}><ListingItem listing={listing} /></Box>)
        })}
      </Box>
    </div>
  )
}
