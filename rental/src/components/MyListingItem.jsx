import React from 'react';
import { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Button, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Rating, TextField, Typography } from '@mui/material';
import { Close, Star } from '@mui/icons-material';
import { LocalizationProvider, DateRangePicker } from '@mui/lab';
import DateFnsAdapter from '@mui/lab/AdapterDateFns';
import { Link } from 'react-router-dom';
import placeholder from '../images/placeholder.png';
import { API, graphqlOperation } from 'aws-amplify';
import { updateListing } from '../graphql/mutations';
import { getListing } from '../graphql/queries';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    position: 'relative',
    margin: '1rem 0',
    height: '225px',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
    }
  },
  mobileCard: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    margin: '1rem 0',
    height: '355px',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
    }
  },
  cardImage: {
    width: '30%',
    height: '100%'
  },
  mobileCardImage: {
    width: '100%',
    height: '120px'
  },
  cardContent: {
    position: 'relative'
  },
  type: {
    fontSize: '.8rem',
    marginBottom: '.5rem'
  },
  btns: {
    position: 'absolute',
    display: 'flex',
    bottom: '1rem',
    right: '1rem',
  },
  publishBtn: {
    marginRight: '1rem'
  },
  deleteBtn: {
    background: '#dc3545',
    color: '#fff',
    '&:hover': {
      background: '#dc3545',
      color: '#fff'
    }
  },
  review: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    bottom: '1rem'
  },
  datePicker: {
    paddingTop: '1.5rem !important'
  },
  bookingsLink: {
    position: 'absolute',
    right: '1rem',
    top: '1rem',
    color: '#666'
  },
  mobileBookingsLink: {
    position: 'absolute',
    right: '1rem',
    top: '130px',
    color: '#666'
  }
})

export default function MyListingItem(props) {
  const classes = useStyles();
  const propertyTypes = ['Apartment', 'House', 'Loft'];
  const { listing, getMyListing } = props;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([null, null]);

  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  }

  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  }

  const handlePublish = async (e) => {
    e.stopPropagation();
    const listingData = await API.graphql(graphqlOperation(getListing, {
      id: listing.id
    }));
    const detail = listingData.data.getListing;
    delete detail.createdAt;
    delete detail.updatedAt;
    detail.availability = [...value];
    detail.published = true;
    try {
      const response = await API.graphql(graphqlOperation(updateListing, { input: detail }));
      setOpen(false);
      getMyListing();
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUnpublish = (e) => {
    e.stopPropagation();
    console.log('unpublish');
  }

  const handleDelete = () => {
    console.log('delete');
  }

  return (
    <Card variant='outlined' className={classes.card}>
      <CardMedia component="img" image={listing.thumbnail ? listing.thumbnailURL : placeholder} alt="thumbnail" className={classes.cardImage} />
      <CardContent className={classes.cardContent}>
        <Typography className={classes.type}>
          {propertyTypes[listing.metadata.type - 1]}
        </Typography>
        <Typography variant="h5" component="div">
          {listing.title}
        </Typography>
        <Typography>
          {listing.metadata.totalBeds} beds, {listing.metadata.bathrooms} bathrooms
        </Typography>
        <Typography variant="body2">
          ${listing.price}/night
        </Typography>
        {listing.rating && <Typography variant="body2" className={classes.review}>
          <Rating readOnly name="feedback" value={listing.rating} emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />} />
          <span>({listing.reviews.length} reviews)</span>
          </Typography>}
      </CardContent>
      <Link className={classes.bookingsLink} to={`/bookings/${listing.id}`} onClick={(e) => e.stopPropagation()}>view bookings</Link>
      <div className={classes.btns}>
        {!listing.published
          ? <Button aria-describedby={listing.id} variant="outlined" className={classes.publishBtn} onClick={handleOpen}>publish</Button>
          : <Button aria-describedby={listing.id} variant="outlined" className={classes.publishBtn} onClick={handleUnpublish}>Unpublish</Button>}
        <Button className={classes.deleteBtn} onClick={handleDelete}>Delete</Button>
      </div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" onClick={(e) => e.stopPropagation()}>
        <DialogTitle>
          Choose Available Date Range
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={DateFnsAdapter}>
            <DateRangePicker
              startText="Start-Date"
              endText="End-Date"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField {...startProps} />
                  <Box sx={{ mx: 2 }}>to</Box>
                  <TextField {...endProps} />
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions><Button onClick={handlePublish}>Publish</Button></DialogActions>
      </Dialog>
    </Card>
  )
}
