// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { getClassById, getClasses, selectedId, getSelectedId, deleteClass, editClass } from "../data/repository";

function DisplayClass(props) {

    const [classes, setClassData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [confirmPopup, setconfirmPopup] = useState(false);
    const [confirmPopup2, setconfirmPopup2] = useState(false);
    const [values, setValues] = useState({ group: "", year: "" });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [messageError, setMessageError] = useState(null);


    // Load users from DB.
    useEffect(() => {

        // Loads User Details from DB
        async function loadclassDetails() {
            const currentClasses = await getClasses();
            setClassData(currentClasses)
            setIsLoading(false);
        }

        // Calls the functions above
        loadclassDetails();

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


    // Popup Toggle Switch Function
    const togglePopup = () => {
        setconfirmPopup(!confirmPopup);
    }

    const deleteSelectedClass = async (event) => {
        const currentDetails = await getClassById(getSelectedId());

        await deleteClass(currentDetails);

        // Update Page/Refresh the Data
        const updatedDetails = await getClasses();
        setClassData(updatedDetails);

        togglePopup();

    }

    const handleSearch = async (event) => {
        setSearch(event.target.value.toLowerCase());
    }

    // Popup Toggle Switch Function
    const togglePopup2 = async (event) => {
        event.preventDefault(); // Prevent form submission

        setconfirmPopup2(!confirmPopup2);
        const currentDetails = await getClassById(getSelectedId());
        setValues(currentDetails);

    }

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
            return;
        }

        try {
            // Create user.
            await editClass(trimmedValues, getSelectedId());

            setErrors("");
            // Show success message.
            setMessage(
                <>
                    Class has been Edited.
                </>);

            // Update Page/Refresh the Data
            const updatedDetails = await getClasses();
            setClassData(updatedDetails);

        } catch (error) {
            setMessageError(<>Error: Class Could Not be Edited!</>)
        }

    };

    // Handler for Validating SignUp Input Fields
    const handleValidation = async () => {
        const trimmedValues = trimFields();
        const formErrors = {};

        // Validation for class Field
        let key = "class";
        let value = trimmedValues[key];
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



    return (
        <>
            <br />
            <div className="searchCenter">
                <div className="form-group has-search">
                    <span className="fa fa-search form-control-feedback"></span>
                    <input type="text" style={{ border: "1px solid #112c3f", borderRadius: "10rem" }} className="form-control" placeholder="Search" aria-label="Search" onChange={handleSearch} />
                </div>
            </div>

            <div className="table-responsive">

                {isLoading ?
                    <div className="card-body text-center">
                        <span className="text-muted">Loading Classes...</span>
                    </div>
                    :
                    <>
                        {classes.length === 0 ?
                            <div className="text-center">
                                <p>&nbsp;</p>
                                <span className="text-muted">There are no classes!</span>
                                <p>&nbsp;</p>
                            </div>
                            :
                            <div>
                                <table className="table table-striped" style={{ margin: "0" }}>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th style={{ color: "#112c3f" }} scope="col">ID</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Class</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    {/* Mapping Users state Variable to access its content easily to display in Table */}
                                    {classes.filter((classDetails) => {
                                        return search.toLowerCase() === '' ? classDetails : (classDetails.class && classDetails.class.toLowerCase().includes(search)) || (classDetails.id && classDetails.id.includes(search));
                                    }).map((classDetails) =>
                                        <tbody key={classDetails.id}>

                                            <tr>
                                                <td></td>
                                                <td style={{ color: "#112c3f" }}>{classDetails.id}</td>
                                                <td style={{ color: "#112c3f" }}>{classDetails.class}</td>
                                                <td>
                                                    <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await selectedId(classDetails.id); await togglePopup() }} >Delete</button>
                                                    <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-custom mr-sm-2" onClick={async (event) => { await selectedId(classDetails.id); await togglePopup2(event) }} >Edit</button>
                                                </td>
                                                <td></td>
                                            </tr>


                                        </tbody>
                                    )}
                                </table>
                            </div>
                        }
                    </>
                }
            </div>

            <div>
                {/* Popup box only opens if state variable is set to true for deleting account */}
                {confirmPopup &&
                    <div className="popup-box">
                        <div className="box">
                            <h5 className="card-header bg-warning text-center" style={{ color: "white" }}><b>Confirm!</b></h5>
                            <div style={{ margin: "0 auto", textAlign: "center" }}>
                                <p style={{ padding: "15px", textAlign: "center", color: "red" }}>Are you sure you want delete this Class <br /> This action cannot be undone!</p>
                                <button onClick={togglePopup} className="btn btn-info" style={{ margin: "10px" }}>Cancel</button>
                                <button onClick={async () => { await deleteSelectedClass() }} className="btn btn-danger" style={{ margin: "10px" }}>Delete</button>
                            </div>
                        </div>
                    </div>
                }
                {/* Popup box only opens if state variable is set to true for Editing Class */}
                {confirmPopup2 &&
                    <div className="popup-box">
                        <div className="box" style={{ width: "35%" }}>
                            <h5 className="card-header bg-custom text-center" style={{ color: "white" }}><b>Edit Class</b></h5>
                            <div style={{ margin: "0 auto", textAlign: "center" }}>
                                <form onSubmit={handleSubmit} noValidate>
                                    {/* Class Field */}
                                    <div className="form-group">
                                        <label htmlFor="class"><b>Class:</b></label>
                                        <input type="text" className="form-control" id="class" name="class" placeholder="Enter a Class name" value={values.class || ""} onChange={handleInputChange} required />
                                        {errors.class && (
                                            <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.class}</p>
                                        )}
                                    </div>
                                    <button onClick={(event) => togglePopup2(event)} className="btn btn-info" style={{ margin: "10px" }}>Close</button>
                                    <button type="submit" className="btn btn-success" style={{ margin: "10px" }}>Edit</button>
                                    {message && <div className="alert alert-success" style={{ margin: "20px" }} role="alert">{message}</div>}
                                    {messageError && <div className="alert alert-danger" style={{ margin: "20px" }} role="alert">{messageError}</div>}
                                </form>
                            </div>
                        </div>
                    </div>
                }
            </div>

        </>
    )
}

// Export the Student Function
export default DisplayClass;