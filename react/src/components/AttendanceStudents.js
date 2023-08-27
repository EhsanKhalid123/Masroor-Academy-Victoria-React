// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfileUsers, getGroups, getAttendance, createAttendance, updateAttendance, getAllAttendance, updateFinalResults, createFinalResults, getFinalResultsByID } from "../data/repository";


// Functional Component for Login Page
function Attendance(props) {
    // Declaration of useState Variables and Hook

    const [users, setUsersData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [groups, setGroupsData] = useState([]);
    const { groupNumber } = useParams();
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

        // Loads User Details from DB
        async function loadGroupDetails() {
            const currentGroups = await getGroups();
            setGroupsData(currentGroups)
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
        loadGroupDetails();
        loadAttendanceData();
        loadAttendanceData2();
        loadAllAttendanceData();

    }, [currentDate]);


    const handleSearch = async (event) => {
        setSearch(event.target.value.toLowerCase());
    }

    const findFatherName = (studentID) => {
        const userWithMatchingID = users.find(user => user.id === studentID);
        return userWithMatchingID ? userWithMatchingID.fathersName : "";
    };

    const findMotherName = (studentID) => {
        const userWithMatchingID = users.find(user => user.id === studentID);
        return userWithMatchingID ? userWithMatchingID.mothersName : "";
    };

    const handleAttendanceChange = async (studentId, status, studentGroup) => {

        let updatedAttendanceData = attendanceData.map((student) => {
            if (student && student.id === studentId) {
                return { ...student, status };
            }
            return student;
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

            const existingStudent = updatedAttendanceData.find((student) => student?.id === studentId);
            if (!existingStudent) {
                updatedAttendanceData.push({
                    id: studentId,
                    group: studentGroup,
                    status: status,
                });
            }
        } else {
            updatedAttendanceData = [
                ...attendanceData,
                {
                    id: studentId,
                    group: studentGroup,
                    status: status,
                },
            ];
        }

        if (existingAttendance) {
            await updateAttendance(currentDate, updatedAttendanceData);
        } else {
            await createAttendance(currentDate, updatedAttendanceData);
        }

        await setAttendanceData(updatedAttendanceData);

        const presentMark = await calculatePercentages(studentId, updatedAttendanceData2, true).presentPercentage.toFixed(2);

        const existingFinalResults = await getFinalResultsByID(studentId);
        const student = users.find((user) => user.id === studentId);
        if (existingFinalResults)
            await updateFinalResults(studentId, presentMark);
        else
            await createFinalResults(studentId, student?.name, student?.fathersName, student?.mothersName, student?.fathersEmail, student?.studentEmail, presentMark);


    };


    let groupDetails;

    const group = groups.find((group) => group.id === groupNumber);

    if (group) {
        groupDetails = group.group;
    } else {
        groupDetails = "Invalid group number";
    }

    // Calculate present and absent percentages
    const calculatePercentages = (studentId, updatedAttendance, flag) => {

        let filteredResult;

        if (flag) {
            filteredResult = updatedAttendance;
        } else {
            filteredResult = attendanceData2;
        }

        let totalAttendance = filteredResult.length;
        let presentCount = 0;
        let absenceCount = 0;
        let approvedLeaveCount = 0;

        filteredResult.forEach((record) => {
            record.attendance.forEach((student) => {
                if (student.id === studentId) {
                    // totalAttendance++;
                    if (student.status === "Present") {
                        presentCount++;
                    } else if (student.status === "Absent") {
                        absenceCount++;
                    } else if (student.status === "Approved Leave") {
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

            <div style={{ display: "flex", justifyContent: "center" }}>
                <Link to="/SelectGroupAttendance">
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
                                    <th style={{ color: "#112c3f" }} scope="col">
                                        {props.user.gender === "Female" || props.user.gender === "Nasirat" ? "Mother" : "Father"}
                                    </th>
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
                                // Check if the student ID exists in the attendanceData array
                                const attendanceStudent = attendanceData.find(
                                    (student) => student.id === userDetails.id

                                );

                                // Get the status if the student exists in the attendanceData array
                                const status = attendanceStudent ? attendanceStudent.status : "";

                                const lastFiveAttendances = attendanceRecords.map(record => record.attendance.find(student => student.id === userDetails.id));
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
                                        {/* Dont display the name of the logged in user but the rest, And dont show Admin for teachers */}
                                        {(userDetails.name !== props.user.name && userDetails.group !== "Admin" && userDetails.group !== "Male Teacher" && userDetails.group !== "Female Teacher" && userDetails.group !== "Principal") &&
                                            <>
                                                {/* If logged in user is FemaleTeachers then Display only Nasirat List and If MaleTeahers are logged in show only Atfal list or if Admin is logged in show full list*/}
                                                {((props.user.group === "Female Teacher" && userDetails.gender === "Nasirat" && userDetails.archived !== true && (groupNumber === "5" || userDetails.group === groupDetails)) ||
                                                    (props.user.group === "Male Teacher" && userDetails.gender === "Atfal" && userDetails.archived !== true && (groupNumber === "5" || userDetails.group === groupDetails)) ||
                                                    (props.user.group === "Admin" && userDetails.archived !== true && (groupNumber === "5" || userDetails.group === groupDetails)) ||
                                                    (props.user.group === "Admin" && props.user.id === "Admin" && (groupNumber === "5" || userDetails.group === groupDetails)) ||
                                                    (props.user.group === "Principal" && props.user.gender === "Female" && userDetails.gender === "Nasirat" && userDetails.archived !== true && (groupNumber === "5" || userDetails.group === groupDetails)) ||
                                                    (props.user.group === "Principal" && props.user.gender === "Male" && userDetails.gender === "Atfal" && userDetails.archived !== true && (groupNumber === "5" || userDetails.group === groupDetails))
                                                ) &&
                                                    <tr>
                                                        <td></td>
                                                        <td style={{ color: "#112c3f" }}>{userDetails.id}</td>
                                                        <td style={{ color: "#112c3f" }}>{userDetails.name}</td>
                                                        <td style={{ color: "#112c3f" }}>
                                                            {userDetails.gender === "Female" || userDetails.gender === "Nasirat"
                                                                ? findMotherName(userDetails.id)
                                                                : findFatherName(userDetails.id)}
                                                        </td>
                                                        <td style={{ color: "#112c3f" }}>{userDetails.group}</td>
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
                                                }
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
