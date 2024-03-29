// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { getClasses } from "../data/repository";
import MANavLogo from "../assets/images/Masroor Academy Logo.png";

// Functional Component for Navigation Bar
function Navigation(props) {

  const [classes, setClassData] = useState([]);
  const location = useLocation();
  let userProfilePage = "allUserProfile";
  let userProfileId = props.user?.id;

  // Load users from DB.
  useEffect(() => {

    // Loads User Details from DB
    if (props.user !== null) {
      async function loadclassDetails() {
        const currentClasses = await getClasses();
        setClassData(currentClasses);
      }


      // Calls the functions above
      loadclassDetails();
    }

  }, [props.user]);

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
          <img className="navbar-brand" src={MANavLogo} width="50px" alt="Logo for Masroor Academy" />
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
                {(props.user.group === "Male Teacher" || props.user.group === "Female Teacher" || props.user.group === "Admin" || props.user.group === "Principal") &&
                  <>

                    <li className="nav-item">
                      <NavLink className="nav-link2 nav-link" to="/Announcements">Annoucements</NavLink>
                    </li>

                    {(props.user.group === "Admin" || props.user.group === "Principal") ?
                      <>
                        <li className="nav-item dropdown">
                          <div className="nav-link nav-link2 dropdown-toggle exclude" style={{ color: "#112c3f" }} id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Attendance
                          </div>
                          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link className="dropdown-item" to="/SelectGroupAttendance">Mark Student Attendance</Link>
                            <Link className="dropdown-item" to="/AttendanceStaff">Mark Staff Attendance</Link>
                            <Link className="dropdown-item" to="/ViewAttendance">View Attendance Records</Link>
                          </div>
                        </li>
                      </>
                      :
                      <li className="nav-item">
                        <NavLink className="nav-link2 nav-link" to="/SelectGroupAttendance">Attendance</NavLink>
                      </li>
                    }

                    <li className="nav-item dropdown">
                      <div className="nav-link nav-link2 dropdown-toggle exclude" style={{ color: "#112c3f" }} id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Homework
                      </div>
                      <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        {(props.user.group === "Admin" || (props.user.group === "Principal" && props.user.gender === "Male")) &&
                          <>
                            <Link className="dropdown-item" to="/CreateHomework">Create Homework</Link>
                            <Link className="dropdown-item" to="/DisplayHomework">Display Homework</Link>
                          </>
                        }
                        <Link className="dropdown-item" to="/SelectGroupHomework">Post Homework</Link>
                        {props.user.class ? (
                          // Display class name as a link
                          <Link className="dropdown-item" to="/SelectGroupMarkHomework" state={{ homeworkClasses: props.user.class }}>{props.user.class}</Link>
                        ) : (
                          // Display groups with links to each group
                          classes.map(classes => (
                            <Link key={classes.id} className="dropdown-item" to="SelectGroupMarkHomework" state={{ homeworkClasses: classes.class }} >{classes.class}</Link>
                          ))
                        )}
                      </div>
                    </li>

                    <li className="nav-item dropdown">
                      <div className="nav-link nav-link2 dropdown-toggle exclude" style={{ color: "#112c3f" }} id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Students
                      </div>
                      <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <Link className="dropdown-item" to="/SelectGroupStudent">Student Profiles </Link>
                        <Link className="dropdown-item" to="/SelectGroupResults">Student Results</Link>
                        {(props.user.group === "Admin" || (props.user.group === "Principal" && props.user.gender === "Male")) &&
                          <Link className="dropdown-item" to="/DisplayResults">Results Data</Link>
                        }
                        <Link className="dropdown-item" to="/Syllabus">Syllabus</Link>
                      </div>
                    </li>

                  </>
                }

                {(props.user.group !== "Male Teacher" && props.user.group !== "Female Teacher" && props.user.group !== "Admin" && props.user.group !== "Principal") &&
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link2 nav-link" to="/Syllabus">Syllabus</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link2 nav-link" to="/StudentResults">Results</NavLink>
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
                <div className="navbar-nav">
                  <li className="nav-item dropdown">
                    <div className="nav-link dropdown-toggle" style={{ color: "#112c3f" }} id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Welcome, {props.user.name}
                    </div>
                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                      <Link className="dropdown-item" style={{ color: "#112c3f" }} to="/Profile" state={{ userProfilePage, userProfileId }}>My Profile</Link>
                      {(props.user.group === "Admin" || props.user.group === "Principal") &&
                        <>
                          <Link className="dropdown-item" style={{ color: "#112c3f" }} to="/Staff">View Staff</Link>
                          <Link className="dropdown-item" style={{ color: "#112c3f" }} to="/CreateStaffUser">Create Staff User</Link>
                          {(props.user.group !== "Principal" || props.user.gender !== "Female") &&
                            <>
                              <Link className="dropdown-item" style={{ color: "#112c3f" }} to="/ViewGroup">View Groups</Link>
                              <Link className="dropdown-item" style={{ color: "#112c3f" }} to="/CreateGroup">Create Groups</Link>
                              <Link className="dropdown-item" style={{ color: "#112c3f" }} to="/ViewClass">View Classes</Link>
                              <Link className="dropdown-item" style={{ color: "#112c3f" }} to="/CreateClass">Create Classes</Link>
                            </>
                          }
                          <Link className="dropdown-item" style={{ color: "#112c3f" }} to="/Register">Create Student</Link>
                          {(props.user.group !== "Principal" || props.user.gender !== "Female") &&
                            <Link className="dropdown-item" style={{ color: "#112c3f" }} to="/Settings">Settings</Link>
                          }
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