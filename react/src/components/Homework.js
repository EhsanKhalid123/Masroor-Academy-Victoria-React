// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getProfileUsers, getGroups, getHomework, getResults, createResults, updateResults, getAllResults, getHomeworksByID, createHomeworks, editHomeworks, deleteHomeworksByID } from "../data/repository";

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


    const findNextUncheckedHomeworkID = (homeworksForClass, existingResult) => {
        for (let i = 0; i < homeworksForClass.length; i++) {
            const nextHomeworkID = homeworksForClass[i].id;
            const nextCheckboxID = `${nextHomeworkID}`;

            // Check if the next homework is unchecked for the student
            if (!existingResult || !(nextCheckboxID in existingResult.markedHomework) || !existingResult.markedHomework[nextCheckboxID]) {
                return nextHomeworkID;
            }
        }
        return null;
    };

    const handleCheckboxChange = async (studentID, homeworkID, checked, studentGroup, studentResult) => {

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

            // ==========================

            const nextUncheckedHomeworkID = findNextUncheckedHomeworkID(
                homeworks.filter((homework) => homework.classname === className),
                updatedResult
            );

            if (nextUncheckedHomeworkID) {
                // Find the next homework text for the unchecked checkbox
                const nextHomeworkText = homeworks.find(homework => homework.id === nextUncheckedHomeworkID).homework;

                // Check if homework exists for the student and classname
                const existingHomework = await getHomeworksByID(className, studentID);


                if (existingHomework) {
                    // Homework already exists, edit the homework text in the database
                    await editHomeworks(className, studentID, { id: props.user.id, homeworkText: nextHomeworkText });
                } else {
                    // Homework doesn't exist, create new homework in the database
                    const homeworkData = {
                        class: className,
                        student: studentID,
                        id: props.user.id,
                        homeworkText: nextHomeworkText,
                    };
                    await createHomeworks(homeworkData);
                }
            } else {
                // If no unchecked homework is found, delete the existing homework item
                const existingHomework = await getHomeworksByID(className, studentID);
                if (existingHomework) {
                    await deleteHomeworksByID(className, studentID, existingHomework);
                }
            }
            //==============================


            const updatedRecord = await updateResults(className, updatedResult.markedHomework, studentID, studentGroup, studentResult);
            setResults([...results.filter((result) => result.studentID !== studentID), updatedRecord]);
        } else {
            // Create a new result in the database
            const newResult = {
                [homeworkID]: checked,
            };

            // =================
            // Get the next homework item ID in the column
            const homeworksForClass = homeworks.filter(homework => homework.classname === className);
            const currentIndex = homeworksForClass.findIndex(homework => homework.id === parseInt(homeworkID));
            const nextIndex = currentIndex + 1;
            const nextHomeworkID = nextIndex < homeworksForClass.length ? homeworksForClass[nextIndex].id : null;

            // Check if homework exists for the student and classname
            const existingHomework = await getHomeworksByID(className, studentID);

            if (existingHomework && nextHomeworkID) {
                // Homework already exists, edit the homework text in the database
                const nextHomeworkText = homeworks.find(homework => homework.id === nextHomeworkID).homework;
                await editHomeworks(className, studentID, { id: props.user.id, homeworkText: nextHomeworkText });
            } else if (!existingHomework && nextHomeworkID) {
                // Homework doesn't exist, create new homework in the database
                const nextHomeworkText = homeworks.find(homework => homework.id === nextHomeworkID).homework;
                const homeworkData = {
                    class: className,
                    student: studentID,
                    id: props.user.id,
                    homeworkText: nextHomeworkText,
                };
                await createHomeworks(homeworkData);
            }
            // ========================

            const createdResult = await createResults(className, newResult, studentID, studentGroup, studentResult);
            setResults([...results, createdResult]);
        }
    };

    // Group Based Calculations Depending on what group student belongs they get marked accordingly
    const calculateStudentResults = (studentID, userGroup) => {
        const studentResults = results.filter(
            (result) =>
                result.studentID === studentID &&
                result.studentGroup === userGroup &&
                result.class === className
        );

        if (studentResults.length === 0) {
            return "0%";
        }

        const totalHomeworks = homeworks.filter(
            (homework) =>
                homework.classname === className &&
                homework.group.includes(userGroup)
        ).length;

        const checkedHomeworks = studentResults.reduce((count, result) => {
            return count + Object.entries(result.markedHomework).reduce((marks, [homeworkId, isChecked]) => {
                const homework = homeworks.find((item) => item.id.toString() === homeworkId);
                if (isChecked && homework && homework.group.includes(userGroup)) {
                    marks++;
                }
                return marks;
            }, 0);
        }, 0);

        let percentage = (checkedHomeworks / totalHomeworks) * 100;

        if (totalHomeworks === 0) {
            return "0%";
        }

        if (percentage > 100) {
            percentage = 100;
        }

        return percentage.toFixed(2) + "%";

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

            <div className="text-center">
                <p style={{color: "#de0300"}}>Please double click, so tick and then untick the checkbox to automatically create the Homework for that student</p>
                <p style={{color: "#de0300"}}>Please note only the homework after the first ticked checkbox will be displayed as the homework for that Student</p>
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

                                                                    const checkboxID = `${homework.id}`;
                                                                    // Check if any result exists for the student and homework
                                                                    const isChecked = results.some((result) => result.studentID === userDetails.id && result.markedHomework[checkboxID] === true && result.class === className);

                                                                    return (
                                                                        <td key={homework.id}>
                                                                            <input type="checkbox" className="checkbox"
                                                                                checked={isChecked}
                                                                                onChange={(e) => handleCheckboxChange(userDetails.id, checkboxID, e.target.checked, userDetails.group, calculateStudentResults(userDetails.id, userDetails.group))}
                                                                            />
                                                                        </td>
                                                                    );
                                                                })}
                                                            {homeworks.some((homework) => homework.classname === className) && (
                                                                <td style={{ color: "#112c3f" }}>
                                                                    {calculateStudentResults(userDetails.id, userDetails.group)}
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
