import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { BathroomRounded, BedroomChildRounded, Kitchen, LocalLaundryService, MeetingRoomRounded, Pool, Wifi, Air, DryCleaning, Star } from '@mui/icons-material';
import { Typography, Rating, Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Chip, useMediaQuery } from '@mui/material';
import { LocalizationProvider, DateRangePicker } from '@mui/lab';
import DateFnsAdapter from '@mui/lab/AdapterDateFns';
import ReviewItem from '../components/ReviewItem';
import { useParams } from 'react-router-dom';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { getListing, listBookings } from '../graphql/queries'
import { createBooking, updateListing } from '../graphql/mutations';

const useStyles = makeStyles({
  detail: {
    padding: '5rem',
    display: 'flex'
  },
  mobileDetail: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column'
  },
  main: {
    width: '60%'
  },
  mobileMain: {
    width: '100%'
  },
  title: {
    fontSize: '4rem',
    fontWeight: 500,
    margin: 0
  },
  price: {
    fontWeight: 700,
    fontSize: '1.3rem'
  },
  line: {
    borderColor: 'rgba(150,150,150,0.2)'
  },
  address: {
    fontSize: '1.2rem',
    fontWeight: 700
  },
  info: {
    margin: '0.5rem'
  },
  amenities: {
    margin: '3em 0 1em 0',
  },
  propertyImages: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  image: {
    width: '30%',
    height: 'auto',
    margin: '1rem 1rem 1rem 0'
  },
  booking: {
    width: '25%',
    height: '350px',
    border: '1px solid #e4e4e4',
    background: '#fff',
    padding: '20px 24px',
    marginLeft: '8.3333%',
    marginTop: '3rem',
  },
  mobileBooking: {
    width: '90%',
    height: '350px',
    border: '1px solid #e4e4e4',
    background: '#fff',
    padding: '20px 8px',
    margin: '1.4rem auto'
  },
  review: {
    display: 'flex',
    marginBottom: '1rem'
  },
  bookBtn: {
    background: '#FF5A5F',
    color: '#fff',
    marginTop: '1.5rem',
    '&:hover': {
      background: '#FF5A5F',
      color: '#fff',
    }
  },
  datePick: {
    margin: '1rem 0'
  },
  dateLabel: {
    marginBottom: '1rem'
  },
  reviewList: {
    marginBottom: '2rem'
  },
  reviewForm: {
    display: 'flex',
    flexDirection: 'column'
  },
  reviewBtn: {
    background: '#FF5A5F',
    color: '#fff',
    marginTop: '1rem',
    '&:hover': {
      background: '#FF5A5F',
      color: '#fff'
    }
  }
})

