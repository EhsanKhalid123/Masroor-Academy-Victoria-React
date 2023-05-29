// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { selectedId, selectedId2, getProfileUsers, deleteUserDB, getSelectedId, getProfile } from "../data/repository";

function DisplayStaff(props) {

    const [users, setUsersData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [confirmPopup, setconfirmPopup] = useState(false);

    let userProfilePage = "userProfile";
    let groupNumber = 6;

    // Load users from DB.
    useEffect(() => {

        // Loads User Details from DB
        async function loadUserDetails() {
            const currentDetails = await getProfileUsers();
            setUsersData(currentDetails)
            setIsLoading(false);
        }

        // Calls the functions above
        loadUserDetails();

    }, []);


    // Popup Toggle Switch Function
    const togglePopup = () => {
        setconfirmPopup(!confirmPopup);
    }

    const deleteSelectedUser = async (event) => {
        const currentDetails = await getProfile(getSelectedId());

        await deleteUserDB(currentDetails);

        // Update Page/Refresh the Data
        const updatedDetails = await getProfileUsers();
        setUsersData(updatedDetails);

        togglePopup();

    }

    const handleSearch = async (event) => {
        setSearch(event.target.value.toLowerCase());
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

            <div className="table-responsive">

                {isLoading ?
                    <div className="card-body text-center">
                        <span className="text-muted">Loading Staff...</span>
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
                                    <th></th>

                                </tr>
                            </thead>
                            {/* Mapping Users state Variable to access its content easily to display in Table */}
                            {users.filter((userDetails) => {
                                return search.toLowerCase() === '' ? userDetails : userDetails.name.toLowerCase().includes(search) || userDetails.group.toLowerCase().includes(search) || userDetails.id.toLowerCase().includes(search) || userDetails.gender.toLowerCase().includes(search);
                            }).map((userDetails) =>
                                <tbody key={userDetails.id}>
                                    {/* Dont display the name of the logged in user and the System Admin but the rest of the staff */}
                                    {(userDetails.name !== props.user.name && userDetails.id !== "Admin" && (userDetails.group === "Admin" || userDetails.group === "Male Teacher" || userDetails.group === "Female Teacher")) &&
                                        <>
                                
                                            <tr>
                                                <td></td>
                                                <td style={{ color: "#112c3f" }}>{userDetails.id}</td>
                                                <td style={{ color: "#112c3f" }}>{userDetails.name}</td>
                                                <td style={{ color: "#112c3f" }}>{userDetails.group}</td>

                                                <td>
                                                    <Link to="/Profile" state={{ groupNumber, userProfilePage }}>
                                                        <button className="btn2 btn-custom" onClick={() => { selectedId(userDetails.id); selectedId2(userDetails.name) }}>Select</button>
                                                    </Link>
                                                    {(props.user.id === "Admin") &&
                                                        <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await selectedId(userDetails.id); await togglePopup() }} >Delete</button>
                                                    }
                                                </td>
                                            </tr>

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
export default DisplayStaff;