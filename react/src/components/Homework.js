// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { deletePost, getSelectedId, createPost, getPosts, selectedId, getSelectedId2 } from "../data/repository";

// Functional Component for Navigation Bar
function Homework(props) {

    const [errorMessage, setErrorMessage] = useState(null);
    const [homework, setHomework] = useState("");
    const [post, setPost] = useState("");
    const [homeworks, setHomeworks] = useState([]);

     // Load posts, replied posts and user Details from DB.
     useEffect(() => {

        // Loads Posts from DB
        async function loadPosts() {
            const currentPosts = await getPosts();

            setHomeworks(currentPosts);
        }

        // Calls the functions above
        loadPosts();
    }, []);

        // Handler for when textbox value changes
        const handleInputChange = (event) => {
            setHomework(event.target.value);
            setErrorMessage("");
        };

            // Generic Form Submission Handler
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Trim the post text.
        const trimmedPost = homework.trim();

        // Validation Code
        if (trimmedPost === "") {
            setErrorMessage("Homework is Empty!");
            return;
        }

        // Create a post.
        const newHomework = { homeworkText: trimmedPost, id: getSelectedId()};
        await createPost(newHomework);

        newHomework.user = { username: props.user.username };

        // Update Page/Refresh the Data
        const currentPosts = await getPosts();
        setHomeworks(currentPosts);

        // Add post to locally stored posts. Below Commented out code locally stores state and not refreshes data like above code does.
        // setPosts([...posts, newPost]);

        // Reset post content.
        setPost("");
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
            {homeworks.map((userPosts) => 
                        <div>
                            {userPosts.id === getSelectedId() &&
                            <div className="posts card" >
                                <div className="card-body">
                                    <h5 style={{ float: "left", textAlign: "center", color: "#112c3f" }} className="card-title">{userPosts.user.name}</h5>
                                    <p style={{ margin: "0 0 10% 0" }}></p>
                                    <p style={{ clear: "both", float: "left", textAlign: "left", color: "#112c3f" }} className="card-text">{userPosts.homeworkText}</p>

                                    <div>
                                        <div>
                                            {/* Only Display the following Elements if the email of the post matches the logged in user */}
                                            {props.user.name === "Admin" &&
                                                <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await deletePost(userPosts); setHomeworks(await getPosts()); }} >Delete</button>
                                            }
                                                                                    
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