export default function ListingDetail(props) {
  const classes = useStyles();
  const params = useParams();
  const mobile = useMediaQuery('(max-width: 800px)');
  const propertyTypes = ['Apartment', 'House', 'Loft'];

  const [listing, setListing] = useState({});
  const [value, setValue] = useState([null, null]);
  const [fee, setFee] = useState(0);
  const [open, setOpen] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  const [booking, setBooking] = useState(null);
  const [review, setReview] = useState({ rating: 3, user: localStorage.getItem('email') });
  const [bookLoading, setBookLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) setLoggedin(true);
    fetchData();
  }, []);

  const getImages = (index, list, res) => {
    return new Promise((resolve, reject) => {
      Storage.get(list[index]).then((imageURL) => {
        res.push(imageURL);
        if (index === list.length - 1) {
          resolve(res);
        } else {
          getImages(index + 1, list, res).then(resolve)
        }
      });
    })
  }

  const fetchData = async () => {
    try {
      const listingData = await API.graphql(graphqlOperation(getListing, {
        id: params.id
      }));
      const detail = listingData.data.getListing;
      const { title, address, price, metadata, reviews, availability, owner, rating } = detail;
      const { street, city, state, postcode, country } = address;
      const { amenities, bathrooms, bedrooms, type, images, totalBeds } = metadata;
      const listingItem = { title, price, street, city, state, postcode, country, bathrooms, bedrooms, type, totalBeds, reviews, availability, owner, rating };
      const amenitiesText = {
        airConditioning: 'Air Conditioning',
        essentials: 'Essentials',
        kitchen: 'Kitchen',
        pool: 'Pool',
        washer: 'Washer',
        wirelessInternet: 'Wireless Internet'
      };
      const amenitiesIcons = {
        airConditioning: <Air />,
        essentials: <DryCleaning />,
        kitchen: <Kitchen />,
        pool: <Pool />,
        washer: <LocalLaundryService />,
        wirelessInternet: <Wifi />
      }
      const amenitiesList = [];
      Object.keys(amenities).forEach(amenity => {
        amenities[amenity] && amenitiesList.push({
          text: amenitiesText[amenity],
          icon: amenitiesIcons[amenity]
        });
      });
      listingItem.amenitiesObjects = amenitiesList;
      listingItem.amenities = amenities;
      if (images) {
        getImages(0, images, []).then(data => {
          listingItem.images = data;
          listingItem.imagesURL = images;
          setListing(listingItem);
        })
      } else {
        setListing(listingItem);
      }
      // fetch booking data
      if (localStorage.getItem('email')) {
        const bookingData = await API.graphql(graphqlOperation(listBookings, {
          filter: {
            listingId: {
              eq: params.id
            },
            owner: {
              eq: localStorage.getItem('email')
            }
          }
        }));
        const bookings = bookingData.data.listBookings.items;
        if (bookings.length > 0) setBooking(bookings[0]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleDateChange = (newValue) => {
    setValue(newValue);
    if (newValue[0] && newValue[1]) {
      const diff = (newValue[1] - newValue[0]) / (1000 * 60 * 60 * 24);
      const totalFee = diff * listing.price;
      setFee(totalFee);
    }
  }

  const handleReviewTextChange = (e) => {
    const value = e.target.value;
    setReview({ ...review, text: value });
  }

  const handleReviewRatingChange = (e) => {
    const rating = parseInt(e.target.value);
    setReview({ ...review, rating });
  }

  const handleSendReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    const { title, street, city, state, postcode, country, bathrooms, type, price, bedrooms, totalBeds, amenities, reviews, owner } = listing;
    // updated listing data
    const address = { street, city, state, postcode, country };
    const metadata = { bathrooms, type, numOfBedrooms: bedrooms.length, bedrooms, amenities, totalBeds, images: listing.imagesURL };
    // update reviews
    let updateReviews;
    let updateRating;
    const newReview = { ...review };
    if (!newReview.text) newReview.text = '';
    if (reviews && listing.rating) {
      updateReviews = reviews;
      updateReviews.push(newReview);
      updateRating = Math.round((listing.rating * reviews.length + newReview.rating) / (reviews.length + 1));
    } else {
      updateReviews = [newReview];
      updateRating = newReview.rating;
    }
    const data = { id: params.id, title, address, price: parseInt(price), metadata, thumbnail: listing.thumbnail, owner, reviews: updateReviews, rating: updateRating, bedrooms: bedrooms.length };
    console.log('send review', data);
    try {
      const response = await API.graphql(graphqlOperation(updateListing, { input: data }));
      console.log('response: ', response);
    } catch (err) {
      console.log(err);
      
    }
    setReviewLoading(false);
    setReview({ ...review, rating: 3, text: '' });
    fetchData();
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleBook = async (e) => {
    e.preventDefault();
    setBookLoading(true);
    if (!value[0] || !value[1]) {
      console.log('Invalid Date');
      setBookLoading(false);
      return;
    }
    const dateRange = { start: value[0], end: value[1] };
    const listingId = params.id;
    const data = { owner: localStorage.getItem('email'), dateRange, totalPrice: fee, listingId, status: 'pending' };
    try {
      const response = await API.graphql(graphqlOperation(createBooking, { input: data }));
      setOpen(true);
      fetchData();
      console.log(response);
    } catch (err) {
      console.log(err);
    }
    setBookLoading(false);
  }

  return (
    <div className={mobile ? classes.mobileDetail : classes.detail}>
      <div className={mobile ? classes.mobileMain : classes.main}>
        <Typography variant="body2">{propertyTypes[listing.type - 1]}</Typography>
        <h2 className={classes.title}>{listing.title}</h2>
        <p className={classes.address}>{listing.street}, {listing.city}, {listing.state}, {listing.country}</p>
        <hr className={classes.line} />
        <div>
          <span className={classes.info}><MeetingRoomRounded />{listing.bedrooms && listing.bedrooms.length} Bedroom</span>
          <span className={classes.info}><BathroomRounded />{listing.bathrooms} Bathroom</span>
          <span className={classes.info}><BedroomChildRounded />{listing.totalBeds} Beds</span>
        </div>
        <div className={classes.amenities}>
          {listing.amenitiesObjects && listing.amenitiesObjects.map(amenity => {
            return (<span key={amenity.text} className={classes.info}>{amenity.icon} {amenity.text} </span>)
          })}
        </div>
        <hr className={classes.line} />
        <h4>Property Images</h4>
        <div className={classes.propertyImages}>
          {listing.images && listing.images.length > 0
            ? listing.images.map((image, index) => {
              return (<img key={index} src={image} alt={`image-${index}`} className={classes.image} />)
            })
            : <p>No property images</p>}
        </div>
        <hr className={classes.line} />
        <h3>Reviews</h3>
        <div className={classes.reviewList}>
          {listing.reviews && listing.reviews.map((review, index) => {
            return (<ReviewItem key={index} review={review} />)
          })}
        </div>
        {loggedin && booking && <Box component="form" className={classes.reviewForm} onSubmit={handleSendReview}>
          <TextField multiline fullWidth rows={4} label="Your Review" onChange={handleReviewTextChange} value={review.text} />
          <Rating name="rating" value={review.rating} emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />} onChange={handleReviewRatingChange} />
          <Button variant="contained" className={classes.reviewBtn} type="submit" disabled={reviewLoading}>{reviewLoading ? 'saving review...' : 'Save Review'}</Button>
        </Box>}
      </div>
      <div className={mobile ? classes.mobileBooking : classes.booking}>
        <Typography variant="h6" className={classes.price}>
          ${listing.price}/night
        </Typography>
        {loggedin && booking && <Chip label={booking.status} color="primary" size="small" />}
        {listing.rating && <Typography variant="body2" className={classes.review}>
          <Rating readOnly name="feedback" value={listing.rating} emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />} />
          <span>({listing.reviews && listing.reviews.length})</span>
        </Typography>}
        <hr className={classes.line} />
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleBook}>
          <div className={classes.datePick}>
            <p className={classes.dateLabel}>Date</p>
            <LocalizationProvider dateAdapter={DateFnsAdapter}>
              <DateRangePicker
                startText="Check-in"
                endText="Check-out"
                disablePast
                minDate={listing.availability ? Date.parse(listing.availability[0]) : undefined}
                maxDate={listing.availability ? Date.parse(listing.availability[1]) : undefined}
                value={value}
                onChange={handleDateChange}
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
          <Typography>Total fee: ${fee}</Typography>
          {loggedin
            ? listing.owner !== localStorage.getItem('email')
              ? <Button variant="contained" className={classes.bookBtn} type="submit" disabled={bookLoading}>{bookLoading ? 'Booking...' : 'Book'}</Button>
              : <Button variant="contained" className={classes.bookBtn} disabled>You cannot book your own   property </Button>
            : <Button variant="contained" className={classes.bookBtn} disabled>You have to log in to book </Button>}
        </Box>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          Booking Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have made a booking (from {value[0] && value[0].getDate()}/{value[0] && value[0].getMonth() + 1}/{value[0] && value[0].getFullYear()} to {value[1] && value[1].getDate()}/{value[1] && value[1].getMonth() + 1}/{value[1] && value[1].getFullYear()})
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
