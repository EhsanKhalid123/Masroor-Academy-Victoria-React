import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getUser, removeUser } from "../data/repository";

import Home from "./Home";
import ErrorPage from "./ErrorPage";
import Header from './Header';
import Footer from './Footer';
import Navigation from './Navigation';


function App() {

  const [user, setUser] = useState(getUser());

 // Const Function for removing state for user and sending it to child elements
 const logoutUser = () => {
  removeUser();
  setUser(null);
};

  return (
    <div>
      <Router>
        <Header />
        <Navigation user={user} logoutUser={logoutUser}/>
        <Routes>
          <Route path="/" element={<Home />} />        
          <Route path="/home" element={<Home />} />    
          <Route path="*" element={<ErrorPage />} />      
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
