import React, { useEffect } from 'react';
import { useState } from 'react';
import { makeStyles, styled } from '@mui/styles';
import { Box, TextField, MenuItem, FormControl, InputLabel, Select, Checkbox, FormGroup, FormControlLabel, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { getListing } from '../graphql/queries';
import { v4 as uuid } from 'uuid';
import { updateListing } from '../graphql/mutations';

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
  const params = useParams();
  const [listing, setListing] = useState({});
  const [amenities, setAmenities] = useState({
    essentials: false,
    airConditioning: false,
    wirelessInternet: false,
    washer: false,
    kitchen: false,
    pool: false,
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [updateImages, setUpdateImages] = useState(false);
  const [updateThumb, setUpdateThumb] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listingData = await API.graphql(graphqlOperation(getListing, {
          id: params.id
        }));
        const detail = listingData.data.getListing;
        const { title, thumbnail, address, price, metadata } = detail;
        const { street, city, state, postcode, country } = address;
        const { amenities, bathrooms, bedrooms, numOfBedrooms, type, images } = metadata;
        const listingItem = { title, thumbnail, price, street, city, state, postcode, country, bathrooms, bedrooms, type, numOfBedrooms };

        setAmenities(amenities);
        setListing(listingItem);
        Storage.get(detail.thumbnail).then((thumbnailData) => {
          setThumbnail(thumbnailData);
        })
        if (images) {
          getImages(0, images, []).then(data => {
            setImages(data);
          });
        }
      } catch (err) {
        console.log('error', err);
      }
    }
    fetchData();
  }, [params.id]);

  const getImages = (index, list, res) => {
    return new Promise((resolve, reject) => {
      console.log(list[index]);
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

  const handleAmenitiesChange = (e) => {
    const newAmenities = { ...amenities, [e.target.name]: e.target.checked };
    setAmenities(newAmenities);
  }

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(URL.createObjectURL(e.target.files[0]));
      setListing({ ...listing, thumbnail: e.target.files[0] });
      setUpdateThumb(true);
    }
  }

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = e.target.files;
      const imgList = [];
      for (let f of files) {
        imgList.push(URL.createObjectURL(f));
      }
      setImages(imgList);
      setListing({ ...listing, images: e.target.files });
      setUpdateImages(true);
    }
  }

  const saveImages = (index, imagesList, result) => {
    return new Promise((resolve, reject) => {
      Storage.put(`${uuid()}.jpeg`, imagesList[index], { contentType: 'image/*' }).then(res => {
        result.push(res.key);
        if (index === imagesList.length - 1) {
          resolve(result);
        } else {
          saveImages(index + 1, imagesList, result).then(resolve);
        }
      }).catch(err => reject(err));
    })
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { title, street, city, state, postcode, country, bathrooms, type, price, numOfBedrooms, bedrooms } = listing;
    // calculate number of beds
    let totalBeds = 0;
    for (const bedroom of bedrooms) {
      totalBeds += bedroom.numOfBeds;
    }
    const address = { street, city, state, postcode, country };
    let data = {};
    // save images into s3 bucket
    if (updateImages) {
      const resultImages = await saveImages(0, listing.images, []);
      listing.images = resultImages;
    }
    if (updateThumb) {
      const resultThumbnail = await Storage.put(`${uuid()}.jpeg`, listing.thumbnail);
      listing.thumbnail = resultThumbnail.key;
    }
    const metadata = { bathrooms, type, numOfBedrooms, bedrooms, amenities, totalBeds, images: listing.images };
    data = { title, address, price: parseInt(price), metadata, thumbnail: listing.thumbnail, owner: localStorage.getItem('email'), bedrooms: numOfBedrooms };
    data.id = params.id;
    // console.log(data);
    try {
      const response = await API.graphql(graphqlOperation(updateListing, { input: data }));
      console.log('response: ', response);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
    setUpdateImages(false);
    setUpdateThumb(false);
  }

  return (
    <div className={classes.edit}>
      <Box component="form" sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 1,
        m: 1
      }} onSubmit={handleEdit}>
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
        <h4 className={classes.formGroupTitle}>Thumbnail</h4>
        {thumbnail && <img src={thumbnail} alt="thumbnail" className={classes.image} />}
        <label htmlFor="contained-button-file">
          <Input accept="image/*" id="contained-button-file" type="file" onChange={handleThumbnailChange} />
          <Button className={classes.uploadBtn} variant="contained" component="span">
            Upload Thumbnail
          </Button>
        </label>
        <h4 className={classes.formGroupTitle}>Property Images</h4>
        <div className={classes.propertyImages}>
          {images.length === 0
            ? <p>You have no property images</p>
            : images.map((image, index) => {
              return (<img key={index} src={image} alt={`property-${index}`} className={classes.image} />)
            })}
        </div>
        <input accept="image/*" id="contained-button-file" type="file" multiple onChange={handleImageChange} />
        <Button variant="contained" type="submit" className={classes.formSubmitBtn} disabled={loading}>{loading ? 'Saving Changes...' : 'Save'}</Button>
      </Box>
    </div>
  )
}