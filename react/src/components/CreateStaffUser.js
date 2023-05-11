
// Importing React classes and functions from node modules
import React, { useState, useEffect, useRef } from "react";
import { createUser, getProfile } from "../data/repository";

// Functional Component for Create Staff User Page
function CreateStaffUser(props) {

    // State Variables Declaration for useState and useContext Hooks
    const [values, setValues] = useState({ id: "", name: "", hashed_password: "", group: "", gender: "", class: "", archived: false });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [messageError, setMessageError] = useState(null);
    const userInputRef = useRef(null);

    // Set message to null automatically after a period of time.
    useEffect(() => {
        if (message === null) {
            return;
        }

        // Time limit for message to display
        const id = setTimeout(() => setMessage(null), 5000);

        // When message changes clear the queued timeout function.
        return () => clearTimeout(id);
    }, [message]);

    // Set messageError to null automatically after a period of time.
    useEffect(() => {
        if (messageError === null) {
            return;
        }

        // Time limit for messageError to display
        const id = setTimeout(() => setMessageError(null), 5000);

        // When messageError changes clear the queued timeout function.
        return () => clearTimeout(id);
    }, [messageError]);

    // Generic change handler.
    const handleInputChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
        setErrors("");
    };

    // Handler for form Submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form and if invalid do not contact API.
        const { trimmedValues, isValid } = await handleValidation();
        if (!isValid) {
            // scroll to the first user input box
            userInputRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            });
            return;
        }

        try {
            const { id, ...otherValues } = trimmedValues;
            const updatedTrimmedValues = {
                id: id.toUpperCase(),
                ...otherValues
            };

            // Create user.
            await createUser(updatedTrimmedValues);

            // Clear all errors and fields
            setValues({ id: "", name: "", hashed_password: "", group: "", gender: "", class: "", archived: false });
            setErrors("");
            // Show success message.
            setMessage(
                <>
                    New Staff User has been Created.
                </>);
        } catch (error) {
            setMessageError(<>Error: New Staff User Could Not be Created!</>)
        }
    };

    // Handler for Validating SignUp Input Fields
    const handleValidation = async () => {
        const trimmedValues = trimFields();
        const formErrors = {};

        let key = "id";
        let value = trimmedValues[key];
        // const user = await findUser(value);
        if (value.length === 0)
            formErrors[key] = "ID is required.";
        else if (value === "Admin")
            formErrors[key] = "ID Cannot be Admin";
        else if (await getProfile(value) !== null) {
            formErrors[key] = "User already exists with this ID.";
        }

        // Validation for Name Field
        key = "name";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Full Name is required.";

        // Validation for Password Field
        key = "hashed_password";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Password is required.";

        // Validation for Group Field
        key = "group";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Group cannot be empty.";
        else if (value !== "Admin" && value !== "Male Teacher" && value !== "Female Teacher") {
            formErrors[key] = "Group can only be Admin or Male Teacher or Female Teacher";
        }

        // Validation for Gender Field
        key = "gender";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Gender cannot be empty.";
        else if (value !== "Male" && value !== "Female") {
            formErrors[key] = "Gender can only be Male or Female";
        }

        // Validation for Class Field
        key = "class";
        value = trimmedValues[key];
        if (value.length > 0) {
            if (value !== "Islam" && value !== "Ahmadiyyat" && value !== "Holy Quran" && value !== "Namaz")
                formErrors[key] = "Class can only be Islam, Ahmadiyyat, Holy Quran and Namaz.";
        } else if (value.length === 0)
            value = null;

        // Sets Errors If any Validation Fails
        setErrors(formErrors);

        return { trimmedValues, isValid: Object.keys(formErrors).length === 0 };
    };

    // Trim Fields Function to trim all spaces from the trimmedValues constant recieved from other function.
    const trimFields = () => {
        const trimmedValues = {};
        // Object.keys(values).map(key => trimmedValues[key] = values[key].trim());
        Object.keys(values).map(key => {
            const value = values[key];
            if (typeof value === 'string') {
                trimmedValues[key] = value.trim();
            } else {
                trimmedValues[key] = value;
            }
            return null;
        });
        setValues(trimmedValues);

        return trimmedValues;
    };



    // Returns HTML elements and content to display on the pages
    return (

        // Signup Form Code using normal HTML elements
        <>
            <br />
            <h1 className="text-center mb-3" style={{ padding: "50px 20px 0 20px" }}>Create Staff User</h1>
            <hr style={{ width: "50%", marginBottom: "20px", borderWidth: "1px", backgroundColor: "#5dc7d8" }} />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 mt-custom">
                        <div className="card">
                            <h5 className="card-header card text-white bg-info">Create New Staff User</h5>
                            <div className="card-body text-center">
                                <div className="col-md-3" style={{ display: "block", margin: "auto" }}>
                                    <img
                                        className="rounded-circle profileImage"
                                        src={process.env.PUBLIC_URL + "assets/images/profileImage.png"}
                                        alt="Account Icon"
                                    />
                                    <br />
                                </div>
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="form-group">
                                        <label htmlFor="id"><b>ID:</b></label>
                                        <input type="text" className="form-control" id="id" name="id" placeholder="Enter an ID eg. A-001" ref={userInputRef} value={values.id} onChange={handleInputChange} required />
                                        {errors.id && (
                                            <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.id}</p>
                                        )}
                                    </div>
                                    {/* Name Field */}
                                    <div className="form-group">
                                        <label htmlFor="name"><b>Full Name:</b></label>
                                        <input type="text" className="form-control" id="name" name="name" placeholder="Enter a Full Name" value={values.name} onChange={handleInputChange} required />
                                        {errors.name && (
                                            <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div className="form-group">
                                        <label htmlFor="name"><b>Password:</b></label>
                                        <input type="text" className="form-control" id="hashed_password" name="hashed_password" placeholder="Enter a Password" value={values.hashed_password} onChange={handleInputChange} required />
                                        {errors.hashed_password && (
                                            <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.hashed_password}</p>
                                        )}
                                    </div>
                                    {/* Group Field */}
                                    <div className="form-group">
                                        <label htmlFor="group"><b>Group:</b></label>
                                        <input type="text" className="form-control" id="group" name="group" placeholder="Admin, Male Teacher or Female Teacher" value={values.group} onChange={handleInputChange} required />
                                        {errors.group && (
                                            <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.group}</p>
                                        )}
                                    </div>
                                    {/* Gender Field */}
                                    <div className="form-group">
                                        <label htmlFor="gender"><b>Gender:</b></label>
                                        <input type="text" className="form-control" id="gender" name="gender" placeholder="Male or Female" value={values.gender} onChange={handleInputChange} required />
                                        {errors.gender && (
                                            <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.gender}</p>
                                        )}
                                    </div>
                                    {/* Class Field */}
                                    <div className="form-group">
                                        <label htmlFor="class"><b>Class:</b></label>
                                        <input type="text" className="form-control" id="class" name="class" placeholder="Holy Quran, Ahmadiyyat, Islam, Namaz" value={values.class} onChange={handleInputChange} />
                                        {errors.class && (
                                            <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.class}</p>
                                        )}
                                    </div>


                                    <button type="submit" className="btn btn-primary" style={{ margin: "10px", textAlign: "center" }}>Create User</button>
                                    {message && <div className="alert alert-success" style={{ margin: "20px" }} role="alert">{message}</div>}
                                    {messageError && <div className="alert alert-danger" style={{ margin: "20px" }} role="alert">{messageError}</div>}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p>&nbsp;</p>
        </>
    );
}

// Export the Create Staff User Function
export default CreateStaffUser;