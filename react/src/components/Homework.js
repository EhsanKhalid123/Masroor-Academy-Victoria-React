// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { deleteHomeworks, getSelectedId, createHomeworks, getHomeworks, getSelectedId2 } from "../data/repository";

// Functional Component for Navigation Bar
function Homework(props) {

    const [errorMessage, setErrorMessage] = useState(null);
    const [homework, setHomework] = useState("");
    const [homeworks, setHomeworks] = useState([]);

     // Load Homeworks, Announcements and user Details from DB.
     useEffect(() => {

        // Loads Homeworks from DB
        async function loadHomeworks() {
            const currentHomeworks = await getHomeworks();

            setHomeworks(currentHomeworks);
        }

        // Calls the functions above
        loadHomeworks();
    }, []);

        // Handler for when textbox value changes
        const handleInputChange = (event) => {
            setHomework(event.target.value);
            setErrorMessage("");
        };

            // Generic Form Submission Handler
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Trim the Homework text.
        const trimmedHomework = homework.trim();

        // Validation Code
        if (trimmedHomework === "") {
            setErrorMessage("Homework is Empty!");
            return;
        }

        // Create a Homework.
        const newHomework = { homeworkText: trimmedHomework, id: getSelectedId()};
        await createHomeworks(newHomework);

        newHomework.user = { username: props.user.username };

        // Update Page/Refresh the Data
        const currentHomeworks = await getHomeworks();
        setHomeworks(currentHomeworks);

        // Reset Homework content.
        setHomework("");
        setErrorMessage("");
    };

  // Returns HTML code from this function which is displayed by importing on other pages
  return (
    
    <div>
        <p>&nbsp;</p>
        <form onSubmit={handleSubmit} >
                <div className="form-group">
                    <h3 className="text-center" style={{ margin: "0 25% 10px 25%", width: "50%", textAlign: "left" }}>Add Homework for Student {getSelectedId2()}</h3>
                    <h5 className="text-center"> Make Sure to Please Delete the Previous Homework Once Done!</h5>
                    <textarea style={{ margin: "auto", width: "40%", height: "50px", border: "solid 2px #2d6d99" }} className="form-control" id="homeworkText" name="homeworkText" rows="3" value={homework} onChange={handleInputChange} />
                </div>
                {errorMessage && (
                    <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errorMessage}</p>
                )}
                <button type="submit" style={{ textAlign: "right", margin: "0 0 0 30%", padding: "5px 25px 5px 25px" }} className="text-center btn btn-outline-primary2 mr-sm-2" >Add</button>
                <button type="button" style={{ textAlign: "right" }} className="text-center btn btn-outline-danger mr-sm-2" onClick={() => {setHomework(""); setErrorMessage(null);}} >Clear</button>
                <Link to="/Dashboard">
                    <button type="button" style={{ textAlign: "right" }} className="text-center btn btn-success mr-sm-2" onClick={() => {setHomework(""); setErrorMessage(null);}}  >Go Back to Dashboard</button>    
                </Link>
            </form>
            <p>&nbsp;</p>
            {homeworks.map((homeworkPosts) => 
                        <div>
                            {homeworkPosts.id === getSelectedId() &&
                            <div className="postedContent card" >
                                <div className="card-body">
                                    <h5 style={{ float: "left", textAlign: "center", color: "#112c3f" }} className="card-title">{homeworkPosts.user.name}</h5>
                                    <p style={{ margin: "0 0 10% 0" }}></p>
                                    <p style={{ clear: "both", float: "left", textAlign: "left", color: "#112c3f" }} className="card-text">{homeworkPosts.homeworkText}</p>

                                    <div>
                                        <div>
                                            {/* Only Display the following Elements if the email of the post matches the logged in user */}
                                            {/* {props.user.name === "Admin" && (props.user.name === "Teacher") && */}
                                                <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await deleteHomeworks(homeworkPosts); setHomeworks(await getHomeworks()); }} >Delete</button>
                                            {/* } */}
                                                                                    
                                        </div>
                                    </div>

                                </div>
                            </div>
}
                        </div>
                    )}
                    <p>&nbsp;</p>
                 
    </div>

    

  );
}

// Export the Navigation Function
export default Homework;