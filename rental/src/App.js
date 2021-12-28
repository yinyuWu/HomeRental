import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import SignUp from './views/SignUp';
import Navbar from './components/Navbar';
import { StyledEngineProvider } from '@mui/material';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </StyledEngineProvider>
  );
}

export default App;
