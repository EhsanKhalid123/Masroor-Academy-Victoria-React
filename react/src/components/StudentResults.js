import React, { useState, useEffect } from "react";
import { getProfileUsers, getHomework, getAllResults, getFinalResultsByID } from "../data/repository";

function StudentResults(props) {
    const [users, setUsersData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [homeworks, setHomeworks] = useState([]);
    const [results, setResults] = useState([]);
    const [finalResults, setFinalResults] = useState([]);

    useEffect(() => {
        async function loadUserDetails() {
            const currentDetails = await getProfileUsers();
            setUsersData(currentDetails);
            setIsLoading(false);
        }

        async function loadHomeworkDetails() {
            const currentHomework = await getHomework();
            setHomeworks(currentHomework);
        }

        async function loadResultsDetails() {
            const currentResults = await getAllResults();
            setResults(currentResults);
        }

        async function loadFinalResultsDetails() {
            const currentFinalResults = await getFinalResultsByID(props.user.id);
            setFinalResults(currentFinalResults);
        }

        loadUserDetails();
        loadHomeworkDetails();
        loadResultsDetails();
        loadFinalResultsDetails();
    }, [props.user.id]);

    // Get unique classes from the results data
    const classes = [...new Set(results.map((result) => result.class))];

    return (
        <div>

            <div>
                <p>&nbsp;</p>
                <h3 className="text-center">Overall Result:</h3>
                <div className="text-center">
                    {finalResults?.finalResult ? (
                        <p style={{ fontSize: "30px", color: "#0097b5" }}>{finalResults.finalResult}</p>
                    ) : (
                        <p style={{ fontSize: "20px", color: "#a50000" }}>Student hasn't been marked</p>
                    )}
                </div>
                <h3 className="text-center">Overall Attendance:</h3>
                <div className="text-center">
                    {finalResults?.attendanceResult ? (
                        <p style={{ fontSize: "30px", color: "#0097b5" }}>{finalResults.attendanceResult}</p>
                    ) : (
                        <p style={{ fontSize: "20px", color: "#a50000" }}>Student hasn't been marked</p>
                    )}
                </div>
            </div>


            <p>&nbsp;</p>
            <h3 className="text-center" style={{ marginBottom: "30px" }}>Individual Subject Results:</h3>

            <div className="table-responsive">
                {isLoading ? (
                    <div className="card-body text-center">
                        <span className="text-muted">Loading Results...</span>
                    </div>
                ) : (
                    <>
                        {classes.map((classItem) => (
                            <div key={classItem}>

                                {/* <p>&nbsp;</p> */}
                                <h3 className="text-center" style={{ color: "#ac0100" }}>{classItem}</h3>

                                <table className="table table-striped" style={{ margin: "0", marginBottom: "30px" }}>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th style={{ color: "#112c3f" }} scope="col">Name</th>
                                            {homeworks.filter((homework) => homework.classname === classItem).map((homework) => (
                                                <th key={homework.id}>{homework.homework}</th>
                                            ))}
                                            <th style={{ color: "#112c3f" }} scope="col">Results</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.filter((userDetails) => userDetails.id === props.user.id).map((userDetails) => (
                                            <tr key={userDetails.id}>
                                                <td></td>
                                                <td style={{ color: "#112c3f" }}>{userDetails.name}</td>
                                                {homeworks.filter((homework) => homework.classname === classItem).map((homework) => {
                                                    const checkboxID = `${homework.id}`;
                                                    const isChecked = results.some((result) => result.studentID === userDetails.id && result.markedHomework[checkboxID] === true && result.class === classItem);
                                                    return (
                                                        <td key={homework.id}>
                                                            <input type="checkbox" className="checkbox" checked={isChecked} readOnly />
                                                        </td>
                                                    );
                                                })}
                                                <td style={{ color: "#112c3f" }}>
                                                    {results
                                                        .filter((result) => result.studentID === userDetails.id && result.class === classItem)
                                                        .map((result) => (
                                                            <span key={userDetails.id}>{result.result}</span>
                                                        ))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

export default StudentResults;
