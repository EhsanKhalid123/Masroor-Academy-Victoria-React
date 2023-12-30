
// Importing React classes and functions from node modules
import React, { useState, useEffect, useRef } from "react";
import { getFormStatus, getRegFormMessage, createUser, checkUserExists, getProfileRegister } from "../data/repository";
import parse from 'html-react-parser';
import registrationFormBanner from "../assets/images/Registration Form Banner.png"

// Functional Component for Signup Page
function Register(props) {

    // State Variables Declaration for useState and useContext Hooks
    const [values, setValues] = useState({ id: "", name: "", hashed_password: "student", group: "", gender: "", class: null, archived: false, studentEmail: "", studentDob: "", jamaat: "", fathersName: "", fathersEmail: "", fathersContact: "", mothersName: "", mothersEmail: "", mothersContact: "" });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [formStatus, setFormStatus] = useState({});
    const [regText, setRegText] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const currentYear = new Date().getFullYear();
    const current = new Date().toISOString().split("T")[0];
    const userInputRef = useRef(null);

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
        const id = setTimeout(() => setMessage(null), 30000);

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

    const generateUserId = async (name, fathersName, gender, jamaat) => {

        const userExists = await checkUserExists(name, fathersName);

        if (userExists) {
            return null;
        }

        if (gender === "Atfal-ul-Ahmadiyya")
            gender = "Male";
        else if (gender === "Nasirat-ul-Ahmadiyya")
            gender = "Female";

        let id;
        let num = 1;
        let suffix = num.toString().padStart(3, '0');

        while (true) {
            id = `${gender[0]}-${jamaat[0]}-${suffix}`;
            if (await getProfileRegister(id) === null) {
                break;
            }
            num++;
            suffix = num.toString().padStart(3, '0');
        }

        return id;
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
        } else {
            // Clear all errors
            setErrors("");
        }

        try {

            // Generate user ID.
            const generatedID = await generateUserId(
                trimmedValues.name,
                trimmedValues.fathersName,
                trimmedValues.gender,
                trimmedValues.jamaat
            );

            const formErrors = {};
            if (generatedID === null) {
                formErrors["message"] = "Student with the name: " + trimmedValues.name + ", Fathers Name: " + trimmedValues.fathersName + " already exists, this means you are already registered from previous years please contact the Principal for you login details, but if you are completely new and can't register please contact the Principal or email us at masrooracademyvic1@gmail.com!";
                setErrors(formErrors);
                return;
            }

            if (await getProfileRegister(generatedID) !== null) {
                formErrors["message"] = "User with this ID already exists, This is an issue in the backend, please immediately contact the Principal or email us at masrooracademyvic1@gmail.com";
                setErrors(formErrors);
                return;
            }

            var gender = null;
            if (trimmedValues.gender === "Atfal-ul-Ahmadiyya")
                gender = "Atfal";
            else if (trimmedValues.gender === "Nasirat-ul-Ahmadiyya")
                gender = "Nasirat";

            // Update trimmedValues with generated ID.
            const updatedTrimmedValues = {
                ...trimmedValues,
                id: generatedID,
                gender: gender
            };

            // Create user.

            await createUser(updatedTrimmedValues);

            // Clear all errors and fields
            setValues({ id: "", name: "", hashed_password: "student", group: "", gender: "", class: null, archived: false, studentEmail: "", studentDob: "", jamaat: "", fathersName: "", fathersEmail: "", fathersContact: "", mothersName: "", mothersEmail: "", mothersContact: "" });
            setErrors("");
            // Show success message.
            setMessage(
                <>
                    Jazzakallah for your response, you will soon be contacted for future events and details.<br />
                    Please note your Login details - <b style={{color: "#ff7d00"}}>ID: {generatedID} </b> <b style={{color: "#d46800"}}>Password: student </b><br />
                    Please use these details to login and please change password, if you forget the details please
                    contact masrooracademyvic1@gmail.com or contact the Principal.
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

        const isFatherDetailsEntered = !!trimmedValues.fathersName;
        const isMotherDetailsEntered = !!trimmedValues.mothersName;

        if (!isFatherDetailsEntered && !isMotherDetailsEntered) {
            formErrors['fathersName'] = 'Please fill at least one of the sections: fathers or mothers.';
            formErrors['mothersName'] = 'Please fill at least one of the sections: fathers or mothers.';
        }

        // Validation for Name Field
        let key = "name";
        let value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Student Name is required.";
        else if (value.length > 40)
            formErrors[key] = "Name length cannot be greater than 40.";
        else if (/\d+/.test(value))
            formErrors[key] = "Name cannot have any numbers.";
        else if (value === "Admin")
            formErrors[key] = "Name Cannot be Admin";

        // Validation for Student Email Field
        key = "studentEmail";
        value = trimmedValues[key];
        if (value.length !== 0) {
            if (value.length > 128)
                formErrors[key] = "Email length cannot be greater than 128.";
            else if (!/\S+@\S+\.\S+/.test(value))
                formErrors[key] = "Please enter a valid email address";
        }

        // Validation for date of birth Field
        key = "studentDob";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Date of Birth is required.";

        // Validation for auxiliary radio button Field
        key = "gender";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Please select an auxiliary.";

        // Validation for Jama'at radio button Field
        key = "jamaat";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Please select a Jama'at.";

        if (isFatherDetailsEntered) {
            // Validation for Fathers Name Field
            key = "fathersName";
            value = trimmedValues[key];
            if (value.length === 0)
                formErrors[key] = "Fathers Name is required.";
            else if (value.length > 40)
                formErrors[key] = "Name length cannot be greater than 40.";
            else if (/\d+/.test(value))
                formErrors[key] = "Father Name cannot have any numbers.";
            else if (value === "Admin")
                formErrors[key] = "Father Name Cannot be Admin";

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
        }

        if (isMotherDetailsEntered) {
            // Validation for Mothers Name Field
            key = "mothersName";
            value = trimmedValues[key];
            if (value.length === 0)
                formErrors[key] = "Mothers Name is required.";
            else if (value.length > 40)
                formErrors[key] = "Name length cannot be greater than 40.";
            else if (/\d+/.test(value))
                formErrors[key] = "Mother Name cannot have any numbers.";
            else if (value === "Admin")
                formErrors[key] = "Mother Name Cannot be Admin";

            // Validation for Mothers Email Field
            key = "mothersEmail";
            value = trimmedValues[key];
            if (value.length === 0)
                formErrors[key] = "Mothers Email address is required.";
            else if (value.length > 128)
                formErrors[key] = "Email length cannot be greater than 128.";
            else if (!/\S+@\S+\.\S+/.test(value))
                formErrors[key] = "Please enter a valid email address";

            // Validation for Mothers Name Field
            key = "mothersContact";
            value = trimmedValues[key];
            if (value.length === 0)
                formErrors[key] = "Mothers Phone Number is Required.";
            else if (value.length > 10)
                formErrors[key] = "Contact Number cannot be greater than 10.";
        }

        // Sets Errors If any Validation Fails
        setErrors(formErrors);

        return { trimmedValues, isValid: Object.keys(formErrors).length === 0 };
    };

    // Trim Fields Function to trim all spaces from the trimmedValues constant recieved from other function.
    const trimFields = () => {
        const trimmedValues = {};
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
            <img className="img-fluid d-block mx-auto" style={{ textAlign: "center", margin: "auto", display: "block", maxWidth: "100%" }} src={registrationFormBanner} alt="Registration Banner" />
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
                                    <input type="text" className="form-control" id="name" name="name" placeholder="Please enter student's full name" ref={userInputRef} value={values.name} onChange={handleInputChange} required />
                                    <small id="studentNameHelp" className="form-text text-muted" style={{ fontWeight: "bold", fontSize: "15px" }}>Please enter student's full name to avoid confusion with other students with the same name.
                                        Note If there are children with the same name their parents name will be added next to it in brackets for Identification purposes.</small>
                                    {errors.name && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.name}</p>
                                    )}
                                </div>
                                {/* Email Field */}
                                <div className="form-group">
                                    <label htmlFor="studentEmail"><b style={{ fontSize: "20px" }}>Student's Email:</b></label>
                                    <input type="email" className="form-control" id="studentEmail" name="studentEmail" placeholder="Please enter student's email" value={values.studentEmail} onChange={handleInputChange} />
                                    <small id="studentEmailHelp" className="form-text text-muted" style={{ fontWeight: "bold", fontSize: "15px" }}>Please enter student's Email if they have any otherwise leave blank</small>
                                    {errors.studentEmail && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.studentEmail}</p>
                                    )}
                                </div>
                                {/* DOB Field */}
                                <div className="form-group">
                                    <label htmlFor="studentDob"><b className="required-field" style={{ fontSize: "20px" }}>Student's Date of Birth:</b></label>
                                    <input type="date" className="form-control" id="studentDob" name="studentDob" placeholder="Please enter your Date of Birth" value={values.studentDob} onChange={handleInputChange} max={current} required />
                                    <small id="studentDobHelp" className="form-text" style={{ fontWeight: "bold", color: "rgb(203 145 26)", fontSize: "15px" }}>Please enter the correct date of birth, and make sure to select or enter the correct birth year to allocate your child to their respective groups.</small>
                                    {errors.studentDob && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.studentDob}</p>
                                    )}
                                </div>
                                {/* Auxilary Field */}
                                <div className="form-group">
                                    <label htmlFor="atfal"><b className="required-field" style={{ fontSize: "20px" }}>Auxiliary Organisation:</b></label>
                                    <br />
                                    <input type="radio" style={{ width: "20px", height: "20px" }} id="atfal" name="gender" value="Atfal-ul-Ahmadiyya" checked={values.gender === "Atfal-ul-Ahmadiyya"} onChange={handleOptionChange} required /> <span style={{ fontSize: "20px" }}>Atfal-ul-Ahmadiyya</span>
                                    <br />
                                    <input type="radio" style={{ width: "20px", height: "20px" }} id="nasirat" name="gender" value="Nasirat-ul-Ahmadiyya" checked={values.gender === "Nasirat-ul-Ahmadiyya"} onChange={handleOptionChange} required /> <span style={{ fontSize: "20px" }}>Nasirat-ul-Ahmadiyya</span>
                                    {errors.gender && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.gender}</p>
                                    )}
                                </div>
                                {/* Jama'at Field */}
                                <div className="form-group">
                                    <label htmlFor="berwick"><b className="required-field" style={{ fontSize: "20px" }}>Jama'at:</b></label>
                                    <br />
                                    <input type="radio" style={{ width: "20px", height: "20px" }} id="berwick" name="jamaat" value="Berwick" checked={values.jamaat === "Berwick"} onChange={handleOptionChange} required /> <span style={{ fontSize: "20px" }}>Berwick</span>
                                    <br />
                                    <input type="radio" style={{ width: "20px", height: "20px" }} id="langwarrin" name="jamaat" value="Langwarrin" checked={values.jamaat === "Langwarrin"} onChange={handleOptionChange} required /> <span style={{ fontSize: "20px" }}>Langwarrin</span>
                                    <br />
                                    <input type="radio" style={{ width: "20px", height: "20px" }} id="clyde" name="jamaat" value="Clyde" checked={values.jamaat === "Clyde"} onChange={handleOptionChange} required /> <span style={{ fontSize: "20px" }}>Clyde</span>
                                    <br />
                                    {/* <input type="radio" style={{ width: "20px", height: "20px" }} id="jamaat" name="jamaat" value="Melbourne East" checked={values.jamaat === "Melbourne East"} onChange={handleOptionChange} required /> <span style={{ fontSize: "20px" }}>Melbourne East</span>
                                    <br />
                                    <input type="radio" style={{ width: "20px", height: "20px" }} id="jamaat" name="jamaat" value="Melbourne West" checked={values.jamaat === "Melbourne West"} onChange={handleOptionChange} required /> <span style={{ fontSize: "20px" }}>Melbourne West</span> */}
                                    {errors.jamaat && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.jamaat}</p>
                                    )}
                                </div>
                                <p style={{ fontWeight: "bold", color: "rgb(228 96 28)", fontSize: "15px" }}> Please make sure to enter either Fathers Details or Mothers Details, its preferred to enter both but at least one of them is required</p>
                                {/* Fathers Name Field */}
                                <div className="form-group">
                                    <label htmlFor="fathersName"><b style={{ fontSize: "20px" }}>Fathers Full Name:</b></label>
                                    <input type="text" className="form-control" id="fathersName" name="fathersName" placeholder="Please enter fathers full name" value={values.fathersName} onChange={handleInputChange} required />
                                    {errors.fathersName && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.fathersName}</p>
                                    )}
                                </div>
                                {/* Fathers Email Field */}
                                <div className="form-group">
                                    <label htmlFor="fathersEmail"><b style={{ fontSize: "20px" }}>Fathers Email:</b></label>
                                    <input type="fathersEmail" className="form-control" id="fathersEmail" name="fathersEmail" placeholder="Please enter fathers email" value={values.fathersEmail} onChange={handleInputChange} required />
                                    {errors.fathersEmail && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.fathersEmail}</p>
                                    )}
                                </div>
                                {/* Fathers Contact Number Field */}
                                <div className="form-group">
                                    <label htmlFor="fathersContact"><b style={{ fontSize: "20px" }}>Fathers Contact Number:</b></label>
                                    <input type="number" style={{ WebkitAppearance: "none" }} className="form-control" id="fathersContact" name="fathersContact" placeholder="Please enter fathers contact number" value={values.fathersContact} onChange={handleInputChange} required />
                                    <small id="fathersContact" className="form-text text-muted" style={{ fontWeight: "bold", fontSize: "15px" }}>NOTE: We will use this number to communicate classes information & home work. So, please provide the number of parent who can monitor this and work on it accordingly. Jazzakallah</small>
                                    {errors.fathersContact && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.fathersContact}</p>
                                    )}
                                </div>
                                {/* Mothers Name Field */}
                                <div className="form-group">
                                    <label htmlFor="mothersName"><b style={{ fontSize: "20px" }}>Mothers Full Name:</b></label>
                                    <input type="text" className="form-control" id="mothersName" name="mothersName" placeholder="Please enter mothers full name" value={values.mothersName} onChange={handleInputChange} required />
                                    {errors.mothersName && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.mothersName}</p>
                                    )}
                                </div>
                                {/* Mothers Email Field */}
                                <div className="form-group">
                                    <label htmlFor="mothersEmail"><b style={{ fontSize: "20px" }}>Mothers Email:</b></label>
                                    <input type="mothersEmail" className="form-control" id="mothersEmail" name="mothersEmail" placeholder="Please enter mothers email" value={values.mothersEmail} onChange={handleInputChange} required />
                                    {errors.mothersEmail && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.mothersEmail}</p>
                                    )}
                                </div>
                                {/* Mothers Contact Number Field */}
                                <div className="form-group">
                                    <label htmlFor="mothersContact"><b style={{ fontSize: "20px" }}>Mothers Contact Number:</b></label>
                                    <input type="number" style={{ WebkitAppearance: "none" }} className="form-control" id="mothersContact" name="mothersContact" placeholder="Please enter mothers contact number" value={values.mothersContact} onChange={handleInputChange} required />
                                    <small id="mothersContact" className="form-text text-muted" style={{ fontWeight: "bold", fontSize: "15px" }}>NOTE: In case of girls registration, this field is mandatory. For boys, fill only if you want communication to be sent to mothers too. JazakAllah</small>
                                    {errors.mothersContact && (
                                        <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.mothersContact}</p>
                                    )}
                                </div>
                                <button type="submit" className="btn btn-custom">Submit</button>

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