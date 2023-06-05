// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { selectedId, selectedId2, getProfileUsers, deleteUserDB, getSelectedId, getProfile, deleteHomeworks2, getGroups } from "../data/repository";
import Toolbar from "./Toolbar";

function DisplayStudents(props) {

    const [users, setUsersData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [confirmPopup, setconfirmPopup] = useState(false);
    const [groups, setGroupsData] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const { groupNumber } = useParams();
    let userProfilePage;

    // Load users from DB.
    useEffect(() => {

        // Loads User Details from DB
        async function loadUserDetails() {
            const currentDetails = await getProfileUsers();
            setUsersData(currentDetails)
            setIsLoading(false);
        }

        // Loads User Details from DB
        async function loadGroupDetails() {
            const currentGroups = await getGroups();
            setGroupsData(currentGroups)
        }

        // Calls the functions above
        loadUserDetails();
        loadGroupDetails();

    }, []);


    // Popup Toggle Switch Function
    const togglePopup = () => {
        setconfirmPopup(!confirmPopup);
    }

    const deleteSelectedUser = async (event) => {
        const currentDetails = await getProfile(getSelectedId());

        const id = { id: await getSelectedId() };
        await deleteHomeworks2(id);
        await deleteUserDB(currentDetails);

        // Update Page/Refresh the Data
        const updatedDetails = await getProfileUsers();
        setUsersData(updatedDetails);

        togglePopup();

    }

    const handleSearch = async (event) => {
        setSearch(event.target.value.toLowerCase());
    }

    const handleBulkUpdate = async () => {
        const updatedDetails = await getProfileUsers();
        setUsersData(updatedDetails);
        setSelectedIds([]);
    };

    const handleSelectStaff = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    let groupDetails;

    const group = groups.find((group) => group.id === groupNumber);

    if (group) {
        groupDetails = group.group;
    } else {
        groupDetails = "Invalid group number";
    }

    let linkTo;
    let selectLink;

    if (props.group === "homework") {
        linkTo = "/SelectGroupHomework";
        selectLink = "/AddHomework";
    } else if (props.group === "student") {
        linkTo = "/SelectGroupStudent";
        selectLink = "/Profile";
        userProfilePage = "userProfile";
    }

    return (
        <>
            <br />
            <div className="searchCenter">
                <div className="form-group has-search">
                    <span className="fa fa-search form-control-feedback"></span>
                    <input type="text" style={{ border: "1px solid #112c3f", borderRadius: "10rem" }} className="form-control" placeholder="Search" aria-label="Search" onChange={handleSearch} />
                </div>
            </div>

            {props.group === "student" && (props.user.group === "Admin" || (props.user.group === "Principal" && props.user.gender === "Male")) &&
                <>
                    {selectedIds.length > 0 && <Toolbar selectedUser={selectedIds} onUpdate={handleBulkUpdate} props={props} />}
                    <br />
                </>
            }

            <div style={{ display: "flex", justifyContent: "center" }}>
                <Link to={linkTo}>
                    <button type="button" style={{ margin: "5px" }} className="text-center btn btn-success">Go Back to Select Group</button>
                </Link>
            </div>

            <div className="table-responsive">

                {isLoading ?
                    <div className="card-body text-center">
                        <span className="text-muted">Loading Students...</span>
                    </div>
                    :
                    <div>
                        <table className="table table-striped" style={{ margin: "0" }}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th style={{ color: "#112c3f" }} scope="col">ID</th>
                                    <th style={{ color: "#112c3f" }} scope="col">Name</th>
                                    <th style={{ color: "#112c3f" }} scope="col">Group</th>
                                    <th style={{ color: "#112c3f" }} scope="col">Gender</th>
                                    <th></th>

                                </tr>
                            </thead>
                            {/* Mapping Users state Variable to access its content easily to display in Table */}
                            {users.filter((userDetails) => {
                                return search.toLowerCase() === '' ? userDetails : (userDetails.name && userDetails.name.toLowerCase().includes(search)) || (userDetails.group && userDetails.group.toLowerCase().includes(search)) || (userDetails.id && userDetails.id.toLowerCase().includes(search)) || (userDetails.gender && userDetails.gender.toLowerCase().includes(search));
                            }).map((userDetails) =>
                                <tbody key={userDetails.id}>
                                    {/* Dont display the name of the logged in user but the rest, And dont show Admin for teachers */}
                                    {(userDetails.name !== props.user.name && userDetails.group !== "Admin" && userDetails.group !== "Male Teacher" && userDetails.group !== "Female Teacher" && userDetails.group !== "Principal") &&
                                        <>
                                            {/* If logged in user is FemaleTeachers then Display only Nasirat List and If MaleTeahers are logged in show only Atfal list or if Admin is logged in show full list*/}
                                            {((props.user.group === "Female Teacher" && userDetails.gender === "Nasirat" && userDetails.archived !== true && (groupNumber === "5" || userDetails.group === groupDetails)) ||
                                                (props.user.group === "Male Teacher" && userDetails.gender === "Atfal" && userDetails.archived !== true && (groupNumber === "5" || userDetails.group === groupDetails)) ||
                                                (props.user.group === "Admin" && userDetails.archived !== true && (groupNumber === "5" || userDetails.group === groupDetails)) ||
                                                (props.user.group === "Admin" && props.user.id === "Admin" && (groupNumber === "5" || userDetails.group === groupDetails)) ||
                                                (props.user.group === "Principal" && props.user.gender === "Female" && userDetails.gender === "Nasirat" && userDetails.archived !== true && (groupNumber === "5" || userDetails.group === groupDetails)) ||
                                                (props.user.group === "Principal" && props.user.gender === "Male" && userDetails.archived !== true && (groupNumber === "5" || userDetails.group === groupDetails))
                                            ) &&
                                                <tr>
                                                    <td>
                                                        {props.group === "student" && (props.user.group === "Admin" || (props.user.group === "Principal" && props.user.gender === "Male")) &&
                                                            <>
                                                                {/*    Check if staff member is selected                                 Call handleSelectStaff function on selection/deselection */}
                                                                <input type="checkbox" className="checkbox" checked={selectedIds.includes(userDetails.id)} onChange={() => handleSelectStaff(userDetails.id)} />
                                                            </>
                                                        }
                                                    </td>
                                                    <td style={{ color: "#112c3f" }}>{userDetails.id}</td>
                                                    <td style={{ color: "#112c3f" }}>{userDetails.name}</td>
                                                    <td style={{ color: "#112c3f" }}>{userDetails.group}</td>
                                                    <td style={{ color: "#112c3f" }}>{userDetails.gender}</td>

                                                    <td>
                                                        <Link to={selectLink} state={{ groupNumber, userProfilePage }}>
                                                            <button className="btn2 btn-custom" onClick={() => { selectedId(userDetails.id); selectedId2(userDetails.name) }}>Select</button>
                                                        </Link>

                                                        {(props.user.group === "Admin" && props.group === "student" && props.user.id === "Admin") &&
                                                            <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await selectedId(userDetails.id); await togglePopup() }} >Delete</button>
                                                        }
                                                    </td>
                                                </tr>
                                            }
                                        </>
                                    }


                                </tbody>
                            )}
                        </table>
                    </div>
                }
            </div>

            <div>
                {/* Popup box only opens if state variable is set to true for deleting account */}
                {confirmPopup &&
                    <div className="popup-box">
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
    )
}

// Export the Student Function
export default DisplayStudents;