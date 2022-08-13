
// Importing React classes and functions from node modules
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { findUser, createUser, setUser } from "../data/repository";
import MessageContext from "../data/MessageContext";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// Functional Component for Signup Page
function Sign_up(props) {

    // State Variables Declaration for useState and useContext Hooks
    const history = useNavigate();
    const [values, setValues] = useState({ name: "", username: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const { setMessage } = useContext(MessageContext);
    const [startDate, setStartDate] = useState(new Date());

    // Generic change handler.
    const handleInputChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    // Handler for form Submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form and if invalid do not contact API.
        const { trimmedValues, isValid } = await handleValidation();
        if (!isValid)
            return;

        // Create user.
        const user = await createUser(trimmedValues);

        // Show success message.
        setMessage(
            <>
                <strong>{user.name}</strong> You have successfully registered!
            </>);

        // Set user state.
        props.loginUser(user);

        // After user signs up save state and Keep user logged in.
        setUser(user);

        // Navigate to the home page.
        history.push("/");
    };

    // Handler for Validating SignUp Input Fields
    const handleValidation = async () => {
        const trimmedValues = trimFields();
        const formErrors = {};

        // Validation for Name Field
        let key = "name";
        let value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Name is required.";
        else if (value.length > 40)
            formErrors[key] = "Name length cannot be greater than 40.";

        // Validation for Username Field
        key = "username";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Username is required.";
        else if (value.length > 32)
            formErrors[key] = "Username length cannot be greater than 32.";

        // Validation for Email Field
        key = "email";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Email address is required.";
        else if (value.length > 128)
            formErrors[key] = "Email length cannot be greater than 128.";
        else if (!/\S+@\S+\.\S+/.test(value))
            formErrors[key] = "Please enter a valid email address";
        else if (await findUser(trimmedValues.email) !== null)
            formErrors[key] = "Email is already registered.";

        // Validation for Password Field
        key = "password";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Password is required.";
        else if (value.length < 6)
            formErrors[key] = "Password must contain at least 6 characters.";
        else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[^ ]{6,}/.test(value))
            formErrors[key] = "Password must meet requirements!";

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

        // Signup Form Code using normal HTML elements
        <div>
            <h1 className="text-center mb-3" style={{ padding: "50px 20px 0 20px" }}>Sign Up</h1>
            <hr style={{ width: "50%", marginBottom: "20px", borderWidth: "1px", backgroundColor: "#5dc7d8" }} />
            <p>&nbsp;</p>
            <form className="sign-up-form" onSubmit={handleSubmit} noValidate>
                {/* Email Field */}
                <div className="form-group">
                    <label htmlFor="email"><b>Email:</b></label>
                    <input type="email" className="form-control" id="email" name="email" placeholder="Please enter your email" value={values.email} onChange={handleInputChange} required />
                    {errors.email && (
                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.email}</p>
                    )}
                </div>
                {/* Name Field */}
                <div className="form-group">
                    <label htmlFor="name"><b>Full name:</b></label>
                    <input type="text" className="form-control" id="name" name="name" placeholder="Please enter your Full name" value={values.name} onChange={handleInputChange} required />
                    {errors.name && (
                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.name}</p>
                    )}
                </div>
                {/* Username Field */}
                <div className="form-group">
                    <label htmlFor="name"><b>Date of Birth:</b></label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    <input type="text" className="form-control" id="username" name="username" placeholder="Day/Month/Year" value={values.username} onChange={handleInputChange} required />
                    {errors.username && (
                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.username}</p>
                    )}
                </div>
                {/* Password Field */}
                <div className="form-group">
                    <label htmlFor="password"><b>Password:</b></label>
                    <input type="password" className="form-control" id="password" name="password" placeholder="Please enter a Password" value={values.password} onChange={handleInputChange} required />
                    <small id="emailHelp" className="form-text text-muted" style={{ fontWeight: "bold" }}>Password must be 6 characters, mix of upper and lowercase, numbers and punctuation</small>
                    {errors.password && (
                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.password}</p>
                    )}
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>

            </form>
        </div>
    );
}

// Export the sign-up Function
export default Sign_up;