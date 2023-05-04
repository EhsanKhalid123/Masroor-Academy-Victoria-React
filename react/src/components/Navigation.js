// Importing React classes and functions from node modules
import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

// Functional Component for Navigation Bar
function Navigation(props) {

  const location = useLocation();

  const HomeLink = () => {
    if (location.pathname === "/" || location.pathname === "/Home") {
      return (
        <Link className="nav-link2 nav-link active" to="/Home">
          Home
        </Link>
      );
    } else {
      return (
        <NavLink className="nav-link2 nav-link" to="/Home">
          Home
        </NavLink>
      );
    }
  };

  // Returns HTML code from this function which is displayed by importing on other pages
  return (

    // Navbar Code using normal HTML elements
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#f0f0f0" }}>
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          <img className="navbar-brand" src={process.env.PUBLIC_URL + 'assets/images/Masroor Academy Logo.png'} width="50px" alt="Logo for Masroor Academy" />
        </NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {/* If user is not logged in display the following */}
            {props.user === null &&
              <>
                <li className="nav-item">
                  <HomeLink />
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link2 nav-link" to="/About">About Us</NavLink>
                </li>
              </>
            }

            {/* The following links only appear if user is logged in  */}
            {props.user !== null &&
              <>

                <li className="nav-item">
                  <NavLink className="nav-link2 nav-link" to="/Dashboard">Dashboard</NavLink>
                </li>
                {/* If the user is Teacher or Admin Account then Display Following Links */}
                {(props.user.group === "Male Teacher" || props.user.group === "Female Teacher" || props.user.group === "Admin") &&
                  <>

                    <li className="nav-item">
                      <NavLink className="nav-link2 nav-link" to="/Announcements">Annoucements</NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink className="nav-link2 nav-link" to="/SelectGroupHomework">Homework</NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink className="nav-link2 nav-link" to="/SelectGroupStudent">Students</NavLink>
                    </li>

                    
                  </>
                }

                <li className="nav-item">
                  <NavLink className="nav-link2 nav-link" to="/Resources">Resources</NavLink>
                </li>

              </>
            }

          </ul>
          <ul className="navbar-nav">
            {/* Button Display changes according to if user is logged in or not */}
            {props.user === null ?
              <div className="form-inline my-2 my-lg-0">
                <NavLink to="/Sign-in">
                  <button className="btn btn-custom my-2 my-sm-0" type="submit">Sign-in</button>
                </NavLink>
                <NavLink to="/Register">
                  <button className="btn btn-warning my-2 my-sm-0" type="submit" style={{ marginLeft: "5px" }}>Register</button>
                </NavLink>
              </div>
              :
              <>
                <li className="nav-item">
                  <span className="nav-link" style={{ color: "#112c3f" }}>Welcome, {props.user.name}</span>
                </li>
                <div className="form-inline my-2 my-lg-0">
                  <NavLink to="/Sign-in" onClick={props.logoutUser}>
                    <button className="btn btn-custom my-2 my-sm-0" type="submit">Logout</button>
                  </NavLink>
                </div>
              </>
            }
          </ul>
        </div>
      </div>
    </nav>

  );
}

// Export the Navigation Function
export default Navigation;