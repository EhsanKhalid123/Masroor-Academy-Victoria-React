// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getProfileUsers, getGroups, getSyllabus } from "../data/repository";
import parse from 'html-react-parser';
// import sanitizeHtml from 'sanitize-html';


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

        // // Mock function to get homework data
        // async function loadHomeworks() {
        //     // Replace this with your actual function to fetch homework data
        //     // Example: const homeworkData = await fetchHomeworks();
        //     const homeworkData = [
        //         { id: 1, name: "Homework 1" },
        //         { id: 2, name: "Homework 2" },
        //         { id: 3, name: "Homework 3" },
        //     ];
        //     setHomeworks(homeworkData);
        // }

        // Loads Syllabus Details from DB
        async function loadSyllabusDetails() {
            const currentSyllabus = await getSyllabus();
            setHomeworks(currentSyllabus);
        }


        // Calls the functions above
        loadUserDetails();
        loadGroupDetails();
        loadSyllabusDetails();


    }, []);


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

    const handleCheckboxChange = (userId, homeworkId) => {
        // Implement your logic here to handle checkbox change for each student and homework
        console.log(`User ID: ${userId}, Homework ID: ${homeworkId}`);
    };


    return (

        <div>
            <p>&nbsp;</p>
            <h3 className="text-center">Mark Homework:</h3>

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
                        <span className="text-muted">Loading Staff...</span>
                    </div>
                    :
                    <div>
                        <table className="table table-striped" style={{ margin: "0" }}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th style={{ color: "#112c3f" }} scope="col">Name</th>

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
                                                            {homeworks.map((homework) => (
                                                                <td key={homework.id}>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="checkbox"
                                                                        onChange={() => handleCheckboxChange(userDetails.id, homework.id)}
                                                                    />
                                                                </td>
                                                            ))}
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
