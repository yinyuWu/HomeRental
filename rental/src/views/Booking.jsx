import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { API, graphqlOperation } from 'aws-amplify';
import { getListing, listBookings } from '../graphql/queries';
import { useParams } from 'react-router-dom';
import { updateBooking } from '../graphql/mutations';

const useStyles = makeStyles({
  booking: {
    padding: '5rem',
    display: 'flex',
  },
  bookingTable: {
    width: '60%'
  },
  totalPrice: {
    fontSize: '1.2rem',
    fontWeight: 700
  },
  date: {
    fontSize: '1.2rem',
    fontWeight: 700
  },
  acceptBtn: {
    marginRight: '.2rem',
    color: '#FF5A5F',
    border: '1px solid #FF5A5F',
    '&:hover': {
      border: '1px solid #FF5A5F',
      background: '#FF5A5F',
      color: '#fff'
    }
  },
  denyBtn: {
    background: '#FF5A5F',
    '&:hover': {
      background: '#FF5A5F'
    }
  },
  info: {
    width: '25%',
    height: '350px',
    border: '1px solid #e4e4e4',
    background: '#fff',
    padding: '20px 24px',
    marginLeft: '8.3333%'
  },
  infoItem: {
    marginTop: '1rem',
    paddingBottom: '.5rem',
    borderBottom: '1px solid #e4e4e4'
  },
  infoItemTitle: {
    fontWeight: 600
  }
})

export default function Booking (props) {
  const classes = useStyles();
  const params = useParams();

  const [bookings, setBookings] = useState([]);
  const [detail, setDetail] = useState({});

  useEffect(() => {
    fetchData();
  }, [bookings])

  const fetchData = async () => {
    // get listing detail
    const listingData = await API.graphql(graphqlOperation(getListing, {
      id: params.id
    }));
    const detail = listingData.data.getListing;
    // calculate total days online
    const currentTime = new Date();
    const postTime = new Date(detail.createdAt);
    const diff = Math.round((currentTime - postTime) / (1000 * 60 * 60 * 24));
    detail.online = diff;
    // get all bookings
    const bookingsData = await API.graphql(graphqlOperation(listBookings, {
      filter: {
        listingId: {
          eq: params.id
        }
      }
    }));
    const bookingsItems = bookingsData.data.listBookings.items;
    setBookings(bookingsItems);
    // calculate total days booked
    let bookedDays = 0
    bookings.forEach(booking => {
      const start = new Date(booking.dateRange.start);
      const end = new Date(booking.dateRange.end);
      const days = Math.round((end - start) / (1000 * 60 * 60 * 24));
      bookedDays += days;
    })
    detail.bookedDays = bookedDays;
    detail.totalProfit = bookedDays * detail.price;
    setDetail(detail);
  }

  const handleAccept = (bookingId) => {
    const booking = bookings.find(booking => booking.id === bookingId);
    booking.status = 'accept';
    delete booking.createdAt;
    delete booking.updatedAt;
    API.graphql(graphqlOperation(updateBooking, { input: booking })).then(async response => {
      console.log(response);
      try {
        const bookingsData = await API.graphql(graphqlOperation(listBookings, {
          filter: {
            listingId: {
              eq: params.id
            }
          }
        }));
        const bookingsItems = bookingsData.data.listBookings.items;
        setBookings(bookingsItems);
      } catch (err) {
        console.log(err);
      }
    })
  }

  const handleDeny = (bookingId) => {
    const booking = bookings.find(booking => booking.id === bookingId);
    booking.status = 'deny';
    delete booking.createdAt;
    delete booking.updatedAt;
    API.graphql(graphqlOperation(updateBooking, { input: booking })).then(async response => {
      console.log(response);
      try {
        const bookingsData = await API.graphql(graphqlOperation(listBookings, {
          filter: {
            listingId: {
              eq: params.id
            }
          }
        }));
        const bookingsItems = bookingsData.data.listBookings.items;
        setBookings(bookingsItems);
      } catch (err) {
        console.log(err);
      }
    })
  }

  return (
    <div className={classes.booking}>
      <div className={classes.bookingTable}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map(booking => {
                return (
                <TableRow key={booking.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" className={classes.date}>from {booking.dateRange && booking.dateRange.start.split('T')[0]} to {booking.dateRange && booking.dateRange.end.split('T')[0]}</TableCell>
                  <TableCell align="right" className={classes.totalPrice}>{booking.totalPrice}</TableCell>
                  <TableCell align="right">
                    {booking.status === 'pending' && <div><Button variant="outlined" size="small" className={classes.acceptBtn} onClick={() => handleAccept(booking.id)}>Accept</Button>
                    <Button variant="contained" size="small" className={classes.denyBtn} onClick={() => handleDeny(booking.id)}>Deny</Button></div>}
                  </TableCell>
                </TableRow>)
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className={classes.info}>
        <Typography variant="body1" className={classes.infoItem}>
          <span className={classes.infoItemTitle}>Time online</span>: {detail.online} days
        </Typography>
        <Typography variant="body1" className={classes.infoItem}>
          <span className={classes.infoItemTitle}>Total profit</span>: ${detail.totalProfit}
        </Typography>
        <Typography variant="body1" className={classes.infoItem}>
          <span className={classes.infoItemTitle}>Total days booked</span>: {detail.bookedDays} days
        </Typography>
      </div>
    </div>
  )
}