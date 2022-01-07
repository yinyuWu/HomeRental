import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
import Navbar from './components/Navbar';
import { StyledEngineProvider } from '@mui/material';
import MyListings from './views/MyListings';
import EditListing from './views/EditListing';

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
        </Routes>
      </div>
    </StyledEngineProvider>
  );
}

export default App;
