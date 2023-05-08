// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";

function Dashboard(props) {

    // Load Form Status from DB
    useEffect(() => {


    }, []);


    return (
        <div>
            <h1 className="text-center" style={{ paddingTop: "50px", color: "#112c3f" }}>
                {props.user.name}'s Dashboard
            </h1>
            <h4 className="text-center" style={{ paddingTop: "0px", color: "#112c3f" }}>
                Enrolled ID: <b>{props.user.id}</b>
            </h4>
            <p>&nbsp;</p>

        </div>
    );
}

// Export the Dashboard Function
export default Dashboard;
