// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAllFinalResults, getFinalResultsByID, getGroups, selectedId, getSelectedId, deleteFinalResults } from "../data/repository";

function ViewAllResults(props) {

    const [finalResults, setFinalResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [groups, setGroupsData] = useState([]);
    const [confirmPopup, setconfirmPopup] = useState(false);
    const { groupNumber } = useParams();

    // Load users from DB.
    useEffect(() => {

        // Loads User Details from DB
        async function loadFinalResultsDetails() {
            const currentDetails = await getAllFinalResults();
            setFinalResults(currentDetails)
            setIsLoading(false);
        }

        // Loads User Details from DB
        async function loadGroupDetails() {
            const currentGroups = await getGroups();
            setGroupsData(currentGroups)
        }

        // Calls the functions above
        loadFinalResultsDetails();
        loadGroupDetails();

    }, []);


    const handleSearch = async (event) => {
        setSearch(event.target.value.toLowerCase());
    }

    // Popup Toggle Switch Function
    const togglePopup = () => {
        setconfirmPopup(!confirmPopup);
    }

    const deleteSelectedFinalResult = async (event) => {

        const currentDetails = await getFinalResultsByID(getSelectedId());

        await deleteFinalResults(currentDetails);

        // Update Page/Refresh the Data
        const updatedDetails = await getAllFinalResults();
        setFinalResults(updatedDetails);

        togglePopup();
    }


    // Check if groupNumber is 5 to determine filtering
    const shouldFilterResults = groupNumber !== "5";

    let groupDetails;

    const group = groups.find((group) => group.id === groupNumber);

    if (group) {
        groupDetails = group.group;
    } else {
        groupDetails = "Invalid group number";
    }

    // Filter final results based on selected group (if applicable)
    const filteredResults = shouldFilterResults
        ? finalResults.filter((result) => result.studentGroup === groupDetails)
        : finalResults;


    return (
        <>
            <br />
            <div className="searchCenter">
                <div className="form-group has-search">
                    <span className="fa fa-search form-control-feedback"></span>
                    <input type="text" style={{ border: "1px solid #112c3f", borderRadius: "10rem" }} className="form-control" placeholder="Search" aria-label="Search" onChange={handleSearch} />
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <Link to="/SelectGroupResults">
                    <button type="button" style={{ margin: "5px" }} className="text-center btn btn-success">Go Back to Select Group</button>
                </Link>
            </div>

            <div className="table-responsive">

                {isLoading ?
                    <div className="card-body text-center">
                        <span className="text-muted">Loading Results...</span>
                    </div>
                    :
                    <>
                        {finalResults.length === 0 ?
                            <div className="text-center">
                                <p>&nbsp;</p>
                                <span className="text-muted">There are no results!</span>
                                <p>&nbsp;</p>
                            </div>
                            :
                            <div>
                                <table className="table table-striped" style={{ margin: "0" }}>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th style={{ color: "#112c3f" }} scope="col">Student ID</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Student Name</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Student Group</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Fathers Name</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Mothers Name</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Parent Email</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Student Email</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Suject Result</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Final Result</th>
                                            <th style={{ color: "#112c3f" }} scope="col">Attendance Result</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    {/* Mapping Users state Variable to access its content easily to display in Table */}
                                    {filteredResults.filter((result) => {
                                        return search.toLowerCase() === '' ? result : (result.studentID && result.studentID.toLowerCase().includes(search)) || (result.studentName && result.studentName.toLowerCase().includes(search)) || (result.fathersName && result.fathersName.toLowerCase().includes(search)) || (result.mothersName && result.mothersName.toLowerCase().includes(search)) || (result.finalResult && result.finalResult.includes(search)) || (result.attendanceResult && result.attendanceResult.includes(search));
                                    }).filter((userDetails) => {
                                        return(
                                        ((props.user.group === "Female Teacher" && userDetails.studentGender === "Nasirat" && userDetails.archived !== true) ||
                                                    (props.user.group === "Male Teacher" && userDetails.studentGender === "Atfal" && userDetails.archived !== true) ||
                                                    (props.user.group === "Admin" && userDetails.archived !== true) ||
                                                    (props.user.group === "Admin" && props.user.id === "Admin") ||
                                                    (props.user.group === "Principal" && props.user.gender === "Female" && userDetails.studentGender === "Nasirat" && userDetails.archived !== true) ||
                                                    (props.user.group === "Principal" && props.user.gender === "Male" && userDetails.studentGender === "Atfal" && userDetails.archived !== true)
                                                ) 
                                        );
                                    }).map((result) =>
                                        <tbody key={result.studentID}>
                                            <>
                                                <tr>
                                                    <td></td>
                                                    <td style={{ color: "#112c3f" }}>{result?.studentID}</td>
                                                    <td style={{ color: "#112c3f" }}>{result?.studentName}</td>
                                                    <td style={{ color: "#112c3f" }}>{result?.studentGroup}</td>
                                                    <td style={{ color: "#112c3f" }}>{result?.fathersName}</td>
                                                    <td style={{ color: "#112c3f" }}>{result?.mothersName}</td>
                                                    <td style={{ color: "#112c3f" }}>{result?.parentEmail}</td>
                                                    <td style={{ color: "#112c3f" }}>{result?.studentEmail}</td>
                                                    <td style={{ color: "#112c3f" }}>
                                                        {result?.subjectResult.map((subjectObj, index) => (
                                                            Object.entries(subjectObj).map(([key, value]) => (
                                                                <div key={key}>
                                                                    <span style={{ fontWeight: "bold" }}>{key}:</span> {value}
                                                                </div>
                                                            ))
                                                        ))}
                                                    </td>
                                                    <td style={{ color: "#112c3f" }}>{result?.finalResult}</td>
                                                    <td style={{ color: "#112c3f" }}>{result?.attendanceResult}</td>
                                                    <td>
                                                    {props.user.group === "Admin" &&
                                                        <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await selectedId(result?.studentID); await togglePopup() }} >Delete</button>
                                                    }
                                                </td>
                                                </tr>
                                            </>
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
                                <button onClick={async () => { await deleteSelectedFinalResult() }} className="btn btn-danger" style={{ margin: "10px" }}>Delete</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

// Export the Student Function
export default ViewAllResults;