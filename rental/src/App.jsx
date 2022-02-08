import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
import Navbar from './components/Navbar';
import { StyledEngineProvider } from '@mui/material';
import MyListings from './views/MyListings';
import EditListing from './views/EditListing';
import ListingDetail from './views/ListingDetail';
import Booking from './views/Booking';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <div>
        <Navbar user={localStorage.getItem('username') || ''}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/my-listings/:id" element={<EditListing />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/bookings/:id" element={<Booking />} />
        </Routes>
      </div>
    </StyledEngineProvider>
  );
}

export default App;
