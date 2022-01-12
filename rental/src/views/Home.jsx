import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, TextField } from '@mui/material';
import { useState } from 'react';

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
  const [search, setSearch] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSearch({ ...search, [name]: value });
  }

  return (
    <div className={classes.home}>
      <Box className={classes.filter} component="form">
        <div className={classes.filterTop}>
          <TextField name="text" value={search.text || ''} onChange={handleChange} label="Search" variant="outlined" />
        </div>
      </Box>
    </div>
  )
}
