// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { getProfileUsers, getAttendance, createAttendance, updateAttendance, getAllAttendance } from "../data/repository";


// Functional Component for Login Page
function Attendance(props) {
    // Declaration of useState Variables and Hook

    const [users, setUsersData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [attendanceData2, setAttendanceData2] = useState([]);
    const currentDate = new Date().toLocaleDateString();

    useEffect(() => {

        // Loads User Details from DB
        async function loadUserDetails() {
            const currentDetails = await getProfileUsers();
            setUsersData(currentDetails)
            setIsLoading(false);
        }

        const loadAttendanceData = async () => {
            const attendance = await getAttendance(currentDate);
            setAttendanceData(attendance?.attendance || []);

        }

        const loadAttendanceData2 = async () => {
            const attendance = await getAllAttendance();
            setAttendanceData2(attendance);
        }

        const loadAllAttendanceData = async () => {
            const attendance = await getAllAttendance();
            const lastFiveRecords = attendance.slice(-5); // Get the last 5 records
            setAttendanceRecords(lastFiveRecords);
        }

        // Calls the functions above
        loadUserDetails();
        loadAttendanceData();
        loadAttendanceData2();
        loadAllAttendanceData();

    }, [currentDate]);


    const handleSearch = async (event) => {
        setSearch(event.target.value.toLowerCase());
    }

    const handleAttendanceChange = async (staffId, status, staffGroup) => {

        let updatedAttendanceData = attendanceData.map((staff) => {
            if (staff && staff.id === staffId) {
                return { ...staff, status };
            }
            return staff;
        });

        const formattedCurrentDate = new Date(currentDate).toISOString();
        // Update attendanceData2 locally
        const updatedAttendanceData2 = attendanceData2.map(record => {
            if (record.date === formattedCurrentDate) {
                return { ...record, attendance: updatedAttendanceData };
            }
            return record;
        });

        setAttendanceData2(updatedAttendanceData2);

        const existingAttendance = await getAttendance(currentDate);;

        if (existingAttendance) {

            const existingstaff = updatedAttendanceData.find((staff) => staff?.id === staffId);
            if (!existingstaff) {
                updatedAttendanceData.push({
                    id: staffId,
                    group: staffGroup,
                    status: status,
                    // Add other properties based on the model schema
                });
            }
        } else {
            updatedAttendanceData = [
                ...attendanceData,
                {
                    id: staffId,
                    group: staffGroup,
                    status: status,
                    // Add other properties based on the model schema
                },
            ];
        }

        if (existingAttendance) {
            await updateAttendance(currentDate, updatedAttendanceData);
        } else {
            await createAttendance(currentDate, updatedAttendanceData);
        }

        setAttendanceData(updatedAttendanceData);
    };

    // Calculate present and absent percentages
    const calculatePercentages = (staffId) => {
        let totalAttendance = attendanceData2.length;
        let presentCount = 0;
        let absenceCount = 0;
        let approvedLeaveCount = 0;

        attendanceData2.forEach((record) => {
            record.attendance.forEach((staff) => {
                if (staff.id === staffId) {
                    // totalAttendance++;
                    if (staff.status === "Present") {
                        presentCount++;
                    } else if (staff.status === "Absent") {
                        absenceCount++;
                    } else if (staff.status === "Approved Leave") {
                        approvedLeaveCount++;
                    }
                }
            });
        });

        // Add 15% to the present count for approved leave
        presentCount += approvedLeaveCount * 0.15;

        return {
            presentPercentage: totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0,
            absencePercentage: totalAttendance > 0 ? (absenceCount / totalAttendance) * 100 : 0,
        };
    };


    return (

        <div>
            <p>&nbsp;</p>
            <h3 className="text-center">Mark Attendance:</h3>

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
                                    <th className="text-center" style={{ color: "#112c3f" }} scope="col">Mark Attendance</th>
                                    <th style={{ color: "#112c3f" }} scope="col">Last 5 Attendances</th>
                                    <th style={{ color: "#112c3f" }} scope="col">Total Absences</th>
                                    <th style={{ color: "#112c3f" }} scope="col">Total Presents</th>

                                </tr>
                            </thead>
                            {/* Mapping Users state Variable to access its content easily to display in Table */}
                            {users.filter((userDetails) => {
                                return search.toLowerCase() === '' ? userDetails : (userDetails.name && userDetails.name.toLowerCase().includes(search)) || (userDetails.group && userDetails.group.toLowerCase().includes(search)) || (userDetails.id && userDetails.id.toLowerCase().includes(search)) || (userDetails.gender && userDetails.gender.toLowerCase().includes(search));
                            }).map((userDetails) => {
                                // Check if the staff ID exists in the attendanceData array
                                const attendancestaff = attendanceData.find((staff) => staff.id === userDetails.id);

                                // Get the status if the staff exists in the attendanceData array
                                const status = attendancestaff ? attendancestaff.status : "";

                                const lastFiveAttendances = attendanceRecords.map(record => record.attendance.find(staff => staff.id === userDetails.id));
                                const attendanceStatus = lastFiveAttendances
                                    .map((record) => {
                                        if (record) {
                                            if (record.status === "Present") {
                                                return "✔️";
                                            } else if (record.status === "Absent") {
                                                return "❌";
                                            } else if (record.status === "Approved Leave") {
                                                return "🟠";
                                            }
                                        }
                                        return "🚫";
                                    })
                                    // .reverse()
                                    .join("");

                                const percentages = calculatePercentages(userDetails.id);
                                const { presentPercentage, absencePercentage } = percentages;

                                return (
                                    <tbody key={userDetails.id}>
                                        {/* Dont display the name of the logged in user and the System Admin but the rest of the staff */}
                                        {((userDetails.id !== "Admin") &&
                                            (
                                                (props.user.group === "Admin" &&
                                                    (userDetails.group === "Male Teacher" || userDetails.group === "Female Teacher" || userDetails.group === "Principal" || userDetails.group === "Admin")
                                                ) ||
                                                (
                                                    (props.user.group === "Principal" && props.user.gender === "Female") &&
                                                    (userDetails.group === "Female Teacher" || userDetails.id === props.user.id)
                                                ) ||
                                                (
                                                    (props.user.group === "Principal" && props.user.gender === "Male") &&
                                                    (userDetails.group === "Male Teacher" || userDetails.id === props.user.id)
                                                )
                                            ) 
                                        ) &&
                                            <>
                                                <tr>
                                                    <td></td>
                                                    <td style={{ color: "#112c3f" }}>{userDetails.id}</td>
                                                    <td style={{ color: "#112c3f" }}>{userDetails.name}</td>
                                                    {(userDetails.group === "Principal" && userDetails.gender === "Female") ? (
                                                        <td style={{ color: "#112c3f" }}>In Charge Girls Section</td>
                                                    ) : (
                                                        <td style={{ color: "#112c3f" }}>{userDetails.group}</td>
                                                    )}
                                                    <td style={{ color: "#112c3f" }}>
                                                        <div className="attendance-buttons">
                                                            <button className={`attendance-button ${status === "Present" ? "selected present" : "present"}`} onClick={() => handleAttendanceChange(userDetails.id, "Present", userDetails.group)}>Present</button>
                                                            <button className={`attendance-button ${status === "Absent" ? "selected absent" : "absent"}`} onClick={() => handleAttendanceChange(userDetails.id, "Absent", userDetails.group)}>Absent</button>
                                                            <button className={`attendance-button ${status === "Approved Leave" ? "selected approved" : "approved"}`} onClick={() => handleAttendanceChange(userDetails.id, "Approved Leave", userDetails.group)}>Approved Leave</button>
                                                        </div>
                                                    </td>
                                                    {/* <td style={{ color: "#112c3f" }}>➡{attendanceStatus}</td> */}
                                                    <td style={{ color: "#112c3f", verticalAlign: "top" }}>
                                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                                            <span>➡</span>
                                                            <span>{attendanceStatus}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ color: "#112c3f" }}>{absencePercentage.toFixed(2)}%</td>
                                                    <td style={{ color: "#112c3f" }}>{presentPercentage.toFixed(2)}%</td>

                                                </tr>
                                            </>
                                        }
                                    </tbody>
                                )
                            })}
                        </table>
                    </div>
                }
            </div>
        </div>
    );
}

// Export the Attendance Function
export default Attendance;
