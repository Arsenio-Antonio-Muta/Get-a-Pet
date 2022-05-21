import React from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom'

// components
import Navbar from './components/layout/Navbar';
import Container from './components/layout/Container';
import Footer from './components/layout/Footer';
import Message from './components/layout/Message';

// Import pages
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';
import Home from './components/pages/Home';

// Import user profile
import Profile from './components/pages/User/Profile';


//Context
import { UserProvider } from './context/UserContext';
import MyPets from './components/pages/Pet/MyPets';
import AddPet from './components/pages/Pet/AddPet';
import EditPet from './components/pages/Pet/EditPet';
import PetDetails from './components/pages/Pet/PetDetails';
import MyAdoptions from './components/pages/Pet/MyAdoptions';

const App = () => {
  return (
      <BrowserRouter>
        <UserProvider>
          <Navbar/>
          <Message />
            <Container>
              <Routes>
                <Route path='/register' element={<Register />} />
                <Route path='/user/profile' element={<Profile />} />
                <Route path='/login' element={<Login/>} />
                <Route path='/' element = {<Home/>} />
                <Route path='/pet/mypets' element={<MyPets />}/>
                <Route path='/pet/add' element={<AddPet />} />
                <Route path='/pet/:id' element={<PetDetails />} />
                <Route path='/pet/edit/:id' element={<EditPet />} />
                <Route path='/pet/myadoptions' element={<MyAdoptions />} />
              </Routes>
            </Container>
          <Footer/>
        </UserProvider>
      </BrowserRouter>
  
  );
}

export default App;
