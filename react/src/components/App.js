// Importing React classes and functions from node modules & from components
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { getUser, removeUser, loggedInUser, removeLoggedInUser, removeSelectedId, removeSelectedId2 } from "../data/repository";
import jwtDecode from 'jwt-decode'

// Importing the components
import Navigation from './Navigation';
import Header from './Header';
import Home from './Home';
import Footer from './Footer';
import Login from './Login';
import Announcements from './Announcements';
import MessageContext from "../data/MessageContext";
import About from "./About";
import ErrorPage from "./ErrorPage";
import Dashboard from "./Dashboard";
import Homework from "./Homework";
import Register from "./Register";
import Student from "./Student";
import Resources from "./Resources";

// Functional Component for App
function App() {

  // useState Hooks Defined
  const [user, setUser] = useState(getUser());
  const [decodedUser, setDecodedUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [logoutTimer, setLogoutTimer] = useState(null); // new state variable to hold the logout timer

  // Set message to null automatically after a period of time.
  useEffect(() => {

    if (user !== null) {
      const decoded = jwtDecode(user);
      setDecodedUser(decoded);

      // set a timer to log out the user when the token expires
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
      if (expiresIn > 0) {
        const timer = setTimeout(logoutUser, expiresIn * 1000);
        setLogoutTimer(timer);
      }

    }

    if (message === null)
      return;

    // Time limit for message to display
    const id = setTimeout(() => setMessage(null), 7000);

    // When message changes clear the queued timeout function.
    return () => clearTimeout(id);
  }, [message, user]);

  // Const Function for storing in state Variables and for sending to child elements
  const loginUser = (user) => {
    setUser(user);
    const userDecoded = jwtDecode(user);
    loggedInUser(userDecoded.name);

    // clear the logout timer and set a new one when the user logs in
    if (logoutTimer !== null) {
      clearTimeout(logoutTimer);
    }
    const expiresIn = userDecoded.exp - Math.floor(Date.now() / 1000);
    if (expiresIn > 0) {
      const timer = setTimeout(logoutUser2, expiresIn * 1000);
      // const timer = setTimeout(() => {
      //   navigate('/Sign-in'); // redirect to the logout page when the token expires
      //   logoutUser2();
      // }, expiresIn * 1000);
      setLogoutTimer(timer);
    }

  };

  // Const Function for removing state for user and sending it to child elements
  const logoutUser = () => {
    removeUser();
    setUser(null);
    setDecodedUser(null);
    removeLoggedInUser();
    removeSelectedId();
    removeSelectedId2();
  };

  const logoutUser2 = () => {
    logoutUser()    
    localStorage.setItem("inactiveMessage", "Your session has expired. Please login again to continue!");
    window.location.href = '/Sign-in';
  }

  // Returns below elements to from the function App.
  return (
    <div>
      {/* Router is used for routing to different pages */}
      {/* Message Contect Provider, useContext Hook Used, Message is being passed down to all child components */}
      <MessageContext.Provider value={{ message, setMessage }}>
        {/* Props being passed to each component and Router is used for Navigating to pages */}
        <Router>

          <Header />
          <Navigation user={decodedUser} loginUser={loginUser} logoutUser={logoutUser} />
          <Routes>

            {decodedUser !== null &&
              <>
                <Route path="/" element={<Navigate to="/Dashboard" replace />} />
                <Route path="/Home" element={<Navigate to="/Dashboard" replace />} />
                <Route path="/Dashboard" element={<Dashboard user={decodedUser} loginUser={loginUser} logoutUser={logoutUser} />} />
                <Route path="/Resources" element={<Resources user={decodedUser} loginUser={loginUser} logoutUser={logoutUser} />} />
                <>
                  {(decodedUser.group === "Male Teacher" || decodedUser.group === "Female Teacher" || decodedUser.group === "Admin") &&
                    <>
                      <Route path="/Announcements" element={<Announcements user={decodedUser} loginUser={loginUser} logoutUser={logoutUser} />} />
                      <Route path="/Student" element={<Student user={decodedUser} loginUser={loginUser} logoutUser={logoutUser} />} />
                      <Route path="/Homework" element={<Homework user={decodedUser} />} />
                    </>
                  }
                </>
              </>
            }

            {(decodedUser === null || decodedUser.name === "Admin") &&
              <>
                <Route path="/" element={<Home user={decodedUser} />} />
                <Route path="/Home" element={<Home user={decodedUser} />} />
                <Route path="/Sign-in" element={<Login loginUser={loginUser} />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/About" element={<About loginUser={loginUser} />} />
              </>
            }

            <Route path="*" element={<ErrorPage />} />
          </Routes>
          <Footer />
        </Router>
      </MessageContext.Provider>
    </div>
  );
}

// Export the App Function
export default App;
