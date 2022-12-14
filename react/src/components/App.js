// Importing React classes and functions from node modules & from components
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getUser, removeUser, loggedInUser, removeLoggedInUser, removeSelectedId, removeSelectedId2 } from "../data/repository";

// Importing the components
import Navigation from './Navigation';
import Header from './Header';
import Home from './Home';
import Footer from './Footer';
import Signup from './Sign-up';
import Login from './Login';
import MyProfile from "./MyProfile";
import EditProfile from './EditProfile';
import Announcements from './Announcements';
import MessageContext from "../data/MessageContext";
import About from "./About";
import ErrorPage from "./ErrorPage";
import Dashboard from "./Dashboard";
import Homework from "./Homework";

// Functional Component for App
function App() {

  // useState Hooks Defined
  const [user, setUser] = useState(getUser());
  const [message, setMessage] = useState(null);

  // Set message to null automatically after a period of time.
  useEffect(() => {
    if (message === null)
      return;

    // Time limit for message to display
    const id = setTimeout(() => setMessage(null), 7000);

    // When message changes clear the queued timeout function.
    return () => clearTimeout(id);
  }, [message]);

  // Const Function for storing in state Variables and for sending to child elements
  const loginUser = (user) => {
    setUser(user);
    loggedInUser(user.name);

  };

  // Const Function for removing state for user and sending it to child elements
  const logoutUser = () => {
    removeUser();
    setUser(null);
    removeLoggedInUser();
    removeSelectedId();
    removeSelectedId2();
  };

  // Returns below elements to from the function App.
  return (
    <div>
      {/* Router is used for routing to different pages */}
      {/* Message Contect Provider, useContext Hook Used, Message is being passed down to all child components */}
      <MessageContext.Provider value={{ message, setMessage }}>
        {/* Props being passed to each component and Router is used for Navigating to pages */}
        <Router>
          <Header />
          <Navigation user={user} loginUser={loginUser} logoutUser={logoutUser} />
          <Routes>
            {user !== null &&
              <Route path="/Dashboard" element={<Dashboard user={user} loginUser={loginUser} logoutUser={logoutUser} />} />
            }
            {/* {user !== null &&
              <Route path="/Friends" element={<Friends user={user} loginUser={loginUser} logoutUser={logoutUser} />} />
            }
            {user !== null &&
              <Route path="/Forum" element={<Forum user={user} loginUser={loginUser} logoutUser={logoutUser} />} />
            } */}
            {/* {user !== null &&
              <Route path="/EditProfile" element={props => (<EditProfile {...props} user={user} loginUser={loginUser} logoutUser={logoutUser} />)} />
            } */}
            {/* {user !== null &&
              <Route path="/MyProfile" element={<MyProfile user={user} loginUser={loginUser} logoutUser={logoutUser} /> } />
            } */}
            {user !== null &&
              <Route path="/Homework" element={<Homework user={user} />} />
            }
            <Route path="/Sign-in" element={<Login loginUser={loginUser} />} />
            <Route path="/About" element={<About loginUser={loginUser} />} />
            {/* <Route path="/Sign-up" element={<Signup loginUser={loginUser} />} /> */}
            {user !== null &&
            <>
              {(user.name === "Teacher" ||  user.name === "Admin") &&
                <Route path="/Announcements" element={<Announcements user={user} loginUser={loginUser} logoutUser={logoutUser} />} />
              }
            </>
            }
            {user === null &&
              <Route path="/" element={<Home user={user} />} />
            }
            {user === null &&
              <Route path="/Home" element={<Home user={user} />} />
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
