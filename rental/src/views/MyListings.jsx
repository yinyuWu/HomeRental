import React from 'react';
import AlertDialog from '../components/AlertDialog';
import { makeStyles } from '@mui/styles';
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Checkbox, FormGroup, FormControlLabel, Input, IconButton} from '@mui/material';
import { useState, useEffect } from 'react';
import Close from '@mui/icons-material/Close';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { listListings } from '../graphql/queries';
import { createListing } from '../graphql/mutations';
import MyListingItem from '../components/MyListingItem';
import { v4 as uuid } from 'uuid';

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
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 0
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
  const [amenities, setAmenities] = useState({
    essentials: false,
    airConditioning: false,
    wirelessInternet: false,
    washer: false,
    kitchen: false,
    pool: false,
  });
  const [image, setImage] = useState(null);
  const [alert, setAlert] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setListing({ ...listing, [name]: value });
  }

  const handleBedroomsChange = (e) => {
    const value = e.target.value;
    const totalBedrooms = parseInt(value);
    const list = [];
    for (let i = 0; i < totalBedrooms; i++) {
      list.push({ id: i, numOfBeds: '' });
    }
    setListing({ ...listing, bedrooms: list, numOfBedrooms: value });
  }

  const handleBedsChange = (e) => {
    const id = parseInt(e.target.name.split('-')[1]);
    const value = e.target.value;
    const list = listing.bedrooms;
    list[id].numOfBeds = value;
    setListing({ ...listing, bedrooms: list });
  }

  const handleAmenitiesChange = (e) => {
    setAmenities({ ...amenities, [e.target.name]: e.target.checked });
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setListing({ ...listing, thumbnail: e.target.files[0] });
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    const { title, street, city, state, postcode, country, bathrooms, type, price, numOfBedrooms, bedrooms, thumbnail } = listing;
    // calculate number of beds
    let totalBeds = 0;
    for (const bedroom of bedrooms) {
      totalBeds += bedroom.numOfBeds;
    }
    const address = { street, city, state, postcode, country };
    const metadata = { bathrooms, type, numOfBedrooms, bedrooms, amenities, totalBeds };
    if (!thumbnail) {
      setAlert(true);
      return;
    }
    const { key } = await Storage.put(`${uuid()}.jpeg`, thumbnail, { contentType: 'image/*' } );
    const data = { title, address, price: parseInt(price), metadata, thumbnail: key, owner: localStorage.getItem('email') };
    try {
      const response = await API.graphql(graphqlOperation(createListing, { input: data }));
      console.log('response: ', response);
    } catch (err) {
      console.log(' error: ', err.errors[0].message);
    }
    console.log(data);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>
        Create a New Listing
        <IconButton onClick={onClose} className={classes.closeBtn}>
          <Close />
        </IconButton>
      </DialogTitle>
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
                required
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
                required
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
          <FormControl variant="outlined" margin="normal">
            <InputLabel id="bedrooms">Bedrooms</InputLabel>
            <Select
              required
              labelId="bedrooms"
              id="bedrooms-select"
              name="numOfBedrooms"
              value={listing.numOfBedrooms || ''}
              label="Bedrooms"
              onChange={handleBedroomsChange}
            >
              <MenuItem value={1}>1 bedroom</MenuItem>
              <MenuItem value={2}>2 bedrooms</MenuItem>
              <MenuItem value={3}>3 bedrooms</MenuItem>
              <MenuItem value={4}>4 bedrooms</MenuItem>
              <MenuItem value={5}>5 bedrooms</MenuItem>
            </Select>
          </FormControl>
          {listing.bedrooms && listing.bedrooms.map(bedroom => {
            return (<FormControl variant="outlined" margin="normal" key={bedroom.id}>
              <InputLabel id={`bedroom-${bedroom.id}`}>{`Bedroom ${bedroom.id + 1}`}</InputLabel>
              <Select
                required
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
          <h4 className={classes.formGroupTitle}>Amenities</h4>
          <div className={classes.amenities}>
            <FormGroup>
              <FormControlLabel control={<Checkbox name="essentials" checked={amenities.essentials} onChange={handleAmenitiesChange} />} label="Essentials" />
              <FormControlLabel control={<Checkbox name="wirelessInternet" checked={amenities.wirelessInternet} onChange={handleAmenitiesChange} />} label="Wireless Internet" />
              <FormControlLabel control={<Checkbox name="kitchen" checked={amenities.kitchen} onChange={handleAmenitiesChange} />} label="Kitchen" />
            </FormGroup>
            <FormGroup>
              <FormControlLabel control={<Checkbox name="airConditioning" checked={amenities.airConditioning} onChange={handleAmenitiesChange} />} label="Air Conditioning" />
              <FormControlLabel control={<Checkbox name="washer" checked={amenities.washer} onChange={handleAmenitiesChange} />} label="Washer" />
              <FormControlLabel control={<Checkbox name="pool" checked={amenities.pool} onChange={handleAmenitiesChange} />} label="Pool" />
            </FormGroup>
          </div>
          <label htmlFor="contained-button-file">
            <Input accept="image/*" id="contained-button-file" type="file" onChange={handleImageChange} />
            <Button className={classes.uploadBtn} variant="contained" component="span">
              Upload Thumbnail
            </Button>
          </label>
          {image && <img src={image} alt="thumbnail" className={classes.image} />}
          <Button variant="contained" type="submit" className={classes.formSubmitBtn}>Create</Button>
        </Box>
      </DialogContent>
      <AlertDialog open={alert} onClose={() => setAlert(false)} text='Invalid Input' />
    </Dialog>
  )
}

export default function MyListings() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    getMyListing();
  }, []);

  const getMyListing = async () => {
    try {
      const listingData = await API.graphql(graphqlOperation(listListings));
      const myListings = listingData.data.listListings.items;
      setListings(myListings);
      console.log('my listings: ', myListings);
    } catch (err) {
      console.log('error: ', err);
    }
  }

  return (
    <div className={classes.container}>
      <h3>My Listings</h3>
      <Button className={classes.createBtn} onClick={() => setOpen(true)}>Create a New Listing</Button>
      <div className={classes.list}>
        {listings.length > 0
          ? listings.map(listing => {
            return (<div key={listing.id}>
              <MyListingItem listing={listing} />
            </div>)
          })
          : <p>No Listings</p>}
      </div>
      <CreateDialog open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
