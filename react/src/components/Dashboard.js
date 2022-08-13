// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MessageContext from "../data/MessageContext";
import { getProfile, selectedId, getPosts, getUser, getloggedInUser, getProfileUsers } from "../data/repository";

function Dashboad(props) {


    const [users, setUsersData] = useState([]);
    // const [homeworks, setHomeworks] = useState([]);
    const [userData, setUserData] = useState([]);
    const [post, setPost] = useState("");
    const [homeworks, setPosts] = useState([]);
    const [replyPosts, setReplyPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    // Load users from DB.
    useEffect(() => {

        // Loads Posts from DB
        async function loadPosts() {
            const currentPosts = await getPosts();

            setPosts(currentPosts);
            setIsLoading(false);
        }

        // // Loads User Data from DB
        // async function loadUserDetails() {
        //     const currentDetails = await getProfile(props.user.name);
        //     setUserData(currentDetails)
        //     setIsLoading(false);

        // }

        async function loadUserDetails() {
            const currentDetails = await getProfileUsers();
            setUsersData(currentDetails)
            setIsLoading(false);

        }

        // Calls the functions above
        loadUserDetails();
        loadPosts();
    }, []);


    return (
        <div>
            <h1 className="text-center" style={{ paddingTop: "50px" }}>
                {props.user.name}'s Dashboard
            </h1>

            <p>&nbsp;</p>

            {props.user.name !== "Admin" ?
                <div>
                    <div className="profile-card">
                        <div className="text-center">
                            <p>&nbsp;</p>
                            <div className="card">
                                <h5 className="card-header card text-white bg-info">Homework:</h5>
                                <h5 className="card-header card" style={{ color: "black" }}>{props.user.group}</h5>
                                {isLoading ?
                                    <div className="card-body">
                                        <span className="text-muted">Loading Homework...</span>
                                    </div>
                                    :
                                    homeworks.map((homework) =>
                                        <>
                                            {homework.name === props.user.name ?
                                                <div className="card-body">{homework.homeworkText}</div>
                                                :
                                                <span className="text-muted">You Have No Homework!</span>
                                            }
                                        </>
                                    )}
                            </div>

                        </div>
                    </div>



                    <div className="profile-card">
                        <div className="text-center">
                            <p>&nbsp;</p>
                            <div className="card">
                                <h5 className="card-header card text-white bg-info">Syllabus:</h5>
                                <h5 className="card-header card" style={{ color: "black" }}>{props.user.group}</h5>
                                <div className="card-body">
                                    
                                    


                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                :
                // props.user.name === "Admin" &&
                <div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th></th>
                                <th scope="col">Name</th>
                                <th scope="col">Group</th>
                                <th></th>

                            </tr>
                        </thead>
                        {/* Mapping Users state Variable to access its content easily to display in Table */}
                        {users.map((userDetails) =>
                            <tbody>
                                {userDetails.name !== props.user.name &&
                                    <tr key={userDetails.name}>
                                        <td></td>
                                        <td scope="row">{userDetails.name}</td>
                                        <td>{userDetails.group}</td>

                                        <td>
                                            <Link to="/Homework">
                                                <button className="btn-primary" onClick={() => selectedId(userDetails.name)}>Select</button>
                                            </Link>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        )}
                    </table>
                </div>
            }
        </div>
    );
}

// Export the home Function
export default Dashboad;
