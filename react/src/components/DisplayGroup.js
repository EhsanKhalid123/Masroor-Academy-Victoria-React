// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { getGroupById, getGroups, selectedId, getSelectedId, deleteGroup, editGroup } from "../data/repository";

function DisplayGroup(props) {

    const [groups, setGroupsData] = useState([]);
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
        async function loadGroupDetails() {
            const currentGroups = await getGroups();
            setGroupsData(currentGroups)
            setIsLoading(false);
        }

        // Calls the functions above
        loadGroupDetails();

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

    const deleteSelectedGroup = async (event) => {
        const currentDetails = await getGroupById(getSelectedId());

        await deleteGroup(currentDetails);

        // Update Page/Refresh the Data
        const updatedDetails = await getGroups();
        setGroupsData(updatedDetails);

        togglePopup();

    }

    const handleSearch = async (event) => {
        setSearch(event.target.value.toLowerCase());
    }

    // Popup Toggle Switch Function
    const togglePopup2 = async (event) => {
        event.preventDefault(); // Prevent form submission

        setconfirmPopup2(!confirmPopup2);
        const currentDetails = await getGroupById(getSelectedId());
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
            await editGroup(trimmedValues, getSelectedId());

            setErrors("");
            // Show success message.
            setMessage(
                <>
                    Group has been Edited.
                </>);

            // Update Page/Refresh the Data
            const updatedDetails = await getGroups();
            setGroupsData(updatedDetails);

        } catch (error) {
            setMessageError(<>Error: Group Could Not be Edited!</>)
        }

    };

    // Handler for Validating SignUp Input Fields
    const handleValidation = async () => {
        const trimmedValues = trimFields();
        const formErrors = {};

        // Validation for group Field
        let key = "group";
        let value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Group cannot be empty.";

        // Validation for group Field
        key = "year";
        value = trimmedValues[key];
        if (value.length === 0)
            formErrors[key] = "Year cannot be empty.";


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
                        <span className="text-muted">Loading Groups...</span>
                    </div>
                    :
                    <div>
                        <table className="table table-striped" style={{ margin: "0" }}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th style={{ color: "#112c3f" }} scope="col">ID</th>
                                    <th style={{ color: "#112c3f" }} scope="col">Group</th>
                                    <th style={{ color: "#112c3f" }} scope="col">Year</th>
                                    <th></th>
                                    <th></th>

                                </tr>
                            </thead>
                            {/* Mapping Users state Variable to access its content easily to display in Table */}
                            {groups.filter((groupDetails) => {
                                return search.toLowerCase() === '' ? groupDetails : groupDetails.group.toLowerCase().includes(search) || groupDetails.id.includes(search) || groupDetails.year.includes(search);
                            }).map((groupDetails) =>
                                <tbody key={groupDetails.id}>

                                    <tr>
                                        <td></td>
                                        <td style={{ color: "#112c3f" }}>{groupDetails.id}</td>
                                        <td style={{ color: "#112c3f" }}>{groupDetails.group}</td>
                                        <td style={{ color: "#112c3f" }}>{groupDetails.year}</td>
                                        <td>
                                            <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await selectedId(groupDetails.id); await togglePopup() }} >Delete</button>
                                            <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-custom mr-sm-2" onClick={async (event) => { await selectedId(groupDetails.id); await togglePopup2(event) }} >Edit</button>
                                        </td>
                                        <td></td>
                                    </tr>


                                </tbody>
                            )}
                        </table>
                    </div>
                }
            </div>

            <div>
                {/* Popup box only opens if state variable is set to true for deleting Group */}
                {confirmPopup &&
                    <div className="popup-box">
                        <div className="box">
                            <h5 className="card-header bg-warning text-center" style={{ color: "white" }}><b>Confirm!</b></h5>
                            <div style={{ margin: "0 auto", textAlign: "center" }}>
                                <p style={{ padding: "15px", textAlign: "center", color: "red" }}>Are you sure you want delete this Group <br /> This action cannot be undone!</p>
                                <button onClick={togglePopup} className="btn btn-info" style={{ margin: "10px" }}>Cancel</button>
                                <button onClick={async () => { await deleteSelectedGroup() }} className="btn btn-danger" style={{ margin: "10px" }}>Delete</button>
                            </div>
                        </div>
                    </div>
                }
                {/* Popup box only opens if state variable is set to true for Editing Group */}
                {confirmPopup2 &&
                    <div className="popup-box">
                        <div className="box" style={{ width: "35%" }}>
                            <h5 className="card-header bg-custom text-center" style={{ color: "white" }}><b>Edit Group</b></h5>
                            <div style={{ margin: "0 auto", textAlign: "center" }}>
                                <form onSubmit={handleSubmit} noValidate>
                                    {/* Class Field */}
                                    <div className="form-group">
                                        <label htmlFor="group"><b>Group:</b></label>
                                        <input type="text" className="form-control" id="group" name="group" placeholder="Enter a Group name, must be in this format eg. 7-8 (Group 4)" value={values.group || ""} onChange={handleInputChange} required />
                                        <small id="group" className="form-text" style={{ fontWeight: "bold", color: "rgb(217 67 67)", fontSize: "15px" }}>Must be in this format eg. 7-8 (Group 4), Make sure the Group Number is the same as ID</small>
                                        {errors.group && (
                                            <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.group}</p>
                                        )}
                                    </div>
                                    {/* Year Field */}
                                    <div className="form-group">
                                        <label htmlFor="year"><b>Year:</b></label>
                                        <input type="text" className="form-control" id="year" name="year" placeholder="Enter a year eg. 2014 or 2014-2016 " value={values.year || ""} onChange={handleInputChange} required />
                                        {errors.year && (
                                            <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.year}</p>
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
export default DisplayGroup;