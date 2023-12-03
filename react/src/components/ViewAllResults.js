// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { getAllFinalResults, getProfileUsers } from "../data/repository";

function ViewAllResults(props) {

    const [finalResults, setFinalResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Load users from DB.
    useEffect(() => {

        // Loads User Details from DB
        async function loadFinalResultsDetails() {
            const currentDetails = await getAllFinalResults();
            setFinalResults(currentDetails)
            setIsLoading(false);
        }

        // Calls the functions above
        loadFinalResultsDetails();

    }, []);


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
                                    {finalResults.filter((result) => {
                                        return search.toLowerCase() === '' ? result : (result.studentID && result.studentID.toLowerCase().includes(search)) || (result.studentName && result.studentName.toLowerCase().includes(search)) || (result.fathersName && result.fathersName.toLowerCase().includes(search)) || (result.mothersName && result.mothersName.toLowerCase().includes(search)) || (result.finalResult && result.finalResult.includes(search)) || (result.attendanceResult && result.attendanceResult.includes(search));
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
                                                    <td></td>
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
        </>
    )
}

// Export the Student Function
export default ViewAllResults;