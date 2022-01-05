import React from 'react';
import { makeStyles } from '@mui/styles';
import { Card, CardContent, CardMedia, Rating, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';
import placeholder from '../images/placeholder.png';

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
  const { listing } = props;

  return (
    <Card variant='outlined' className={classes.card}>
      <CardMedia component="img" image={listing.thumbnailURL || placeholder} alt="thumbnail" className={classes.cardImage} />
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
    </Card>
  )
}
