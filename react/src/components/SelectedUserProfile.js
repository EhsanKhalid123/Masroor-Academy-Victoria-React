// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactSwitch from 'react-switch';
import { deleteUserDB, getSelectedId, getProfile, updateUser } from "../data/repository";

// Functional Component for MyProfile
function AdminProfile(props) {

    const [confirmPopup, setconfirmPopup] = useState(false);
    const [errors, setErrors] = useState({});
    const [userProfile, setUsersProfile] = useState({ id: '', name: '', hashed_password: '', group: '', gender: '', class: '' });
    const [staticUserProfile, setStaticUsersProfile] = useState({ id: '', name: '', hashed_password: '', group: '', gender: '', class: '' });
    const [checked, setChecked] = useState(false);
    const [message, setMessage] = useState(null);
    const location = useLocation();
    const { groupNumber, userProfilePage } = location.state ? location.state : {};
    const navigate = useNavigate();

    // Load userProfile from DB.
    useEffect(() => {

        // Loads User Details from DB
        async function loadUserProfile() {
            const currentDetails = await getProfile(getSelectedId());
            setUsersProfile(currentDetails);
            setStaticUsersProfile(currentDetails);
            setChecked(currentDetails?.archived);
        }

        // Calls the functions above
        loadUserProfile();

        if (message === null)
            return;

        // Time limit for message to display
        const id = setTimeout(() => setMessage(null), 3000);

        // When message changes clear the queued timeout function.
        return () => clearTimeout(id);

    }, [message]);

    // Popup Toggle Switch Function
    const togglePopup = () => {
        setconfirmPopup(!confirmPopup);
    }

    // Delete Profile Function Removes user from Database
    const deleteProfile = async (event) => {
        const currentDetails = await getProfile(getSelectedId());

        await deleteUserDB(currentDetails);

        togglePopup();

        navigate(`/StudentGroup/${groupNumber}`);
    }

    const handleToggleChange = async (event) => {
        setChecked(event);
        // Update the archived value in the userProfile object
        setUsersProfile({ ...userProfile, archived: event });
    }

    // Generic change handler.
    const handleInputChange = (event) => {
        setUsersProfile({ ...userProfile, [event.target.name]: event.target.value });
        setErrors("");
    };

    // Handler for form submission for when details are updated.
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form and if invalid do not contact API.
        const { trimmedValues, isValid } = await handleValidation();
        if (!isValid)
            return;

        trimmedValues.archived = userProfile?.archived;

        // update user.
        await updateUser(trimmedValues, userProfile.id, props.user.id);

        setMessage(
            <>
                User Details Updated Successfully.
            </>);

    };

    // Validation Handler for sanitizing and validating input fields
    const handleValidation = async () => {
        const trimmedValues = trimFields();
        const formErrors = {};

        // Individual field Validation
        let key = "name";
        let value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Name field cannot be empty";

        // Individual field Validation
        key = "group";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Group field cannot be empty";
        else if (staticUserProfile.group === "Admin" || staticUserProfile.group === "Male Teacher" || staticUserProfile.group === "Female Teacher") {
            if (value !== "Admin" && value !== "Male Teacher" && value !== "Female Teacher") {
                formErrors[key] = "Group can only be Admin or Male Teacher or Female Teacher";
            }
        } else if (staticUserProfile.group === "14-15 (Group 4)" || staticUserProfile.group === "12-13 (Group 3)" || staticUserProfile.group === "9-11 (Group 2)" || staticUserProfile.group === "7-8 (Group 1)") {
            if (value !== "14-15 (Group 4)" && value !== "12-13 (Group 3)" && value !== "9-11 (Group 2)" && value !== "7-8 (Group 1)") {
                formErrors[key] = "Group can only be 14-15 (Group 4) or 12-13 (Group 3) or 9-11 (Group 2) or 7-8 (Group 1) ";
            }
        }

        // Individual field Validation
        key = "gender";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Gender field cannot be empty";
        else if (staticUserProfile.gender === "Male" || staticUserProfile.gender === "Female") {
            if (value !== "Male" && value !== "Female") {
                formErrors[key] = "Gender can only be Male or Female";
            }
        } else if (staticUserProfile.gender === "Atfal" || staticUserProfile.gender === "Nasirat") {
            if (value !== "Atfal" && value !== "Nasirat") {
                formErrors[key] = "Gender can only be Nasirat or Atfal";
            }
        }

        key = "class";
        value = trimmedValues[key];
        if (value !== null && value !== undefined) {
            if (value.length === 0)
                formErrors[key] = "Class field cannot be empty";
            else if (value !== "Holy Quran" && value !== "Ahmadiyyat" && value !== "Islam" && value !== "Namaz")
                formErrors[key] = "Class can only be Holy Quran or Ahmadiyyat or Islam or Namaz";
        }

        key = "hashed_password";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Password field cannot be empty";

        // Sets Errors If any Validation Fails
        setErrors(formErrors);

        return { trimmedValues, isValid: Object.keys(formErrors).length === 0 };
    };

    // Trim Fields Function to trim all spaces from the trimmedValues constant recieved from other function.
    const trimFields = () => {
        const trimmedValues = {};
        Object.keys(userProfile).map(key => {
            const value = userProfile[key];
            if (typeof value === 'string') {
                trimmedValues[key] = value.trim();
            } else {
                trimmedValues[key] = value;
            }
            return null;
        });
        setUsersProfile(trimmedValues);

        return trimmedValues;
    };

    // Returns HTML elements and contents to display on page
    return (

        <div>

            {/* Profile View Showed to Staff Members and Only Additional Tools Section is Displayed to Admin Staff */}
            {userProfilePage === "userProfile" && (
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <h5 className="card-header card text-white bg-info">Profile Info</h5>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-3">
                                        <img
                                            className="rounded-circle profileImage"
                                            src={process.env.PUBLIC_URL + "assets/images/profileImage.png"}
                                            alt="Account Icon"
                                        />
                                    </div>

                                    <div className="col-md-9">
                                        <h2 className="mb-0"> {userProfile?.name}</h2>
                                        <p className="lead">
                                            <b style={{ fontWeight: "bold" }}>ID:</b> {userProfile?.id}
                                        </p>
                                        <hr />
                                        <p>
                                            <strong>Group:</strong> {userProfile?.group}
                                        </p>
                                        <p>
                                            <strong>Gender:</strong> {userProfile?.gender}
                                        </p>
                                        {props.user.group === "Admin" &&
                                            <p>
                                                <strong>Archived:</strong> {userProfile?.archived ? "true" : "false"}
                                            </p>
                                        }
                                    </div>
                                    <div style={{ margin: "auto" }}>
                                        {(props.user.group === "Admin" && props.user.id === "Admin") &&
                                            <>
                                                <button onClick={togglePopup} className="btn btn-danger">
                                                    Delete User
                                                </button>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="text-center">
                                    {userProfilePage === "userProfile" &&
                                        <Link to={`/StudentGroup/${groupNumber}`}>
                                            <button type="button" style={{ margin: "5px" }} className="text-center btn btn-success">
                                                Go Back to Students Page
                                            </button>
                                        </Link>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {props.user.group === "Admin" &&
                        <div className="col-md-6 mt-custom">
                            <div className="card">
                                <h5 className="card-header card text-white bg-info">Edit Profile</h5>
                                <div className="card-body">

                                    {/* ID Field */}
                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="form-group">
                                            <label htmlFor="id"><b>ID:</b></label>
                                            <input type="text" className="form-control" id="id" name="id" placeholder="Your ID" value={userProfile?.id} disabled />
                                        </div>
                                        {/* Name Field */}
                                        <div className="form-group">
                                            <label htmlFor="name"><b>Name:</b></label>
                                            <input type="text" className="form-control" id="name" name="name" placeholder="Enter a New Name" value={userProfile?.name} onChange={handleInputChange} required />
                                            {errors.name && (
                                                <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.name}</p>
                                            )}
                                        </div>
                                        {/* Password Field */}
                                        <div className="form-group">
                                            <label htmlFor="name"><b>Password:</b></label>
                                            <input type="text" className="form-control" id="password" name="password" placeholder="Enter a New Password" value={userProfile?.hashed_password} onChange={handleInputChange} disabled />
                                            {errors.hashed_password && (
                                                <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.hashed_password}</p>
                                            )}
                                        </div>
                                        {/* Group Field */}
                                        <div className="form-group">
                                            <label htmlFor="group"><b>Group:</b></label>
                                            <input type="text" className="form-control" id="group" name="group" placeholder="Enter a New Group" value={userProfile?.group} onChange={handleInputChange} required />
                                            {errors.group && (
                                                <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.group}</p>
                                            )}
                                        </div>
                                        {/* Gender Field */}
                                        <div className="form-group">
                                            <label htmlFor="gender"><b>Gender:</b></label>
                                            <input type="text" className="form-control" id="gender" name="gender" placeholder="Enter a New Gender" value={userProfile?.gender} onChange={handleInputChange} required />
                                            {errors.gender && (
                                                <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.gender}</p>
                                            )}
                                        </div>
                                        {(userProfile.group === "Male Teacher" || userProfile.group === "Female Teacher") &&
                                            <div className="form-group">
                                                <label htmlFor="class"><b>Class:</b></label>
                                                <input type="text" className="form-control" id="class" name="class" placeholder="Enter a New Class" value={userProfile?.class} onChange={handleInputChange} required />
                                                {errors.class && (
                                                    <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.class}</p>
                                                )}
                                            </div>
                                        }
                                        <div className="form-group">
                                            <label htmlFor="gender"><b>Archived:</b></label> <br />
                                            <ReactSwitch checked={checked} onChange={handleToggleChange} />
                                        </div>
                                        <button type="submit" className="btn btn-primary" style={{ margin: "10px", textAlign: "center" }}>Save</button>
                                        {message && <div className="alert alert-success" style={{ margin: "20px" }} role="alert">{message}</div>}
                                    </form>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            )}

            <div>
                {/* Popup box only opens if state variable is set to true for deleting account */}
                {confirmPopup &&
                    <div className="popup-box">
                        <div className="box">
                            <h5 className="card-header bg-warning text-center" style={{ color: "white" }}><b>Confirm!</b></h5>
                            <div style={{ margin: "0 auto", textAlign: "center" }}>
                                <p style={{ padding: "15px", textAlign: "center", color: "red" }}>Are you sure you want delete this users account <br /> This action cannot be undone!</p>
                                <button onClick={togglePopup} className="btn btn-info" style={{ margin: "10px" }}>Cancel</button>
                                <button onClick={deleteProfile} className="btn btn-danger" style={{ margin: "10px" }}>Delete</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <p>&nbsp;</p>
        </div>
    );
}

// Export the MyProfile Function
export default AdminProfile;