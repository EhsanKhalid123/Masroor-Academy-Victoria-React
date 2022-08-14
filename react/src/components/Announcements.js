// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../Masroor Academy Logo 2.png";
import { createReplyPost, getReplyPosts, deleteReplyPost } from "../data/repository";


function Announcements(props) {

    const [errorMessage, setErrorMessage] = useState(null);
    const [announcement, setAnnouncement] = useState("");
    const [post, setPost] = useState("");
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        // Loads Posts from DB
        async function loadPosts() {
            const currentPosts = await getReplyPosts();

            setAnnouncements(currentPosts);
            setIsLoading(false);
        }

        // Calls the functions above
        loadPosts();
    }, []);


    // Handler for when textbox value changes
    const handleInputChange = (event) => {
        setAnnouncement(event.target.value);
        setErrorMessage("");
    };

    // Generic Form Submission Handler
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Trim the post text.
        const trimmedPost = announcement.trim();

        // Validation Code
        if (trimmedPost === "") {
            setErrorMessage("Annoucement is Empty!");
            return;
        }

        // Create a post.
        const newAnnoucement = { announcementText: trimmedPost };
        console.log(newAnnoucement);
        await createReplyPost(newAnnoucement);

        newAnnoucement.user = { username: props.user.username };

        // Update Page/Refresh the Data
        const currentPosts = await getReplyPosts();
        setAnnouncements(currentPosts);

        // Add post to locally stored posts. Below Commented out code locally stores state and not refreshes data like above code does.
        // setPosts([...posts, newPost]);

        // Reset post content.
        setAnnouncement("");
        setErrorMessage("");
    };

    return (
        <div>
            <p>&nbsp;</p>
            <form onSubmit={handleSubmit} >
                <div className="form-group">
                    <h3 className="text-center" style={{ margin: "0 25% 10px 25%", width: "50%", textAlign: "left" }}>Add Announcements:</h3>
                    <h5 className="text-center"> Make Sure to Please Delete the Previous Announcements when adding new ones!</h5>
                    <textarea style={{ margin: "auto", width: "40%", height: "50px", border: "solid 2px #2d6d99" }} className="form-control" id="announcementText" name="announcementText" rows="3" value={announcement} onChange={handleInputChange} />
                </div>
                {errorMessage && (
                    <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errorMessage}</p>
                )}
                <button type="submit" style={{ textAlign: "right", margin: "0 0 0 30%", padding: "5px 25px 5px 25px" }} className="text-center btn btn-outline-primary2 mr-sm-2" >Add</button>
                <button type="button" style={{ textAlign: "right" }} className="text-center btn btn-outline-danger mr-sm-2" onClick={() => { setAnnouncement(""); setErrorMessage(null); }} >Clear</button>
            </form>
            <p>&nbsp;</p>
            <div>
                {isLoading ?
                    <div className="card-body text-center">
                        <span className="text-muted">Loading Annoucements...</span>
                    </div>
                    :
                    announcements.length === 0 ?
                        <div className="text-center">
                            <span className="text-muted">No Annoucements have been Posted!</span>
                            <p>&nbsp;</p>
                        </div>
                        :
                        announcements.map((userPosts) =>
                            <div>
                                <div className="posts card" >
                                    <div className="card-body">

                                        <div>
                                            <p style={{ clear: "both", float: "left", textAlign: "left", color: "#112c3f", fontSize: "20px" }} className="card-text">{userPosts.announcementText}</p>
                                            <div>
                                                <div>
                                                    <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await deleteReplyPost(userPosts); setAnnouncements(await getReplyPosts()); }} >Delete</button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )
                }

            </div>
            <p>&nbsp;</p>
        </div>

    );

}

// Export the home Function
export default Announcements;