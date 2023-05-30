// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactSwitch from 'react-switch';
import { deleteUserDB, getSelectedId, getProfile, updateUser, getGroups, getClasses } from "../data/repository";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Functional Component for MyProfile
function AdminProfile(props) {

    const [confirmPopup, setconfirmPopup] = useState(false);
    const [errors, setErrors] = useState({});
    const [userProfile, setUsersProfile] = useState({ id: '', name: '', hashed_password: '', group: '', gender: '', class: '', studentEmail: '', jamaat: '', mothersName: '', mothersContact: '', mothersEmail: '', fathersContact: '', fathersEmail: '', fathersName: '' });
    const [staticUserProfile, setStaticUsersProfile] = useState({ id: '', name: '', hashed_password: '', group: '', gender: '', class: '' });
    const [checked, setChecked] = useState(false);
    const [message, setMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const location = useLocation();
    const { groupNumber, userProfilePage } = location.state ? location.state : {};
    const navigate = useNavigate();
    const [dropdownValues, setDropdownValues] = useState([]);
    const [selectedDropdownValue, setSelectedDropdownValue] = useState(userProfile?.group);
    const [classesDropdownValues, setClassesDropdownValues] = useState([]);
    const [selectedClassesDropdownValue, setSelectedClassesDropdownValue] = useState(userProfile?.class);

    // Load userProfile from DB.
    useEffect(() => {

        // Loads User Details from DB
        async function loadUserProfile() {
            const currentDetails = await getProfile(getSelectedId());
            setUsersProfile(currentDetails);
            setStaticUsersProfile(currentDetails);
            setChecked(currentDetails?.archived);
            setSelectedDropdownValue(currentDetails?.group);
            setSelectedClassesDropdownValue(currentDetails?.class);
        }

        async function loadGroups() {
            const currentGroups = await getGroups();
            setDropdownValues(currentGroups);
        }

        async function loadClasses() {
            const currentClasses = await getClasses();
            setClassesDropdownValues(currentClasses);
        }

        // Calls the functions above
        loadUserProfile();
        loadGroups();
        loadClasses();

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
        if (groupNumber === 6) {
            navigate("/Staff");
        } else {
            navigate(`/StudentGroup/${groupNumber}`);
        }
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

    // Handle the dropdown selection
    const handleDropdownChange = event => {
        setSelectedDropdownValue(event.target.value);
    };

    // Handle the classes dropdown selection
    const handleClassesDropdownChange = event => {
        setSelectedClassesDropdownValue(event.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    // Handler for form submission for when details are updated.
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form and if invalid do not contact API.
        const { trimmedValues, isValid } = await handleValidation();
        if (!isValid)
            return;

        trimmedValues.archived = userProfile?.archived;
        trimmedValues.group = selectedDropdownValue;
        trimmedValues.class = selectedClassesDropdownValue;

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
        value = key;
        if (value.length === 0)
            formErrors[key] = "Group field cannot be empty";

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

        key = "hashed_password";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Password field cannot be empty";

        if (userProfile?.group !== "Admin") {

            // Individual field Validation
            key = "class";
            value = key;
            if (value.length === 0)
                formErrors[key] = "Please select a class.";
        }

        if (userProfile?.group !== "Admin" && userProfile?.group !== "Male Teacher" && userProfile?.group !== "Female Teacher" && userProfile?.group !== "") {

            // Validation for Jama'at radio button Field
            key = "jamaat";
            value = trimmedValues[key];
            if (value.length === 0)
                formErrors[key] = "Please select a Jama'at.";

            // Validation for Fathers Email Field
            key = "fathersEmail";
            value = trimmedValues[key];
            if (value.length === 0)
                formErrors[key] = "Fathers Email address is required.";
            else if (value.length > 128)
                formErrors[key] = "Email length cannot be greater than 128.";
            else if (!/\S+@\S+\.\S+/.test(value))
                formErrors[key] = "Please enter a valid email address";

            // Validation for Fathers Name Field
            key = "fathersContact";
            value = trimmedValues[key];
            if (value.length === 0)
                formErrors[key] = "Fathers Phone Number is Required.";
            else if (value.length > 10)
                formErrors[key] = "Contact Number cannot be greater than 10.";

            // Validation for Mothers Name Field
            key = "mothersName";
            value = trimmedValues[key];
            if (value.length !== 0) {
                if (/\d+/.test(value))
                    formErrors[key] = "Mother Name cannot have any numbers.";
                else if (value === "Admin")
                    formErrors[key] = "Mother Name Cannot be Admin";
            }

            // Validation for Mothers Email Field
            key = "mothersEmail";
            value = trimmedValues[key];
            if (value.length !== 0) {
                if (value.length > 128)
                    formErrors[key] = "Email length cannot be greater than 128.";
                else if (!/\S+@\S+\.\S+/.test(value))
                    formErrors[key] = "Please enter a valid email address";
            }

            // Validation for Mothers Name Field
            key = "mothersContact";
            value = trimmedValues[key];
            if (value.length !== 0) {
                if (value.length > 10)
                    formErrors[key] = "Contact Number cannot be greater than 10.";
            }

        }

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
                                        {userProfile?.group === "Admin" && userProfile?.group === "Male Teacher" && userProfile?.group === "Female Teacher" &&
                                            <p>
                                                <strong>Class:</strong> {userProfile?.class}
                                            </p>
                                        }
                                        {userProfile?.group !== "Male Teacher" && userProfile?.group !== "Female Teacher" && userProfile?.group !== "Admin" && userProfile?.group !== "" &&
                                            <>
                                                <p>
                                                    <strong>Jamaat:</strong> {userProfile?.jamaat}
                                                </p>
                                                <p>
                                                    <strong>Father's Name:</strong> {userProfile?.fathersName}
                                                </p>
                                                <p>
                                                    <strong>Father's Contact:</strong> {userProfile?.fathersContact}
                                                </p>
                                                <p>
                                                    <strong>Father's Email:</strong> {userProfile?.fathersEmail}
                                                </p>
                                                <p>
                                                    <strong>Mother's Name:</strong> {userProfile?.mothersName}
                                                </p>
                                                <p>
                                                    <strong>Mother's Contact:</strong> {userProfile?.mothersContact}
                                                </p>
                                                <p>
                                                    <strong>Mother's Email:</strong> {userProfile?.mothersEmail}
                                                </p>
                                                <p>
                                                    <strong>Student Email:</strong> {userProfile?.studentEmail}
                                                </p>
                                                <p>
                                                    <strong>Student DOB:</strong> {userProfile?.studentDob}
                                                </p>
                                            </>
                                        }

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
                                        <>
                                            {groupNumber === 6 ?
                                                <Link to={"/Staff"}>
                                                    <button type="button" style={{ margin: "5px" }} className="text-center btn btn-success">
                                                        Go Back to Staff Page
                                                    </button>
                                                </Link>
                                                :
                                                <Link to={`/StudentGroup/${groupNumber}`}>
                                                    <button type="button" style={{ margin: "5px" }} className="text-center btn btn-success">
                                                        Go Back to Students Page
                                                    </button>
                                                </Link>
                                            }
                                        </>
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
                                            <input type="text" className="form-control" id="name" name="name" placeholder="Enter a New Name" value={userProfile?.name} onChange={handleInputChange} autoComplete="username" required />
                                            {errors.name && (
                                                <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.name}</p>
                                            )}
                                        </div>
                                        {/* Password Field */}
                                        <div className="form-group">
                                            <label htmlFor="hashed_password"><b>Password:</b></label>
                                            <div className="password-input-wrapper">
                                                <input type={showPassword ? "text" : "password"} className="form-control" id="hashed_password" name="hashed_password" placeholder="Enter a New Password" value={userProfile?.hashed_password} onChange={handleInputChange} autoComplete="current-password" required />
                                                {showPassword ? (
                                                    <FaEyeSlash className="password-icon" onClick={toggleShowPassword} />
                                                ) : (
                                                    <FaEye className="password-icon" onClick={toggleShowPassword} />
                                                )}
                                            </div>
                                            {errors.hashed_password && (
                                                <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.hashed_password}</p>
                                            )}
                                        </div>
                                        {/* Group Field */}
                                        <div className="form-group">
                                            <label htmlFor="group"><b>Group:</b></label>
                                            <select id="group" name="group" className="form-control" value={selectedDropdownValue} onChange={handleDropdownChange}>
                                                <option value="" disabled hidden>Select a Group</option>
                                                {dropdownValues.map(group => (
                                                    <option key={group.id} value={group.group}>{group.group}</option>
                                                ))}
                                            </select>
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
                                                <select id="class" name="class" value={selectedClassesDropdownValue} onChange={handleClassesDropdownChange}>
                                                    <option value="" disabled hidden>Select a Class</option>
                                                    {classesDropdownValues.map(classes => (
                                                        <option key={classes.id} value={classes.group}>{classes.class}</option>
                                                    ))}
                                                </select>
                                                {errors.class && (
                                                    <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.class}</p>
                                                )}
                                            </div>
                                        }
                                        {(userProfile.group !== "Male Teacher" && userProfile.group !== "Female Teacher" && userProfile.group !== "Admin" && userProfile?.group !== "") &&
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="jamaat"><b>Jama'at:</b></label>
                                                    <input type="text" className="form-control" id="jamaat" name="jamaat" placeholder="Enter a new Jama'at" value={userProfile.jamaat} onChange={handleInputChange} />
                                                    {errors.jamaat && (
                                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.jamaat}</p>
                                                    )}
                                                </div>
                                                {/* Student Email Field */}
                                                <div className="form-group">
                                                    <label htmlFor="studentEmail"><b>Student Email:</b></label>
                                                    <input type="email" className="form-control" id="studentEmail" name="studentEmail" placeholder="Enter a new student email" value={userProfile.studentEmail} onChange={handleInputChange} />
                                                    {errors.studentEmail && (
                                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.studentEmail}</p>
                                                    )}
                                                </div>
                                                {props.user.id === "Admin" &&
                                                    <>
                                                        {/* Fathers Name Field */}
                                                        <div className="form-group">
                                                            <label htmlFor="fathersName"><b>Fathers Name:</b></label>
                                                            <input type="text" className="form-control" id="fathersName" name="fathersName" placeholder="Enter a new fathers name" value={userProfile.fathersName} onChange={handleInputChange} />
                                                            {errors.fathersName && (
                                                                <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.fathersName}</p>
                                                            )}
                                                        </div>
                                                    </>
                                                }
                                                {/* Fathers Email Field */}
                                                <div className="form-group">
                                                    <label htmlFor="fathersEmail"><b>Fathers Email:</b></label>
                                                    <input type="email" className="form-control" id="fathersEmail" name="fathersEmail" placeholder="Enter a new fathers email" value={userProfile.fathersEmail} onChange={handleInputChange} />
                                                    {errors.fathersEmail && (
                                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.fathersEmail}</p>
                                                    )}
                                                </div>
                                                {/* Fathers Contact Field */}
                                                <div className="form-group">
                                                    <label htmlFor="fathersContact"><b>Fathers Contact:</b></label>
                                                    <input type="text" className="form-control" id="fathersContact" name="fathersContact" placeholder="Enter a new fathers contact" value={userProfile.fathersContact} onChange={handleInputChange} />
                                                    {errors.fathersContact && (
                                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.fathersContact}</p>
                                                    )}
                                                </div>
                                                {/* Mothers Name Field */}
                                                <div className="form-group">
                                                    <label htmlFor="mothersName"><b>Mothers Name:</b></label>
                                                    <input type="text" className="form-control" id="mothersName" name="mothersName" placeholder="Enter a new mothers name" value={userProfile.mothersName} onChange={handleInputChange} />
                                                    {errors.mothersName && (
                                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.mothersName}</p>
                                                    )}
                                                </div>
                                                {/* Mothers Email Field */}
                                                <div className="form-group">
                                                    <label htmlFor="mothersEmail"><b>Mothers Email:</b></label>
                                                    <input type="email" className="form-control" id="mothersEmail" name="mothersEmail" placeholder="Enter a new mothers email" value={userProfile.mothersEmail} onChange={handleInputChange} />
                                                    {errors.mothersEmail && (
                                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.mothersEmail}</p>
                                                    )}
                                                </div>
                                                {/* Mothers Contact Field */}
                                                <div className="form-group">
                                                    <label htmlFor="mothersContact"><b>Mothers Contact:</b></label>
                                                    <input type="text" className="form-control" id="mothersContact" name="mothersContact" placeholder="Enter a new mothers contact" value={userProfile.mothersContact} onChange={handleInputChange} />
                                                    {errors.mothersContact && (
                                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.mothersContact}</p>
                                                    )}
                                                </div>
                                            </>
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