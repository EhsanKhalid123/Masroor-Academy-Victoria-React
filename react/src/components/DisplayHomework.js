// Importing React class and functions from node modules
import React, { useState, useEffect } from "react";
import { getHomeworkById, getHomework, selectedId, getSelectedId, deleteHomework, editHomework, getClasses, getGroups } from "../data/repository";

function DisplayHomework(props) {

    const [homework, setHomework] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [confirmPopup, setconfirmPopup] = useState(false);
    const [confirmPopup2, setconfirmPopup2] = useState(false);
    const [values, setValues] = useState({ homework: "", classname: "", group: "" });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [messageError, setMessageError] = useState(null);
    const [classesDropdownValues, setClassesDropdownValues] = useState([]);
    const [selectedClassesDropdownValue, setSelectedClassesDropdownValue] = useState("");
    const [groupDropdownValues, setGroupDropdownValues] = useState([]);
    const [selectedGroupDropdownValue, setSelectedGroupDropdownValue] = useState("");


    // Load users from DB.
    useEffect(() => {

        // Loads User Details from DB
        async function loadHomeworkDetails() {
            const currentHomework = await getHomework();
            setHomework(currentHomework)
            setIsLoading(false);
        }

        async function loadClasses() {
            const currentClasses = await getClasses();
            setClassesDropdownValues(currentClasses);
        }

        async function loadGroups() {
            const currentGroups = await getGroups();
            setGroupDropdownValues(currentGroups);
        }

        // Calls the functions above
        loadHomeworkDetails();
        loadClasses();
        loadGroups();

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

    const deleteSelectedHomework = async (event) => {
        const currentDetails = await getHomeworkById(getSelectedId());

        await deleteHomework(currentDetails);

        // Update Page/Refresh the Data
        const updatedDetails = await getHomework();
        setHomework(updatedDetails);

        togglePopup();

    }

    const handleSearch = async (event) => {
        setSearch(event.target.value.toLowerCase());
    }

    // Popup Toggle Switch Function
    const togglePopup2 = async (event) => {
        event.preventDefault(); // Prevent form submission

        setconfirmPopup2(!confirmPopup2);
        const currentDetails = await getHomeworkById(getSelectedId());
        setValues(currentDetails);
        setSelectedClassesDropdownValue(currentDetails.classname);
        setSelectedGroupDropdownValue(currentDetails.group);

    }

    // Generic change handler.
    const handleInputChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
        setErrors("");
    };

    // Handle the classes dropdown selection
    const handleClassesDropdownChange = event => {
        setSelectedClassesDropdownValue(event.target.value);
    };

    // Handle the groups dropdown selection
    const handleGroupsDropdownChange = event => {
        setSelectedGroupDropdownValue(event.target.value);
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
            trimmedValues.classname = selectedClassesDropdownValue;
            trimmedValues.group = selectedGroupDropdownValue;

            await editHomework(trimmedValues, getSelectedId());

            setErrors("");
            // Show success message.
            setMessage(
                <>
                    Homework has been Edited.
                </>);

            // Update Page/Refresh the Data
            const updatedDetails = await getHomework();
            setHomework(updatedDetails);

        } catch (error) {
            setMessageError(<>Error: Homework Could Not be Edited!</>)
        }

    };

    // Handler for Validating SignUp Input Fields
    const handleValidation = async () => {
        const trimmedValues = trimFields();
        const formErrors = {};

        let key = "homework";
        let value = trimmedValues[key];

        if (value && value.length === 0)
            formErrors[key] = "Homework is required.";

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
                        <span className="text-muted">Loading homework...</span>
                    </div>
                    :
                    <>
                        {homework.length === 0 ?
                            <div className="text-center">
                                <p>&nbsp;</p>
                                <span className="text-muted">There are no homework!</span>
                                <p>&nbsp;</p>
                            </div>
                            :
                            <div>
                                <table className="table table-striped" style={{ margin: "0" }}>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th style={{ color: "#112c3f" }} scope="col">ID</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Homework</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Class</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Group</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    {/* Mapping Users state Variable to access its content easily to display in Table */}
                                    {homework.filter((homeworks) => {
                                        const homeworkId = homeworks.id ? homeworks.id.toString() : ''; // Convert homeworks.id to a string
                                        return search.toLowerCase() === '' ? homeworks : (homeworks.classname && homeworks.classname.toLowerCase().includes(search)) || (homeworks.homework && homeworks.homework.toLowerCase().includes(search)) || (homeworks.group && homeworks.group.toLowerCase().includes(search)) || homeworkId.includes(search);
                                    }).map((homeworks) =>
                                        <tbody key={homeworks.id}>
                                            <tr>
                                                <td></td>
                                                <td style={{ color: "#112c3f" }}>{homeworks.id}</td>
                                                <td style={{ color: "#112c3f" }}>{homeworks.homework}</td>
                                                <td style={{ color: "#112c3f" }}>{homeworks.classname}</td>
                                                <td style={{ color: "#112c3f" }}>{homeworks.group}</td>
                                                <td>
                                                    <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await selectedId(homeworks.id); await togglePopup() }} >Delete</button>
                                                    <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-custom mr-sm-2" onClick={async (event) => { await selectedId(homeworks.id); await togglePopup2(event) }} >Edit</button>
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
                                <p style={{ padding: "15px", textAlign: "center", color: "red" }}>Are you sure you want delete this Homework <br /> This action cannot be undone!</p>
                                <button onClick={togglePopup} className="btn btn-info" style={{ margin: "10px" }}>Cancel</button>
                                <button onClick={async () => { await deleteSelectedHomework() }} className="btn btn-danger" style={{ margin: "10px" }}>Delete</button>
                            </div>
                        </div>
                    </div>
                }
                {/* Popup box only opens if state variable is set to true for Editing homework */}
                {confirmPopup2 &&
                    <div className="popup-box">
                        <div className="box" style={{ width: "35%" }}>
                            <h5 className="card-header bg-custom text-center" style={{ color: "white" }}><b>Edit Homework Item</b></h5>
                            <div style={{ margin: "0 auto", textAlign: "center" }}>
                                <form onSubmit={handleSubmit} noValidate>
                                    {/* Homework Field */}
                                    <div className="form-group">
                                        <label htmlFor="homework"><b>Homework:</b></label>
                                        <input type="text" className="form-control" id="homework" name="homework" placeholder="Enter a Homework name" value={values.homework || ""} onChange={handleInputChange} required />
                                        {errors.homework && (
                                            <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errors.homework}</p>
                                        )}
                                    </div>

                                    {/* classname Field */}
                                    <div className="form-group">
                                        <label htmlFor="classname"><b>Classname:</b></label>
                                        <select id="classname" name="classname" className="form-control" value={selectedClassesDropdownValue || ""} onChange={handleClassesDropdownChange}>
                                            <option value="" disabled hidden>Select a Class</option>
                                            {classesDropdownValues.map(classes => (
                                                <option key={classes.id} value={classes?.class}>{classes?.class}</option>
                                            ))}
                                        </select>

                                        {/* Group Field */}
                                        <div className="form-group">
                                            <label htmlFor="group"><b>Group:</b></label>
                                            <select id="group" name="group" className="form-control" value={selectedGroupDropdownValue || ""} onChange={handleGroupsDropdownChange}>
                                                <option value="" disabled hidden>Select a Group</option>
                                                {groupDropdownValues.map(groups => {
                                                    // Exclude specific group values
                                                    if (groups.group !== "Female Teacher" && groups.group !== "Male Teacher" && groups.group !== "Admin" && groups.group !== "Principal") {
                                                        return (<option key={groups.id} value={groups?.group}>{groups?.group}</option>);
                                                    }
                                                    return null;
                                                })}
                                            </select>
                                        </div>

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
export default DisplayHomework;