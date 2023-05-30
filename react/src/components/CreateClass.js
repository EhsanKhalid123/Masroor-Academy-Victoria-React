
// Importing React classes and functions from node modules
import React, { useState, useEffect, useRef } from "react";
import { createClass, } from "../data/repository";

// Functional Component for Create Staff User Page
function CreateClass(props) {

    // State Variables Declaration for useState and useContext Hooks
    const [values, setValues] = useState({ id: "", class: "" });
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

            // Create user.
            await createClass(trimmedValues);

            // Clear all errors and fields
            setValues({ id: "", class: ""});
            setErrors("");
            // Show success message.
            setMessage(
                <>
                    New Class has been Created.
                </>);
        } catch (error) {
            setMessageError(<>Error: New Class Could Not be Created!</>)
        }
    };

    // Handler for Validating SignUp Input Fields
    const handleValidation = async () => {
        const trimmedValues = trimFields();
        const formErrors = {};

        let key = "id";
        let value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "ID is required.";

        // Validation for group Field
        key = "class";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Class cannot be empty.";

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

        // Signup Form Code using normal HTML elements
        <>
            <br />
            <h1 className="text-center mb-3" style={{ padding: "50px 20px 0 20px" }}>Create Classes</h1>
            <hr style={{ width: "50%", marginBottom: "20px", borderWidth: "1px", backgroundColor: "#5dc7d8" }} />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 mt-custom">
                        <div className="card">
                            <h5 className="card-header card text-white bg-custom">Create a New Class</h5>
                            <div className="card-body text-center">

                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="form-group">
                                        <label htmlFor="id"><b>ID:</b></label>
                                        <input type="text" className="form-control" id="id" name="id" placeholder="Enter an ID" ref={userInputRef} value={values.id} onChange={handleInputChange} required />
                                        {errors.id && (
                                            <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.id}</p>
                                        )}
                                    </div>
                                    {/* Name Field */}
                                    <div className="form-group">
                                        <label htmlFor="class"><b>Class:</b></label>
                                        <input type="text" className="form-control" id="class" name="class" placeholder="Enter a Class name" value={values.class} onChange={handleInputChange} required />
                                        {errors.class && (
                                            <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.class}</p>
                                        )}
                                    </div>                               

                                    <button type="submit" className="btn btn-custom" style={{ margin: "10px", textAlign: "center" }}>Create Class</button>
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
export default CreateClass;