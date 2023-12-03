// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getGroups } from "../data/repository";


function SelectGroup(props) {

    const [groups, setGroupsData] = useState([]);
    const location = useLocation();
    const className = location?.state?.homeworkClasses;

    // Load users from DB.
    useEffect(() => {

        // Loads User Details from DB
        async function loadGroupDetails() {
            const currentGroups = await getGroups();
            setGroupsData(currentGroups)
        }

        // Calls the functions above
        loadGroupDetails();
    }, []);

    let linkTo;
    let message;

    if (props.selectGroup === "homework") {
        linkTo = "/HomeworkGroup";
        message = "Please select a group to add homework for students of that group";
    } else if (props.selectGroup === "student") {
        linkTo = "/StudentGroup";
        message = "Please select a group to view students results and profile of that group";
    } else if (props.selectGroup === "attendance") {
        linkTo = "/Attendance";
        message = "Please select a group to mark students attendance for that group";
    } else if (props.selectGroup === "markhomework") {
        linkTo = "/Homework";
        message = `Please select a group to mark students homework for that group for the class ${className}`;
    } else if (props.selectGroup === "result") {
        linkTo = "/Results";
        message = `Please select a group to view students final results for all subjects `;
    }

    return (
        <>
            <p>&nbsp;</p>
            {props.selectGroup === "markhomework" &&
            <h4 className="text-center" style={{ margin: "5px" }}>{className}</h4>
            }
            <h5 className="text-center" style={{ margin: "5px" }}>{message}</h5>
            <p>&nbsp;</p>
            <div style={{ display: "flex", justifyContent: "center" }}>
                {props.selectGroup !== "markhomework" ?
                    <div className="container">
                        <div className="row" style={{ justifyContent: "center" }}>
                            {groups.filter((group) => !["Male Teacher", "Female Teacher", "Admin", "Principal",].includes(group.group)).map((group) => (
                                <div key={group.id} style={{ margin: "5px" }}>
                                    <Link to={`${linkTo}/${group.id}`} className="selectGroupLinks" style={{ textDecoration: "none" }}>
                                        <div className="card">
                                            <div className="card-body" style={{ padding: "15px" }}>
                                                <h5 className="text-center" style={{ marginBottom: "0px" }}>{group.group}</h5>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}

                            <div style={{ margin: "5px" }}>
                                <Link to={`${linkTo}/5`} className="selectGroupLinks" style={{ textDecoration: "none" }}>
                                    <div className="card">
                                        <div className="card-body" style={{ padding: "15px" }}>
                                            <h5 className="text-center" style={{ marginBottom: "0px" }}>All Students</h5>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>



                    :
                    <div className="container">
                        <div className="row" style={{ justifyContent: "center" }}>
                            {groups.filter((group) => !["Male Teacher", "Female Teacher", "Admin", "Principal",].includes(group.group)).map((group) => (
                                <div key={group.id} style={{ margin: "5px" }}>
                                    <Link to={`${linkTo}/${group.id}/${className}`} className="selectGroupLinks" style={{ textDecoration: "none" }}>
                                        <div className="card">
                                            <div className="card-body" style={{ padding: "15px" }}>
                                                <h5 className="text-center" style={{ marginBottom: "0px" }}>{group.group}</h5>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}

                            <div style={{ margin: "5px" }}>
                                <Link to={`${linkTo}/5/${className}`} className="selectGroupLinks" style={{ textDecoration: "none" }}>
                                    <div className="card">
                                        <div className="card-body" style={{ padding: "15px" }}>
                                            <h5 className="text-center" style={{ marginBottom: "0px" }}>All Students</h5>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                }

            </div>
            <p>&nbsp;</p>
        </>
    )
}

// Export the Student Function
export default SelectGroup;