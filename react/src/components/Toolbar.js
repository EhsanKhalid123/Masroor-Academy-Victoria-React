import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faDownload, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { getProfileUsers, deleteUserDB, getGroups, updateUser, fetchResourcesByID, fetchResources } from "../data/repository";
import { useLocation } from "react-router-dom";


function Toolbar({ selectedUser, onUpdate, props, selectedResources }) {

    const [confirmPopup, setconfirmPopup] = useState(false);
    const [users, setUsersData] = useState([]);
    const [dropdownValues, setDropdownValues] = useState([]);
    const [selectedDropdownValue, setSelectedDropdownValue] = useState("");
    const [isMobileView, setIsMobileView] = useState(false);
    const location = useLocation();
    const isOnResourcesPage = location.pathname.includes("/Resources");
    const [resources, setResources] = useState([]);


    // Load users from DB.
    useEffect(() => {

        // Loads User Details from DB
        async function loadUserDetails() {
            const currentDetails = await getProfileUsers();
            setUsersData(currentDetails)
        }

        async function loadGroups() {
            const currentGroups = await getGroups();
            setDropdownValues(currentGroups);
        }

        async function loadResources() {
            const currentResources = await fetchResources();
            setResources(currentResources);
        }

        // Calls the functions above
        loadUserDetails();
        loadGroups();
        loadResources();

    }, []);

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

    return (
        <>
            <div className="toolbar text-center" style={{ display: "flex", justifyContent: "center" }}>
                {!isOnResourcesPage && (
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
                {!isOnResourcesPage && (
                    <>
                        {props.user.group === "Admin" &&
                            <div style={{ display: "flex", justifyContent: "flex-start", marginRight: "10px" }}>
                                <button className="btn btn-danger" onClick={async () => { await togglePopup() }}>
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
        </>
    );
}

export default Toolbar;
