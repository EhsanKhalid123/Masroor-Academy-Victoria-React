// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { selectedId, getSelectedId, getAllResults, getResultsByID, deleteResults, getProfileUsers } from "../data/repository";
import Toolbar from "./Toolbar";

function DisplayMarkedHomework(props) {

    const [resultsData, setResultsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [confirmPopup, setconfirmPopup] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [users, setUsersData] = useState([]);

    // Load users from DB.
    useEffect(() => {

        // Loads User Details from DB
        const loadResultsData = async () => {
            const results = await getAllResults();
            setResultsData(results);
            setIsLoading(false);
        }

        // Loads User Details from DB
        async function loadUserDetails() {
            const currentDetails = await getProfileUsers();
            setUsersData(currentDetails)
            setIsLoading(false);
        }

        // Calls the functions above
        loadResultsData();
        loadUserDetails();

    }, []);

    // Popup Toggle Switch Function
    const togglePopup = () => {
        setconfirmPopup(!confirmPopup);
    }

    const findStudentName = (studentID) => {
        const userWithMatchingID = users.find(user => user.id === studentID);
        return userWithMatchingID ? userWithMatchingID.name : "";
    };

    const findFatherName = (studentID) => {
        const userWithMatchingID = users.find(user => user.id === studentID);
        return userWithMatchingID ? userWithMatchingID.fathersName : "";
    };

    const deleteSelectedResult = async (event) => {

        const currentDetails = await getResultsByID(getSelectedId());

        await deleteResults(currentDetails);

        // Update Page/Refresh the Data
        const updatedDetails = await getAllResults();
        setResultsData(updatedDetails);

        togglePopup();
    }

    const handleSearch = async (event) => {
        setSearch(event.target.value.toLowerCase());
    }

    const handleBulkUpdate = async () => {
        const updatedDetails = await getAllResults();
        setResultsData(updatedDetails);
        setSelectedIds([]);
    };

    const handleSelectResult = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (!selectAll) {
            const result = resultsData
                .map(results => results.resultID);
            setSelectedIds(result);
        } else {
            setSelectedIds([]);
        }
        setSelectAll(!selectAll);
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

            {(props.user.group === "Admin" || (props.user.group === "Principal" && props.user.gender === "Male")) &&
                <>
                    {selectedIds.length > 0 && <Toolbar selectedUser={selectedIds} onUpdate={handleBulkUpdate} props={props} />}
                    <br />
                </>
            }

            <div className="table-responsive">

                {isLoading ?
                    <div className="card-body text-center">
                        <span className="text-muted">Loading Results...</span>
                    </div>
                    :
                    <>
                        {resultsData.length === 0 ?
                            <div className="text-center">
                                <p>&nbsp;</p>
                                <span className="text-muted">No Results are Available!</span>
                                <p>&nbsp;</p>
                            </div>
                            :
                            <div>
                                <table className="table table-striped" style={{ margin: "0" }}>
                                    <thead>
                                        <tr>
                                            {(props.user.group === "Admin" || (props.user.group === "Principal" && props.user.gender === "Male")) ?
                                                <th><input type="checkbox" className="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
                                                :
                                                <th></th>
                                            }
                                            <th style={{ color: "#112c3f" }} scope="col">Results ID</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Student ID</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Name</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Father</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Student Group</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Class</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Result</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    {/* Mapping Users state Variable to access its content easily to display in Table */}
                                    {resultsData.filter((result) => {
                                        return search.toLowerCase() === '' ? result : (result.resultID && result.resultID.includes(search));
                                    }).map((result) =>
                                        <tbody key={result.resultID}>

                                            <tr>
                                                <td>
                                                    {/*    Check if staff member is selected                                 Call handleSelectStaff function on selection/deselection */}
                                                    {(props.user.group === "Admin" || (props.user.group === "Principal" && props.user.gender === "Male")) &&
                                                        <input type="checkbox" className="checkbox" checked={selectedIds.includes(result.resultID)} onChange={() => handleSelectResult(result.resultID)} />
                                                    }
                                                </td>
                                                <td style={{ color: "#112c3f" }}>{result.resultID}</td>
                                                <td style={{ color: "#112c3f" }}>{result.studentID}</td>
                                                <td style={{ color: "#112c3f" }}>{findStudentName(result.studentID)}</td>
                                                <td style={{ color: "#112c3f" }}>{findFatherName(result.studentID)}</td>
                                                <td style={{ color: "#112c3f" }}>{result.studentGroup}</td>
                                                <td style={{ color: "#112c3f" }}>{result.class}</td>
                                                <td style={{ color: "#112c3f" }}>{result.result}</td>
                                                <td>
                                                    {props.user.group === "Admin" &&
                                                        <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await selectedId(result.resultID); await togglePopup() }} >Delete</button>
                                                    }
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
                                <p style={{ padding: "15px", textAlign: "center", color: "red" }}>Are you sure you want delete this result record <br /> This action cannot be undone!</p>
                                <button onClick={togglePopup} className="btn btn-info" style={{ margin: "10px" }}>Cancel</button>
                                <button onClick={async () => { await deleteSelectedResult() }} className="btn btn-danger" style={{ margin: "10px" }}>Delete</button>
                            </div>
                        </div>
                    </div>
                }
            </div>

        </>
    )
}

// Export the Student Function
export default DisplayMarkedHomework;