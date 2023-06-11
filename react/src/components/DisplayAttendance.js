// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { selectedId, getSelectedId, deleteAttendance, getAllAttendance, getAttendance  } from "../data/repository";

function DisplayAttendance(props) {

    const [attendanceData, setAttendanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [confirmPopup, setconfirmPopup] = useState(false);

    // Load users from DB.
    useEffect(() => {

        // Loads User Details from DB
        const loadAttendanceData = async () => {
            const attendance = await getAllAttendance();
            setAttendanceData(attendance);
            setIsLoading(false);
        }

        // Calls the functions above
        loadAttendanceData();

    }, []);

    // Popup Toggle Switch Function
    const togglePopup = () => {
        setconfirmPopup(!confirmPopup);
    }

    const deleteSelectedAttendance = async (event) => {

        const currentDetails = await getAttendance(getSelectedId());

        await deleteAttendance(currentDetails);
      
        // Update Page/Refresh the Data
        const updatedDetails = await getAllAttendance();
        setAttendanceData(updatedDetails);
      
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
                        <span className="text-muted">Loading Classes...</span>
                    </div>
                    :
                    <div>
                        <table className="table table-striped" style={{ margin: "0" }}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th style={{ color: "#112c3f" }} scope="col">Date</th>
                                    <th></th>
                                </tr>
                            </thead>
                            {/* Mapping Users state Variable to access its content easily to display in Table */}
                            {attendanceData.filter((attendance) => {
                                return search.toLowerCase() === '' ? attendance : (attendance.date && attendance.date.toLowerCase().includes(search));
                            }).map((attendance) =>
                                <tbody key={attendance.date}>

                                    <tr>
                                        <td></td>
                                        <td style={{ color: "#112c3f" }}>{new Date(attendance.date).toLocaleDateString()}</td>
                                        <td>
                                            <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await selectedId(attendance.date); await togglePopup() }} >Delete</button>
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
                {/* Popup box only opens if state variable is set to true for deleting account */}
                {confirmPopup &&
                    <div className="popup-box">
                        <div className="box">
                            <h5 className="card-header bg-warning text-center" style={{ color: "white" }}><b>Confirm!</b></h5>
                            <div style={{ margin: "0 auto", textAlign: "center" }}>
                                <p style={{ padding: "15px", textAlign: "center", color: "red" }}>Are you sure you want delete this Attendance record <br /> This action cannot be undone!</p>
                                <button onClick={togglePopup} className="btn btn-info" style={{ margin: "10px" }}>Cancel</button>
                                <button onClick={async () => { await deleteSelectedAttendance() }} className="btn btn-danger" style={{ margin: "10px" }}>Delete</button>
                            </div>
                        </div>
                    </div>
                }
            </div>

        </>
    )
}

// Export the Student Function
export default DisplayAttendance;