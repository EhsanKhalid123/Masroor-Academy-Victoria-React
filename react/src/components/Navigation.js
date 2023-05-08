// Importing React classes and functions from node modules
import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

// Functional Component for Navigation Bar
function Navigation(props) {

  const location = useLocation();
  let userProfilePage = "allUserProfile";
  let userProfileId = props.user?.id;

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
    <nav className="navbar navbar-expand-xl navbar-light" style={{ backgroundColor: "#f0f0f0" }}>
      <div className="container-fluid">
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
                      <NavLink className="nav-link2 nav-link" to="/SelectGroupAttendance">Attendance</NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink className="nav-link2 nav-link" to="/SelectGroupHomework">Homework</NavLink>
                    </li>

                    {/* <li className="nav-item">
                      <NavLink className="nav-link2 nav-link" to="/SelectGroupStudent">Students</NavLink>
                    </li> */}

                    <li className="nav-item dropdown">
                      <div className="nav-link nav-link2 dropdown-toggle exclude" style={{ color: "#112c3f" }} id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Students
                      </div>
                      <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <Link className="dropdown-item" to="/SelectGroupStudent">Individual Student Profile & Results</Link>
                        <Link className="dropdown-item" to="/">All Student Results</Link>
                      </div>
                    </li>

                  </>
                }

                {(props.user.group !== "Male Teacher" && props.user.group !== "Female Teacher" && props.user.group !== "Admin") &&
                  <li className="nav-item">
                    <NavLink className="nav-link2 nav-link" to="/Syllabus">Syllabus</NavLink>
                  </li>
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
                <div className="navbar-nav">
                  <li className="nav-item dropdown">
                    <div className="nav-link dropdown-toggle" style={{ color: "#112c3f" }} id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Welcome, {props.user.name}
                    </div>
                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                      <Link className="dropdown-item" style={{ color: "#112c3f" }} to="/Profile" state={{ userProfilePage, userProfileId }}>My Profile</Link>
                      {props.user.group === "Admin" &&
                        <>
                          <Link className="dropdown-item" style={{ color: "#112c3f" }} to="/Staff">Staff</Link>
                          <Link className="dropdown-item" style={{ color: "#112c3f" }} to="/CreateStaffUser">Create Staff User</Link>
                          <Link className="dropdown-item" style={{ color: "#112c3f" }} to="/Settings">Settings</Link>
                        </>
                      }
                      <div className="dropdown-divider"></div>
                      <NavLink to="/Sign-in" className="dropdown-item" style={{ color: "#112c3f" }} onClick={props.logoutUser}>Logout</NavLink>
                    </div>
                  </li>
                </div>
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