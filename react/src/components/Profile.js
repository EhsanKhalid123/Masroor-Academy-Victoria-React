// Importing React classes and functions from node modules
import React from "react";
import MyUserProfile from "./MyUserProfile";
import SelectedUserProfile from "./SelectedUserProfile";

// Functional Component for MyProfile
function Profile(props) {


    // Returns HTML elements and contents to display on page
    return (

        <div>
            <br />
            <h1 className="home-welcome display-4 text-center">My Profile</h1>
            <div className="container mt-5">
                <MyUserProfile user={props.user} logoutUser={props.logoutUser} />
                <SelectedUserProfile user={props.user} />
            </div>
            <p>&nbsp;</p>
        </div>
    );
}

// Export the MyProfile Function
export default Profile;