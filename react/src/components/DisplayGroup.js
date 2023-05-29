// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { getGroupById, getGroups, selectedId, getSelectedId, deleteGroup } from "../data/repository";

function DisplayGroup(props) {

    const [groups, setGroupsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [confirmPopup, setconfirmPopup] = useState(false);


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

    }, []);


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
                                    <th></th>

                                </tr>
                            </thead>
                            {/* Mapping Users state Variable to access its content easily to display in Table */}
                            {groups.filter((groupDetails) => {
                                return search.toLowerCase() === '' ? groupDetails : groupDetails.group.toLowerCase().includes(search) || groupDetails.id.includes(search);
                            }).map((groupDetails) =>
                                <tbody key={groupDetails.id}>

                                    <tr>
                                        <td></td>
                                        <td style={{ color: "#112c3f" }}>{groupDetails.id}</td>
                                        <td style={{ color: "#112c3f" }}>{groupDetails.group}</td>
                                        <td>
                                            <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await selectedId(groupDetails.id); await togglePopup() }} >Delete</button>
                                        </td>
                                    </tr>


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
                                <p style={{ padding: "15px", textAlign: "center", color: "red" }}>Are you sure you want delete this Group <br /> This action cannot be undone!</p>
                                <button onClick={togglePopup} className="btn btn-info" style={{ margin: "10px" }}>Cancel</button>
                                <button onClick={async () => { await deleteSelectedGroup() }} className="btn btn-danger" style={{ margin: "10px" }}>Delete</button>
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