
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

// Importing React classes and functions from node modules
import { useState, useEffect } from "react";
import { getProfileUsers, getProfile } from "../data/repository";

// Functional Component for Forum Page
function Friends(props) {
    const [users, setUsersData] = useState([]);
    const [selectedId, setSelectedId] = useState([]);

    // Load users from DB.
    useEffect(() => {
        async function loadUserDetails() {
            const currentDetails = await getProfileUsers();
            setUsersData(currentDetails)
        }
        loadUserDetails();
    }, []);

    // Generic Handler for performing actions on button click
    const handleSelect = (email) => {
        if (selectedId === email)
            setSelectedId(null);
        else
            setSelectedId(email)
    };

    // Returns HTML elements and content to display on the pages
    return (
        <div>
            <div className="text-center">
                <p>&nbsp;</p>
                <h1 className="home-welcome display-4">Follow/Friends</h1>
                <h6>Below are all the users on this website, You can choose to follow/add them as friends!</h6>
                <p>&nbsp;</p>

                {/* Table showing all users in the DB */}
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Email</th>
                            <th scope="col">Username</th>
                            <th scope="col">Name</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    {/* Mapping Users state Variable to access its content easily to display in Table */}
                    {users.map((userDetails) =>
                        <tbody>
                            {userDetails.email !== props.user.email &&
                                <tr key={userDetails.email}>
                                    <td scope="row">{userDetails.email}</td>
                                    <td>{userDetails.username}</td>
                                    <td>{userDetails.name}</td>
                                    {/* Conditional statements for different scenarios to change the CSS */}
                                    {selectedId === userDetails.email ?
                                        <td>
                                            <button className="btn btn-primary" onClick={() => handleSelect(userDetails.email)}>UnFollow</button>
                                        </td>
                                        :
                                        <td>
                                            <button className="btn btn-primary" onClick={() => handleSelect(userDetails.email)}>Follow</button>
                                        </td>
                                    }
                                    <td>
                                        {/* Display the following if condition is met */}
                                        {selectedId === userDetails.email &&
                                            <div>
                                                <strong style={{ fontSize: "125%" }}>Following</strong>
                                            </div>
                                        }
                                    </td>
                                </tr>
                            }
                        </tbody>
                    )}
                </table>

            </div>
            <p>&nbsp;</p>
        </div>
    );
}

// Export the Friends Function
export default Friends;