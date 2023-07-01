// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getProfileUsers, getGroups, getHomework, getResults, createResults, updateResults, getAllResults } from "../data/repository";

// Functional Component for Login Page
function Homework(props) {
    // Declaration of useState Variables and Hook

    const [users, setUsersData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [groups, setGroupsData] = useState([]);
    const [homeworks, setHomeworks] = useState([]);
    const { className } = useParams();
    const { groupNumber } = useParams();
    const [results, setResults] = useState([]);

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

        // Loads Syllabus Details from DB
        async function loadHomeworkDetails() {
            const currentHomework = await getHomework();
            setHomeworks(currentHomework);
        }

        async function loadResultsDetails() {
            // Load the results for the current class and set the results state
            const currentResults = await getAllResults();
            setResults(currentResults);
        }

        // Calls the functions above
        loadUserDetails();
        loadGroupDetails();
        loadHomeworkDetails();
        loadResultsDetails();

    }, [className]);


    const handleSearch = async (event) => {
        setSearch(event.target.value.toLowerCase());
    }

    let groupDetails;

    const group = groups.find((group) => group.id === groupNumber);

    if (group) {
        groupDetails = group.group;
    } else {
        groupDetails = "Invalid group number";
    }



    const handleCheckboxChange = async (studentID, homeworkID, checked, studentGroup) => {
        const existingResult = await getResults(className, studentID);

        if (existingResult) {
            // Update the existing result in the database
            const updatedResult = {
                ...existingResult,
                markedHomework: {
                    ...existingResult.markedHomework,
                    [homeworkID]: checked,
                },
            };

            const updatedRecord = await updateResults(className, updatedResult.markedHomework, studentID, studentGroup);
            setResults([...results.filter((result) => result.studentID !== studentID), updatedRecord]);
        } else {
            // Create a new result in the database
            const newResult = {
                [homeworkID]: checked,
            };
            const createdResult = await createResults(className, newResult, studentID, studentGroup);
            setResults([...results, createdResult]);
        }
    };

    const calculateStudentResults = (studentID) => {
        const studentResults = results.filter((result) => result.studentID === studentID && result.class === className);
        const totalHomeworks = homeworks.filter((homework) => homework.classname === className).length;
        const checkedHomeworks = studentResults.reduce((count, result) => {
            return count + Object.values(result.markedHomework).filter(Boolean).length;
        }, 0);
        const percentage = (checkedHomeworks / totalHomeworks) * 100;
        return isNaN(percentage) ? '0%' : percentage.toFixed(2) + '%';
    };

    return (

        <div>
            <p>&nbsp;</p>
            <h3 className="text-center">Mark Homework {className}:</h3>

            <br />
            <div className="searchCenter">
                <div className="form-group has-search">
                    <span className="fa fa-search form-control-feedback"></span>
                    <input type="text" style={{ border: "1px solid #112c3f", borderRadius: "10rem" }} className="form-control" placeholder="Search" aria-label="Search" onChange={handleSearch} />
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <Link to="/SelectGroupMarkHomework" state={{ homeworkClasses: className }}>
                    <button type="button" style={{ margin: "5px" }} className="text-center btn btn-success">Go Back to Select Group For {className}</button>
                </Link>
            </div>

            <div className="table-responsive">

                {isLoading ?
                    <div className="card-body text-center">
                        <span className="text-muted">Loading student...</span>
                    </div>
                    :
                    <div>
                        <table className="table table-striped" style={{ margin: "0" }}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th style={{ color: "#112c3f" }} scope="col">Name</th>
                                    {/* Render homework columns */}
                                    {homeworks
                                        .filter((homework) => homework.classname === className) // Filter homeworks based on className
                                        .map((homework) => (
                                            <th key={homework.id}>{homework.homework}</th>
                                        ))}
                                    {homeworks.some((homework) => homework.classname === className) && (
                                        <th style={{ color: "#112c3f" }} scope="col">Results</th>
                                    )}

                                </tr>
                            </thead>
                            {/* Mapping Users state Variable to access its content easily to display in Table */}
                            {users.filter((userDetails) => {
                                return search.toLowerCase() === '' ? userDetails : (userDetails.name && userDetails.name.toLowerCase().includes(search)) || (userDetails.group && userDetails.group.toLowerCase().includes(search)) || (userDetails.id && userDetails.id.toLowerCase().includes(search)) || (userDetails.gender && userDetails.gender.toLowerCase().includes(search));
                            }).map((userDetails) => {

                                return (
                                    <tbody key={userDetails.id}>
                                        {(userDetails.name !== props.user.name && userDetails.group !== "Admin" && userDetails.group !== "Male Teacher" && userDetails.group !== "Female Teacher" && userDetails.group !== "Principal") &&
                                            <>
                                                {/* If logged in user is FemaleTeachers then Display only Nasirat List and If MaleTeahers are logged in show only Atfal list or if Admin is logged in show full list*/}
                                                {((props.user.group === "Female Teacher" && userDetails.gender === "Nasirat" && userDetails.archived !== true && (groupNumber === "5" || userDetails.group === groupDetails)) ||
                                                    (props.user.group === "Male Teacher" && userDetails.gender === "Atfal" && userDetails.archived !== true && (groupNumber === "5" || userDetails.group === groupDetails)) ||
                                                    (props.user.group === "Admin" && userDetails.archived !== true && (groupNumber === "5" || userDetails.group === groupDetails)) ||
                                                    (props.user.group === "Principal" && props.user.gender === "Female" && userDetails.gender === "Nasirat" && userDetails.archived !== true && (groupNumber === "5" || userDetails.group === groupDetails)) ||
                                                    (props.user.group === "Principal" && props.user.gender === "Male" && userDetails.gender === "Atfal" && userDetails.archived !== true && (groupNumber === "5" || userDetails.group === groupDetails))
                                                ) &&
                                                    <>
                                                        <tr>
                                                            <td></td>
                                                            <td style={{ color: "#112c3f" }}>{userDetails.name}</td>
                                                            {homeworks
                                                                .filter((homework) => homework.classname === className)
                                                                .map((homework) => {

                                                                    // const checkboxID = `${userDetails.id}-${homework.id}`;
                                                                    const checkboxID = `${homework.id}`;
                                                                    // Check if any result exists for the student and homework
                                                                    const isChecked = results.some((result) => result.studentID === userDetails.id && result.markedHomework[checkboxID] === true && result.class === className);

                                                                    return (
                                                                        <td key={homework.id}>
                                                                            <input type="checkbox" className="checkbox"
                                                                                checked={isChecked}
                                                                                onChange={(e) => handleCheckboxChange(userDetails.id, checkboxID, e.target.checked, userDetails.group)}
                                                                            />
                                                                        </td>
                                                                    );
                                                                })}
                                                            {homeworks.some((homework) => homework.classname === className) && (
                                                                <td style={{ color: "#112c3f" }}>
                                                                    {calculateStudentResults(userDetails.id)}
                                                                </td>
                                                            )}

                                                        </tr>
                                                    </>
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

// Export the Homework Function
export default Homework;
