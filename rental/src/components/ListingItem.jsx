import React from 'react';
import { Card, CardMedia, CardContent, Typography, Rating } from '@mui/material';
import { Star } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import placeholder from '../images/placeholder.png';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: '325px',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
    }
  },
  cardImage: {
    width: '100%'
  },
  cardContent: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between'
  },
  review: {
    display: 'flex'
  },
  info: {
    color: '#39576a'
  }
})

export default function ListingItem (props) {
  const classes = useStyles();
  const propertyTypes = ['Apartment', 'House', 'Loft'];
  const { listing } = props;

  return (
    <Card variant="outlined" sx={{ maxWidth: 345 }} className={classes.card}>
      <CardMedia component="img" image={listing.thumbnail || placeholder} alt="placeholder" height="140" className={classes.cardImage} />
      <CardContent className={classes.cardContent}>
        <div>
          <Typography gutterBottom variant="body2" className={classes.info}>
          {propertyTypes[listing.metadata.type - 1]}, {listing.metadata.totalBeds} beds, {listing.metadata.bathrooms} bathrooms
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
          {listing.title}
          </Typography>
        </div>
        <div>
          <Typography variant="body2">
            ${listing.price}/night
          </Typography>
          <Typography variant="body2" className={classes.review}>
            {listing.reviews && listing.reviews.length > 0 && <Rating readOnly name="feedback" value={listing.rating} emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />} />}
            <span>({listing.reviews.length} reviews)</span>
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}
