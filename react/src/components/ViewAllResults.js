// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAllFinalResults, getFinalResultsByID, getGroups, selectedId, getSelectedId, deleteFinalResults } from "../data/repository";
import Toolbar from "./Toolbar";
import * as XLSX from 'xlsx';

function ViewAllResults(props) {

    const [finalResults, setFinalResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [groups, setGroupsData] = useState([]);
    const [confirmPopup, setconfirmPopup] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
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

    const handleBulkUpdate = async () => {
        const updatedDetails = await getAllFinalResults();
        setFinalResults(updatedDetails);
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
            const result = finalResults
                .map(result => result.studentID);
            setSelectedIds(result);
        } else {
            setSelectedIds([]);
        }
        setSelectAll(!selectAll);
    };


    const exportToExcel = () => {
        const formattedData = filteredResults.map(result => {
            const data = {
                'Student ID': result.studentID,
                'Student Name': result.studentName,
                'Student Group': result.studentGroup,
                'Student Gender': result.studentGender,
                'Fathers Name': result.fathersName,
                'Mothers Name': result.mothersName,
                'Parent Email': result.parentEmail,
                'Student Email': result.studentEmail,
            };

            // Extract subject names dynamically from the first item
            const subjectNames = result.subjectResult.reduce((acc, subject) => {
                Object.keys(subject).forEach(key => {
                    if (!acc.includes(key)) {
                        acc.push(key);
                    }
                });
                return acc;
            }, []);

            // Assign values to subject columns
            subjectNames.forEach(subject => {
                const subjectValue = result.subjectResult.reduce((val, subjectObj) => {
                    return subjectObj[subject] ? `${val}${val ? ', ' : ''}${subjectObj[subject]}` : val;
                }, '');
                data[subject] = subjectValue;
            });

            data['Final Result'] = result.finalResult;
            data['Attendance Result'] = result.attendanceResult;

            return data;
        });

        // Sorting the formatted data
        formattedData.sort((a, b) => {
            // Sort by group
            if (a['Student Group'] !== b['Student Group']) {
                return a['Student Group'].localeCompare(b['Student Group']);
            }

            // Sort by gender (male first)
            if (a['Student Gender'] !== b['Student Gender']) {
                return a['Student Gender'] === 'Male' ? -1 : 1;
            }

            return 0; // Maintain original order if both gender and group are the same
        });

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Results');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveExcelFile(excelBuffer, 'Final Student Result Sheet.xlsx');
    };

    // The saveExcelFile function remains the same


    const saveExcelFile = (buffer, fileName) => {
        const data = new Blob([buffer], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


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
    const filteredResults = shouldFilterResults ? finalResults.filter((result) => result.studentGroup === groupDetails) : finalResults;


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

            <div style={{ display: "flex", justifyContent: "center" }}>
                <Link to="/SelectGroupResults">
                    <button type="button" style={{ margin: "5px" }} className="text-center btn btn-success">Go Back to Select Group</button>
                </Link>

                <button type="button" onClick={exportToExcel} style={{ margin: "5px" }} className="text-center btn btn-primary">Export to Excel</button>
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
                                            {(props.user.group === "Admin" || (props.user.group === "Principal" && props.user.gender === "Male")) ?
                                                <th><input type="checkbox" className="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
                                                :
                                                <th></th>
                                            }
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
                                        return (
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
                                                    <td>
                                                        {/*    Check if staff member is selected                                 Call handleSelectStaff function on selection/deselection */}
                                                        {(props.user.group === "Admin" || (props.user.group === "Principal" && props.user.gender === "Male")) &&
                                                            <input type="checkbox" className="checkbox" checked={selectedIds.includes(result.studentID)} onChange={() => handleSelectResult(result.studentID)} />
                                                        }
                                                    </td>
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