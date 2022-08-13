// Importing React classes and functions from node modules
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import MessageContext from "../data/MessageContext";
import { deletePost2, deleteReplyPost3, deleteUserDB } from "../data/repository";

function Dashboad(props) {
  return (
    <div>
      <h1 className="text-center" style={{ paddingTop: "50px" }}>
        {props.user.name}'s Dashboard
      </h1>
      
      <p>&nbsp;</p>

      <div>
            {/* Shows Message passed down from App component for useContext Hook */}
            <div className="profile-card">
                <div className="text-center">
                    <p>&nbsp;</p>
                    <h1 className="home-welcome display-4">My Profile</h1>
                    <p>&nbsp;</p>
                    <div className="card">
                        <h5 className="card-header card text-white bg-info">Profile Info</h5>
                        {/* IMAGE REFERENCE: Icon is taken from google fonts who provide free icons */}
                        {/* https://fonts.google.com/icons?selected=Material+Icons:home&icon.query=profile */}
                        <img className="" src={process.env.PUBLIC_URL + 'assets/images/baseline_account_circle_black_24dp.png'} style={{ width: "20%", margin: "20px auto 0 auto" }} alt="Account Picture" />
                        <div className="card-body">
                            <h5 className="card-title">{props.user.username}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">{props.user.email}</h6>
                            <p className="card-text">This is your profile information, you can choose to edit your profile or delete it!</p>
                            {/* <a href="#" className="card-link">Card link</a>*/}
                            <Link className="btn btn-info" style={{ margin: "10px" }} to="/EditProfile">Edit</Link>
                            {/* <a href="/EditProfile" className="btn btn-info" style={{ margin: "10px" }}>Edit</a> */}
                            <button onClick={""} className="btn btn-danger">Delete</button>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item"><b style={{ color: "red" }}>Note:</b> Login details change on editing profile! Deleting your account will delete all your posts!</li>
                        </ul>
                        <div className="card-footer" style={{ fontWeight: "bold", backgroundColor: "lightgray" }}>Joined: {new Date(props.user.dateJoined).toLocaleString("en-AU", { weekday: 'short', day: "numeric", month: "short", year: "numeric" })}</div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
}

// Export the home Function
export default Dashboad;
