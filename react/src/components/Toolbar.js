import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faDownload, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { getProfileUsers, deleteUserDB, getGroups, updateUser, fetchResourcesByID, fetchResources, getHomework, deleteHomework, getAllResults, deleteResults, editHomework, getAllFinalResults, deleteFinalResults } from "../data/repository";
import { useLocation } from "react-router-dom";
import ReactSwitch from 'react-switch';


function Toolbar({ selectedUser, onUpdate, props, selectedResources }) {

    const [confirmPopup, setconfirmPopup] = useState(false);
    const [confirmPopup2, setconfirmPopup2] = useState(false);
    const [confirmPopup3, setconfirmPopup3] = useState(false);
    const [confirmPopup4, setconfirmPopup4] = useState(false);
    const [users, setUsersData] = useState([]);
    const [dropdownValues, setDropdownValues] = useState([]);
    const [selectedDropdownValue, setSelectedDropdownValue] = useState("");
    const [isMobileView, setIsMobileView] = useState(false);
    const location = useLocation();
    const isOnResourcesPage = location.pathname.includes("/Resources");
    const isOnDisplayHomeworkPage = location.pathname.includes("/DisplayHomework");
    const isOnDisplayResultPage = location.pathname.includes("/DisplayResults");
    const isOnDisplayFinalResultPage = location.pathname.includes("/Results");
    const [resources, setResources] = useState([]);
    const [selectedUserStatus, setSelectedUserStatus] = useState(false);
    const [homework, setHomework] = useState([]);
    const [resultsData, setResultsData] = useState([]);
    const [finalResultsData, setFinalResultsData] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);


    // Load users from DB.
    useEffect(() => {

        // Loads User Details from DB
        async function loadUserDetails() {
            const currentDetails = await getProfileUsers();
            setUsersData(currentDetails);

        }

        async function loadGroups() {
            const currentGroups = await getGroups();
            setDropdownValues(currentGroups);
        }

        async function loadResources() {
            const currentResources = await fetchResources();
            setResources(currentResources);
        }

        async function loadHomeworkDetails() {
            const currentHomework = await getHomework();
            setHomework(currentHomework)
        }

        const loadResultsData = async () => {
            const results = await getAllResults();
            setResultsData(results);
        }

        const loadFinalResultsData = async () => {
            const results = await getAllFinalResults();
            setFinalResultsData(results);
        }

        // Calls the functions above
        loadUserDetails();
        loadGroups();
        loadResources();
        loadHomeworkDetails();
        loadResultsData();
        loadFinalResultsData();

    }, [selectedUser]);

    useEffect(() => {
        // Check if the screen size is 500px or smaller
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 500);
        };
        window.addEventListener("resize", handleResize);
        handleResize(); // Initial check
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Popup Toggle Switch Function
    const togglePopup = () => {
        setconfirmPopup(!confirmPopup);
    }

    // Popup Toggle Switch Function
    const togglePopup2 = () => {
        setconfirmPopup2(!confirmPopup2);
    }

    // Popup Toggle Switch Function
    const togglePopup3 = () => {
        setconfirmPopup3(!confirmPopup3);
    }

    // Popup Toggle Switch Function
    const togglePopup4 = () => {
        setconfirmPopup4(!confirmPopup4);
    }

    const handleDropdownChange = event => {
        const { value } = event.target;
        setSelectedDropdownValue(value);
    };

    const updateSelectedUsersGroup = async () => {
        // Update the group for each selected user
        for (const id of selectedUser) {
            const userToUpdate = users.find((user) => user.id === id);
            if (userToUpdate) {
                userToUpdate.group = selectedDropdownValue;
                await updateUser(userToUpdate, userToUpdate.id, props.user.id);
            }
        }

        setSelectedDropdownValue(""); // Reset the dropdown value
        onUpdate();

    };

    const handleToggleChange = async (event) => {
        setSelectedUserStatus(event);

        // Delete the selected users by their IDs
        for (const id of selectedUser) {

            const userToArchive = users.find((user) => { return user.id === id });

            if (userToArchive) {
                userToArchive.archived = event;
                await updateUser(userToArchive, userToArchive.id, props.user.id);
            }
        }

        // onUpdate();

        // togglePopup();
    }

    const deleteSelectedUser = async (event) => {

        // Delete the selected users by their IDs
        for (const id of selectedUser) {

            const userToDelete = users.find((user) => { return user.id === id });

            if (userToDelete) {
                await deleteUserDB(userToDelete);
            }
        }

        onUpdate();

        togglePopup();

    }

    const deleteSelectedHomework = async (event) => {

        // Delete the selected users by their IDs
        for (const id of selectedUser) {

            const homeworkToDelete = homework.find((homeworks) => { return homeworks.id === id });

            if (homeworkToDelete) {
                await deleteHomework(homeworkToDelete);
            }
        }

        onUpdate();

        togglePopup();

    }

    const deleteSelectedResult = async (event) => {

        // Delete the selected users by their IDs
        for (const id of selectedUser) {

            const resultToDelete = resultsData.find((result) => { return result.resultID === id });

            if (resultToDelete) {
                await deleteResults(resultToDelete);
            }
        }

        onUpdate();

        togglePopup();

    }

    const deleteSelectedFinalResult = async (event) => {

        // Delete the selected users by their IDs
        for (const id of selectedUser) {

            const resultToDelete = finalResultsData.find((result) => { return result.studentID === id });

            if (resultToDelete) {
                await deleteFinalResults(resultToDelete);
            }
        }

        onUpdate();

        togglePopup();

    }

    const handleDownload = async (resourceID) => {

        for (const id of selectedResources) {

            const resourcesToDownload = resources.find((resource) => { return resource.id === id });

            if (resourcesToDownload) {
                const resourceUrl = await fetchResourcesByID(resourcesToDownload.id);

                // Downloads the file instantly
                const filename = resourceUrl.split("/").pop();
                const aTag = document.createElement("a");
                aTag.href = resourceUrl;
                aTag.setAttribute("download", filename);
                document.body.appendChild(aTag);
                aTag.click();
                aTag.remove();
            }
        }


    };

    // Event handler for group checkbox change
    const handleGroupCheckboxChange = async (event) => {
        const { name, checked } = event.target;
        if (checked) {
            setSelectedGroups((prevSelectedGroups) => [...prevSelectedGroups, name]);
        } else {
            setSelectedGroups((prevSelectedGroups) =>
                prevSelectedGroups.filter((group) => group !== name)
            );
        }
    };

    const handleGroupCheckboxUpdate = async (event) => {

        for (const id of selectedUser) {

            const homeworkToEdit = homework.find((homeworks) => { return homeworks.id === id });
            if (homeworkToEdit) {
                homeworkToEdit.group = selectedGroups;
                await editHomework(homeworkToEdit, homeworkToEdit.id);
            }
        }

        onUpdate();

        togglePopup();
    };

    return (
        <>
            <div className="toolbar text-center" style={{ display: "flex", justifyContent: "center" }}>
                {!isOnResourcesPage && !isOnDisplayHomeworkPage && !isOnDisplayResultPage && !isOnDisplayFinalResultPage && (
                    <>
                        <div style={{ flex: "1", marginRight: "10px" }}>
                            <select id="group" name="group" className="form-control" style={{ width: "100%" }} value={selectedDropdownValue} onChange={handleDropdownChange}>
                                <option value="" disabled hidden>Please select a group</option>
                                {dropdownValues.map(group => (
                                    <option key={group.id} value={group.group}>{group.group}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            {isMobileView ? (
                                <button className="btn btn-success" style={{ marginRight: "10px" }} onClick={updateSelectedUsersGroup} disabled={!selectedDropdownValue}>
                                    <FontAwesomeIcon icon={faSyncAlt} />
                                </button>
                            ) : (
                                <button className="btn btn-success" style={{ marginRight: "10px" }} onClick={updateSelectedUsersGroup} disabled={!selectedDropdownValue}>Update Group</button>
                            )}
                        </div>
                    </>
                )}
                {isOnResourcesPage && (
                    <div style={{ display: "flex", justifyContent: "flex-start", marginRight: "10px" }}>
                        <button className="btn btn-success">
                            <FontAwesomeIcon icon={faDownload} onClick={handleDownload} />
                        </button>
                    </div>
                )}
                {!isOnResourcesPage && !isOnDisplayHomeworkPage && !isOnDisplayResultPage && !isOnDisplayFinalResultPage && (
                    <>
                        {props.user.group === "Admin" &&
                            <>

                                <div style={{ display: "flex", justifyContent: "flex-start", marginRight: "10px" }}>
                                    <ReactSwitch checked={selectedUserStatus} onChange={handleToggleChange} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-start", marginRight: "10px" }}>
                                    <button className="btn btn-danger" onClick={async () => { await togglePopup() }}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </>
                        }
                    </>
                )}
                {isOnDisplayHomeworkPage && (
                    <>
                        {props.user.group === "Admin" &&
                            <>

                                {dropdownValues.map((group) => {
                                    // Exclude specific group values
                                    if (group.group !== "Female Teacher" && group.group !== "Male Teacher" && group.group !== "Admin" && group.group !== "Principal") {
                                        return (
                                            <div key={group.id} className="form-check">
                                                <input type="checkbox" id={group.group} name={group.group} className="form-check-input" checked={selectedGroups.includes(group.group)} onChange={handleGroupCheckboxChange} />
                                                <label htmlFor={group.group} className="form-check-label">
                                                    {group.group}
                                                </label>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                                <button className="btn btn-success" style={{ marginRight: "10px" }} onClick={handleGroupCheckboxUpdate}>
                                    <FontAwesomeIcon icon={faSyncAlt} />
                                </button>

                                <div style={{ display: "flex", justifyContent: "flex-start", marginRight: "10px" }}>
                                    <button className="btn btn-danger" onClick={async () => { await togglePopup2() }}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </>
                        }
                    </>
                )}
                {isOnDisplayResultPage && (
                    <>
                        {props.user.group === "Admin" &&

                            <div style={{ display: "flex", justifyContent: "flex-start", marginRight: "10px" }}>
                                <button className="btn btn-danger" onClick={async () => { await togglePopup3() }}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        }
                    </>
                )}
                {isOnDisplayFinalResultPage && (
                    <>
                        {props.user.group === "Admin" &&

                            <div style={{ display: "flex", justifyContent: "flex-start", marginRight: "10px" }}>
                                <button className="btn btn-danger" onClick={async () => { await togglePopup4() }}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        }
                    </>
                )}
            </div>

            <div>
                {/* Popup box only opens if state variable is set to true for deleting account */}
                {confirmPopup &&
                    <div className="popup-box" style={{ zIndex: "1" }}>
                        <div className="box">
                            <h5 className="card-header bg-warning text-center" style={{ color: "white" }}><b>Confirm!</b></h5>
                            <div style={{ margin: "0 auto", textAlign: "center" }}>
                                <p style={{ padding: "15px", textAlign: "center", color: "red" }}>Are you sure you want delete this users account <br /> This action cannot be undone!</p>
                                <button onClick={togglePopup} className="btn btn-info" style={{ margin: "10px" }}>Cancel</button>
                                <button onClick={async () => { await deleteSelectedUser() }} className="btn btn-danger" style={{ margin: "10px" }}>Delete</button>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div>
                {/* Popup box only opens if state variable is set to true for deleting account */}
                {confirmPopup2 &&
                    <div className="popup-box" style={{ zIndex: "1" }}>
                        <div className="box">
                            <h5 className="card-header bg-warning text-center" style={{ color: "white" }}><b>Confirm!</b></h5>
                            <div style={{ margin: "0 auto", textAlign: "center" }}>
                                <p style={{ padding: "15px", textAlign: "center", color: "red" }}>Are you sure you want delete the Homework <br /> This action cannot be undone!</p>
                                <button onClick={togglePopup2} className="btn btn-info" style={{ margin: "10px" }}>Cancel</button>
                                <button onClick={async () => { await deleteSelectedHomework() }} className="btn btn-danger" style={{ margin: "10px" }}>Delete</button>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div>
                {/* Popup box only opens if state variable is set to true for deleting account */}
                {confirmPopup3 &&
                    <div className="popup-box" style={{ zIndex: "1" }}>
                        <div className="box">
                            <h5 className="card-header bg-warning text-center" style={{ color: "white" }}><b>Confirm!</b></h5>
                            <div style={{ margin: "0 auto", textAlign: "center" }}>
                                <p style={{ padding: "15px", textAlign: "center", color: "red" }}>Are you sure you want delete the Result <br /> This action cannot be undone!</p>
                                <button onClick={togglePopup3} className="btn btn-info" style={{ margin: "10px" }}>Cancel</button>
                                <button onClick={async () => { await deleteSelectedResult() }} className="btn btn-danger" style={{ margin: "10px" }}>Delete</button>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div>
                {/* Popup box only opens if state variable is set to true for deleting account */}
                {confirmPopup4 &&
                    <div className="popup-box" style={{ zIndex: "1" }}>
                        <div className="box">
                            <h5 className="card-header bg-warning text-center" style={{ color: "white" }}><b>Confirm!</b></h5>
                            <div style={{ margin: "0 auto", textAlign: "center" }}>
                                <p style={{ padding: "15px", textAlign: "center", color: "red" }}>Are you sure you want delete the Result <br /> This action cannot be undone!</p>
                                <button onClick={togglePopup4} className="btn btn-info" style={{ margin: "10px" }}>Cancel</button>
                                <button onClick={async () => { await deleteSelectedFinalResult() }} className="btn btn-danger" style={{ margin: "10px" }}>Delete</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    );
}

export default Toolbar;
