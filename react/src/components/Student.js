// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { selectedId, selectedId2, getProfileUsers, deleteUserDB, getSelectedId, getProfile, deleteHomeworks2 } from "../data/repository";

function Student(props) {

    const [users, setUsersData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load users from DB.
    useEffect(() => {

        // Loads User Details from DB
        async function loadUserDetails() {
            const currentDetails = await getProfileUsers();
            setUsersData(currentDetails)
            setIsLoading(false);
        }

        // Calls the functions above
        loadUserDetails();

    }, []);

    const deleteSelectedUser = async (event) => {
        const currentDetails = await getProfile(getSelectedId());

        const id = { id: await getSelectedId() };
        await deleteHomeworks2(id);
        await deleteUserDB(currentDetails);

        // Update Page/Refresh the Data
        const updatedDetails = await getProfileUsers();
        setUsersData(updatedDetails);

    }

    return (
        <div className="table-responsive">
            <p>&nbsp;</p>
            {isLoading ?
                <div className="card-body text-center">
                    <span className="text-muted">Loading Students...</span>
                </div>
                :
                <div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th></th>
                                <th>ID</th>
                                <th style={{ color: "#112c3f" }} scope="col">Name</th>
                                <th style={{ color: "#112c3f" }} scope="col">Group</th>
                                <th></th>

                            </tr>
                        </thead>
                        {/* Mapping Users state Variable to access its content easily to display in Table */}
                        {users.map((userDetails) =>
                            <tbody key={userDetails.id}>
                                {userDetails.name !== props.user.name && (userDetails.name !== "Admin") &&
                                    <>
                                        {((props.user.id === "FemaleTeachers" && userDetails.gender === "Nasirat") || (props.user.id === "MaleTeachers" && userDetails.gender === "Atfal") || (props.user.id === "Admin")) &&
                                            <tr>
                                                <td></td>
                                                <td style={{ color: "#112c3f" }}>{userDetails.id}</td>
                                                <td style={{ color: "#112c3f" }} scope="row">{userDetails.name}</td>
                                                <td style={{ color: "#112c3f" }}>{userDetails.group}</td>

                                                <td>
                                                    <Link to="/Homework">
                                                        <button className="btn2 btn-custom" onClick={() => { selectedId(userDetails.id); selectedId2(userDetails.name) }}>Select</button>
                                                    </Link>
                                                    {props.user.name === "Admin" &&
                                                        <Link to="/Student">
                                                            <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await selectedId(userDetails.id); await deleteSelectedUser() }} >Delete</button>
                                                        </Link>
                                                    }
                                                </td>
                                            </tr>
                                        }
                                    </>
                                }


                            </tbody>
                        )}
                    </table>
                </div>
            }
        </div>
    )
}

// Export the Student Function
export default Student;