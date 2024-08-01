import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { useState } from 'react';
import RefreshHandler from './RefreshHandler';
import SubmitStory from './pages/SubmitStory';
import Profile from './pages/Profile';

function App() {
  const [isAuthentcated, setIsAuthentcated] = useState(false);
  if (isMobileDevice()) {
    return (
      <div>
        <h1>Mobile Access Restricted</h1>
        <p>This site is only accessible on desktop devices.</p>
      </div>
    );
  }

  const PrivateRoute = ({ element }) => {
    return isAuthentcated ? element : <Navigate to={'/login'} />
  }
  return (
    <div className="App">
      <RefreshHandler setIsAuthentcated={setIsAuthentcated} />
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
        <Route path='/submitstory' element={<PrivateRoute element={<SubmitStory />} />} />
        <Route path='/profile' element={<PrivateRoute element={<Profile />} />} />
      </Routes>
    </div>
  );
}

function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

export default App;
