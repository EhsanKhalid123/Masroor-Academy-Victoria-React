
// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { registerUser, getFormStatus, getRegFormMessage } from "../data/repository";
import parse from 'html-react-parser';

// Functional Component for Signup Page
function Register(props) {

    // State Variables Declaration for useState and useContext Hooks
    const [values, setValues] = useState({ name: "", email: "", dob: "", auxiliary: "", jamaat: "", pname: "", pemail: "", contact: "" });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [formStatus, setFormStatus] = useState({});
    const [regText, setRegText] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const currentYear = new Date().getFullYear();
    const current = new Date().toISOString().split("T")[0];

    // Set message to null automatically after a period of time.
    useEffect(() => {

        // Loads Form Status from DB
        async function loadFormStatus() {
            const currentFormStatus = await getFormStatus();
            const currentRegText = await getRegFormMessage();

            setFormStatus(currentFormStatus);
            setRegText(currentRegText);
            setIsLoading(false);
        }

        // Calls the functions above
        loadFormStatus();

        if (message === null)
            return;

        // Time limit for message to display
        const id = setTimeout(() => setMessage(null), 7000);

        // When message changes clear the queued timeout function.
        return () => clearTimeout(id);

    }, [message]);

    const handleOptionChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    }

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
        else {
            // Clear all errors
            setErrors("");
        }

        try {
            // Create user.
            await registerUser(trimmedValues);
            // Clear all errors and fields
            setValues({ name: "", email: "", dob: "", auxiliary: "", jamaat: "", pname: "", pemail: "", contact: "" });
            setErrors("");
            // Show success message.
            setMessage(
                <>
                    Jazzakallah for your response, you will soon be contacted for future events and details.
                </>);
        } catch (error) {
            const submitError = {};
            let key = "message";
            submitError[key] = "Sorry there was an issue with the registration, please try again!"
            setErrors(submitError);
        }
    };

    // Handler for Validating SignUp Input Fields
    const handleValidation = async () => {
        const trimmedValues = trimFields();
        const formErrors = {};

        // Validation for Name Field
        let key = "name";
        let value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Student Name is required.";
        else if (value.length > 40)
            formErrors[key] = "Name length cannot be greater than 40.";

        // Validation for date of birth Field
        key = "dob";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Date of Birth is required.";

        // Validation for auxiliary radio button Field
        key = "auxiliary";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Please select an auxiliary.";

        // Validation for Jama'at radio button Field
        key = "jamaat";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Please select a Jama'at.";

        // Validation for Parent's Name Field
        key = "pname";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Parent's Name is required.";
        else if (value.length > 40)
            formErrors[key] = "Name length cannot be greater than 40.";

        // Validation for Parent's Email Field
        key = "pemail";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Parent Email address is required.";
        else if (value.length > 128)
            formErrors[key] = "Parent Email length cannot be greater than 128.";
        else if (!/\S+@\S+\.\S+/.test(value))
            formErrors[key] = "Please enter a valid Parent email address";

        // Validation for Parent's Name Field
        key = "contact";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Parent's Phone Number is Required.";
        else if (value.length > 10)
            formErrors[key] = "Contact Number cannot be greater than 10.";


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
            <img className="img-fluid d-block mx-auto" style={{ textAlign: "center", margin: "auto", display: "block", maxWidth: "100%" }} src={"/assets/images/Registration Form Banner.png"} alt="Registration Banner" />
            <h1 className="text-center mb-3" style={{ padding: "50px 20px 0 20px" }}>Masroor Academy Registration {currentYear}</h1>
            <hr style={{ width: "50%", marginBottom: "20px", borderWidth: "1px", backgroundColor: "#5dc7d8" }} />

            {isLoading ?
                <div className="card-body text-center">
                    <span className="text-muted">There has been an issue with our servers, Please contact us at masrooracademyvic1@gmail.com</span>
                </div>
                :
                <>
                    {formStatus.status ?
                        <div>
                             <div style={{ fontSize: "17px", padding: "0 18%" }} className="text-center mb-3">{parse(regText.text)}</div>
                            <p>&nbsp;</p>
                            <form className="sign-up-form" onSubmit={handleSubmit} noValidate>
                                {/* Name Field */}
                                <div className="form-group">
                                    <label htmlFor="name"><b className="required-field" style={{ fontSize: "20px" }}>Student's Full Name:</b></label>
                                    <input type="text" className="form-control" id="name" name="name" placeholder="Please enter student's full name" value={values.name} onChange={handleInputChange} required />
                                    <small id="studentNameHelp" className="form-text text-muted" style={{ fontWeight: "bold" }}>Please enter student's full name to avoid confusion with other students with the same name!</small>
                                    {errors.name && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.name}</p>
                                    )}
                                </div>
                                {/* Email Field */}
                                <div className="form-group">
                                    <label htmlFor="email"><b style={{ fontSize: "20px" }}>Student's Email:</b></label>
                                    <input type="email" className="form-control" id="email" name="email" placeholder="Please enter student's email" value={values.email} onChange={handleInputChange} />
                                    <small id="studentEmailHelp" className="form-text text-muted" style={{ fontWeight: "bold" }}>Please enter student's Email if they have any otherwise leave blank</small>
                                    {errors.email && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.email}</p>
                                    )}
                                </div>
                                {/* DOB Field */}
                                <div className="form-group">
                                    <label htmlFor="date"><b className="required-field" style={{ fontSize: "20px" }}>Student's Date of Birth:</b></label>
                                    <input type="date" className="form-control" id="dob" name="dob" placeholder="Please enter your Date of Birth" value={values.dob} onChange={handleInputChange} max={current} required />
                                    {errors.dob && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.dob}</p>
                                    )}
                                </div>
                                {/* Auxilary Field */}
                                <div className="form-group">
                                    <label htmlFor="Auxilary"><b className="required-field" style={{ fontSize: "20px" }}>Auxiliary Organisation:</b></label>
                                    <br />
                                    <input type="radio" style={{ width: "20px", height: "20px" }} name="auxiliary" value="Atfal-ul-Ahmadiyya" checked={values.auxiliary === "Atfal-ul-Ahmadiyya"} onChange={handleOptionChange} required /> <span style={{ fontSize: "20px" }}>Atfal-ul-Ahmadiyya</span>
                                    <br />
                                    <input type="radio" style={{ width: "20px", height: "20px" }} name="auxiliary" value="Nasirat-ul-Ahmadiyya" checked={values.auxiliary === "Nasirat-ul-Ahmadiyya"} onChange={handleOptionChange} required /> <span style={{ fontSize: "20px" }}>Nasirat-ul-Ahmadiyya</span>
                                    {errors.auxiliary && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.auxiliary}</p>
                                    )}
                                </div>
                                {/* Jama'at Field */}
                                <div className="form-group">
                                    <label htmlFor="Auxilary"><b className="required-field" style={{ fontSize: "20px" }}>Jama'at:</b></label>
                                    <br />
                                    <input type="radio" style={{ width: "20px", height: "20px" }} id="jamaat" name="jamaat" value="Berwick" checked={values.jamaat === "Berwick"} onChange={handleOptionChange} required /> <span style={{ fontSize: "20px" }}>Berwick</span>
                                    <br />
                                    <input type="radio" style={{ width: "20px", height: "20px" }} id="jamaat" name="jamaat" value="Langwarrin" checked={values.jamaat === "Langwarrin"} onChange={handleOptionChange} required /> <span style={{ fontSize: "20px" }}>Langwarrin</span>
                                    <br />
                                    <input type="radio" style={{ width: "20px", height: "20px" }} id="jamaat" name="jamaat" value="Clyde" checked={values.jamaat === "Clyde"} onChange={handleOptionChange} required /> <span style={{ fontSize: "20px" }}>Clyde</span>
                                    <br />
                                    {/* <input type="radio" style={{ width: "20px", height: "20px" }} id="jamaat" name="jamaat" value="Melbourne East" checked={values.jamaat === "Melbourne East"} onChange={handleOptionChange} required /> <span style={{ fontSize: "20px" }}>Melbourne East</span>
                                    <br />
                                    <input type="radio" style={{ width: "20px", height: "20px" }} id="jamaat" name="jamaat" value="Melbourne West" checked={values.jamaat === "Melbourne West"} onChange={handleOptionChange} required /> <span style={{ fontSize: "20px" }}>Melbourne West</span> */}
                                    {errors.jamaat && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.jamaat}</p>
                                    )}
                                </div>
                                {/* Parents Name Field */}
                                <div className="form-group">
                                    <label htmlFor="pname"><b className="required-field" style={{ fontSize: "20px" }}>Parent's Full Name:</b></label>
                                    <input type="text" className="form-control" id="pname" name="pname" placeholder="Please enter parent's full name" value={values.pname} onChange={handleInputChange} required />
                                    {errors.pname && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.pname}</p>
                                    )}
                                </div>
                                {/* Parents Email Field */}
                                <div className="form-group">
                                    <label htmlFor="email"><b className="required-field" style={{ fontSize: "20px" }}>Parent's Email:</b></label>
                                    <input type="email" className="form-control" id="pemail" name="pemail" placeholder="Please enter parent's email" value={values.pemail} onChange={handleInputChange} required />
                                    {errors.pemail && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.pemail}</p>
                                    )}
                                </div>
                                {/* Parent's Contact Number Field */}
                                <div className="form-group">
                                    <label htmlFor="contact"><b className="required-field" style={{ fontSize: "20px" }}>Parent's Contact Number:</b></label>
                                    <input type="number" style={{ WebkitAppearance: "none" }} className="form-control" id="contact" name="contact" placeholder="Please enter parent's contact number" value={values.contact} onChange={handleInputChange} required />
                                    <small id="contact" className="form-text text-muted" style={{ fontWeight: "bold" }}>NOTE: We will use this number to communicate classes information & home work. So, please provide the number of parent who can monitor this and work on it accordingly. Jazzakallah</small>
                                    {errors.contact && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.contact}</p>
                                    )}
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>

                                {message && <div className="alert alert-success" style={{ margin: "20px" }} role="alert">{message}</div>}
                                {errors.message && <div className="alert alert-danger" style={{ margin: "20px" }} role="alert">{errors.message}</div>}
                            </form>
                        </div>
                        :
                        <>
                            <pre className="formTextStyle text-center">{formStatus.text}</pre>
                            <p>&nbsp;</p>
                        </>
                    }
                </>
            }
        </>
    );
}

// Export the sign-up Function
export default Register;