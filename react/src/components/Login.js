
// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyUser, updateUser } from "../data/repository";
import jwtDecode from 'jwt-decode'

// Functional Component for Login Page
function Login(props) {
    // Declaration of useState Variables and Hook
    const history = useNavigate();
    const [fields, setFields] = useState({ id: "", password: "" });
    const [errorMessage, setErrorMessage] = useState(null);
    const [message, setMessage] = useState(null);
    const [confirmPopup, setconfirmPopup] = useState(false);
    const [values, setValues] = useState({ hashed_password: "" });
    const [errors, setErrors] = useState({});
    const [messageError, setMessageError] = useState(null);

    useEffect(() => {
        // get message from local storage
        const storedMessage = localStorage.getItem("inactiveMessage");
        if (storedMessage) {
            setMessage(storedMessage);

            // set timer to remove message after 5 seconds
            const timer = setTimeout(() => {
                setMessage(null);
                // remove message from local storage
                localStorage.removeItem("inactiveMessage");
            }, 5000);

            // clean up timer on unmount
            return () => clearTimeout(timer);
        }
    }, []);


    // Generic change handler.
    const handleInputChange = (event) => {
        setFields({ ...fields, [event.target.id]: event.target.value });
    };

    const handleInputPasswordChange = (event) => {
        const { id, value } = event.target;
        setValues({ ...values, [id]: value });
    };

    // Popup Toggle Switch Function
    const togglePopup = () => {
        setconfirmPopup(!confirmPopup);
    }


    const handleCancel = () => {
        props.logoutUser();
        setconfirmPopup(!confirmPopup);
    };

    // Handler runs when login button is clicked
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            //  Get user details from DB
            const token = await verifyUser(fields.id, fields.password);

            //  If user email does not exit
            if (token === null) {
                // Login failed, reset password field to blank and set error message.
                setFields({ ...fields, password: "" });
                setErrorMessage("ID and / or password invalid, please try again.");
                return;
            }

            const user = jwtDecode(token);

            // Set user state.
            if (user.archived === false) {

                // Check if forcePasswordLogin is true
                if (user.forcePasswordChange) {
                    togglePopup(); // Show a modal/pop-up for password change
                    return;
                }

                // Set user as logged in, loginUser function is called from App.js
                props.loginUser(token);

                // Navigate to the home page.
                history("/Dashboard");

                // User is no longer a member or graduated or dropped out then disabled the account
            } else if (user.archived === true) {
                setErrorMessage("ID and / or password invalid. If your account has existed in the past please contact masrooracademyvic1@gmail.com");
                return;
            }


        } catch (error) {
            setErrorMessage("Failed to connect to server. Please try again later. If the error persists please contact masrooracademyvic1@gmail.com");
        }
    }


    // Handler for form Submission
    const handlePasswordChange = async (event) => {
        event.preventDefault();

        // Validate form and if invalid do not contact API.
        const { trimmedValues, isValid } = await handleValidation();
        if (!isValid) {
            return;
        }

        try {

            trimmedValues.archived = false;
            trimmedValues.forcePasswordChange = false;
            // Create user.
            await updateUser(trimmedValues, fields.id);

            setErrors("");
            setValues("");

            togglePopup(!confirmPopup);

            // Navigate to the home page.
            history("/Dashboard");

            window.location.reload();

        } catch (error) {
            setMessageError(<>Error: Password Could Not be Changed!</>)
        }

    };

    // Handler for Validating SignUp Input Fields
    const handleValidation = async () => {
        const trimmedValues = trimFields();
        const formErrors = {};

        // Validation for group Field
        let key = "hashed_password";
        let value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Password cannot be empty.";

        // Sets Errors If any Validation Fails
        setErrors(formErrors);

        return { trimmedValues, isValid: Object.keys(formErrors).length === 0 };
    };

    // Trim Fields Function to trim all spaces from the trimmedValues constant recieved from other function.
    const trimFields = () => {
        const trimmedValues = {};
        Object.keys(values).map(key => trimmedValues[key] = values[key].trim());
        setValues(trimmedValues);

        return trimmedValues;
    };

    // Returns HTML elements and content to display on the pages
    return (

        // Code adapted from Official Bootstrap Documents:
        // https://getbootstrap.com/docs/4.0/components/forms/
        <>
            {/* Login Form Code */}
            <div>
                {message && <div className="alert alert-danger text-center" style={{ margin: "20px" }} role="alert">{message}</div>}
                <h1 className="text-center mb-3" style={{ padding: "50px 20px 0 20px", color: "#112c3f" }}>Sign In</h1>
                <hr style={{ width: "50%", marginBottom: "20px", borderWidth: "1px", backgroundColor: "#aa0001" }} />
                <p>&nbsp;</p>
                <form className="login-form" onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="id">ID:</label>
                        <input type="text" className="form-control" id="id" name="id" placeholder="Please enter your ID" autoComplete="id" value={fields.id} onChange={handleInputChange} />
                    </div>
                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" className="form-control" id="password" name="password" placeholder="Please enter your Password" autoComplete="current-password" value={fields.password} onChange={handleInputChange} />
                    </div>
                    <button type="submit" className="btn btn-custom">Login</button>

                    {/* Error Message */}
                    {errorMessage !== null &&
                        <div className="form-group" style={{ textAlign: "center", margin: "50px 10px 10px 10px" }} onChange={handleInputChange}>
                            <span className="text-danger" style={{ textAlign: "center", fontSize: "20px", wordWrap: "break-word" }}>{errorMessage}</span>
                        </div>
                    }
                </form>
            </div>

            <div>
                {/* Popup box only opens if state variable is set to true for deleting account */}
                {confirmPopup &&
                    <div className="popup-box">
                        <div className="box">
                            <h5 className="card-header bg-warning text-center" style={{ color: "white" }}><b>Change Password!</b></h5>
                            <div style={{ margin: "0 auto", textAlign: "center" }}>
                                <form onSubmit={handlePasswordChange} noValidate>
                                    <p style={{ padding: "15px", textAlign: "center", color: "red" }}>You must change your password on first logon as everyone else will have the same password for initial login</p>
                                    <div className="form-group">
                                        <label htmlFor="hashed_password"><b>New Password:</b></label>
                                        <input type="password" className="form-control" id="hashed_password" name="hashed_password" placeholder="Enter a new Password " value={values.hashed_password || ""} onChange={handleInputPasswordChange} autoComplete="new-password" required />
                                        {errors.hashed_password && (
                                            <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.hashed_password}</p>
                                        )}
                                    </div>
                                    {messageError && <div className="alert alert-danger" style={{ margin: "20px" }} role="alert">{messageError}</div>}
                                    <button onClick={handleCancel} className="btn btn-info" style={{ margin: "10px" }}>Cancel</button>
                                    <button className="btn btn-danger" style={{ margin: "10px" }}>Confirm</button>
                                </form>
                            </div>
                        </div>
                    </div>
                }
            </div>

        </>
    );
}

// Export the Login Function
export default Login;