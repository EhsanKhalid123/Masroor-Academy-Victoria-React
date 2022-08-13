
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { getPosts, createPost, getProfile, deletePost, createReplyPost, getReplyPosts, deleteReplyPost2, deleteReplyPost } from "../data/repository";

// Functional Component for Forum Page
function Forum(props) {

    // Declaration of state Variables for useState Hook.
    const [post, setPost] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [replyPosts, setReplyPosts] = useState([]);
    const [userData, setUserData] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    // Popup Toggle Switch Function
    const togglePopup = async (id) => {

        // If post is already selected then hide reply UI
        if (id === selectedId)
            setSelectedId(null);
        else
            setSelectedId(id);
    }

    // Load posts, replied posts and user Details from DB.
    useEffect(() => {

        // Loads Posts from DB
        async function loadPosts() {
            const currentPosts = await getPosts();

            setPosts(currentPosts);
            setIsLoading(false);
        }

        // Loads Reply Posts Data from DB
        async function loadReplyPosts() {
            const currentReplyPosts = await getReplyPosts();

            setReplyPosts(currentReplyPosts);
            setIsLoading(false);
        }

        // Loads User Data from DB
        async function loadUserDetails() {
            const currentDetails = await getProfile(props.user.email);
            setUserData(currentDetails)

        }

        // Calls the functions above
        loadUserDetails();
        loadPosts();
        loadReplyPosts();
    }, []);

    // Handler for when textbox value changes
    const handleInputChange = (event) => {
        setPost(event.target.value);
        setErrorMessage("");
    };

    // Generic Form Submission Handler
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Trim the post text.
        const trimmedPost = post.trim();

        // Validation Code
        if (trimmedPost === "") {
            setErrorMessage("A post cannot be empty!");
            return;
        } else if (trimmedPost.length > 600) {
            setErrorMessage("A post cannot be greater than 600 characters!");
            return;
        }

        // Create a post.
        const newPost = { postText: trimmedPost, email: props.user.email, postDate: new Date().toLocaleString() };
        await createPost(newPost);

        newPost.user = { username: props.user.username };

        // Update Page/Refresh the Data
        const currentPosts = await getPosts();
        setPosts(currentPosts);

        // Add post to locally stored posts. Below Commented out code locally stores state and not refreshes data like above code does.
        // setPosts([...posts, newPost]);

        // Reset post content.
        setPost("");
        setErrorMessage("");
        togglePopup(null);
    };

    // Handler for Creating a Reply to a Post
    const handleSubmitReply = async (event) => {
        event.preventDefault();

        // Trim the post text.
        const trimmedPost = post.trim();

        // Post Validation Code
        if (trimmedPost === "") {
            setErrorMessage("A post cannot be empty!");
            return;
        } else if (trimmedPost.length > 600) {
            setErrorMessage("A post cannot be greater than 600 characters!");
            return;
        }

        // Create post.
        const newPost = { replyText: trimmedPost, email: props.user.email, forumPosts_id: selectedId, replyDate: new Date().toLocaleString() };
        await createReplyPost(newPost);

        newPost.user = { username: props.user.username };

        // Update Page/Refresh the Data
        const currentReplyPosts = await getReplyPosts();
        setReplyPosts(currentReplyPosts);

        // Add post to locally stored posts. Below Commented out code locally stores state and not refreshes data like above code does.
        // setReplyPosts([...replyPosts, newPost]);

        // Reset post content.
        setPost("");
        setErrorMessage("");
        togglePopup(null);
    };

    // Returns HTML elements and content to display on the pages
    return (

        // Text Post Form Code using normal HTML elements
        <div className="text-center">
            <p>&nbsp;</p>
            <h1 className="home-welcome display-4">Forum</h1>
            <hr style={{ width: "90%", borderWidth: "1px", backgroundColor: "#5dc7d8" }} />
            <p style={{ fontSize: "20px" }}>Feel Free to make a post!</p>
            <p>&nbsp;</p>

            <form onSubmit={handleSubmit} >
                <div className="form-group">
                    <h3 style={{ margin: "0 25% 10px 25%", width: "50%", textAlign: "left" }}>Create a Post:</h3>
                    <textarea style={{ margin: "auto", width: "50%", height: "110px", border: "solid 2px #5dc7d8" }} className="form-control" id="postText" name="postText" rows="3" value={post} onChange={handleInputChange} />
                </div>
                {errorMessage && (
                    <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errorMessage}</p>
                )}
                <button type="submit" style={{ textAlign: "right", margin: "0 0 0 40%", padding: "5px 25px 5px 25px" }} className="btn btn-outline-primary mr-sm-2" >Post</button>
                <button type="button" style={{ textAlign: "right" }} className="btn btn-outline-danger mr-sm-2" onClick={() => { setPost(""); setErrorMessage(null); }}  >Cancel</button>
            </form>
            <p>&nbsp;</p>
            <div>
            </div>
            {/* Shows Loading posts if server is not running */}
            {isLoading ?
                <div>Loading posts...
                    <p>&nbsp;</p>
                </div>
                :
                // If no posts are submitted then show this.
                posts.length === 0 ?
                    <div>
                        <span className="text-muted">No posts have been submitted.</span>
                        <p>&nbsp;</p>
                    </div>
                    :
                    // Map function for posts to be able easily access its data variables
                    posts.map((userPosts) =>
                        <div>
                            <div className="posts card" >
                                <div className="card-body">
                                    <h5 style={{ float: "left", textAlign: "center" }} className="card-title">{userPosts.user.username}</h5>
                                    <span style={{ float: "right", textAlign: "center", color: "#212121" }}>{new Date(userPosts.postDate).toLocaleString("en-AU", { hour12: true, hour: 'numeric', minute: 'numeric', day: "numeric", month: "short", year: "numeric" })}</span>
                                    <p style={{ margin: "0 0 10% 0" }}></p>
                                    <p style={{ clear: "both", float: "left", textAlign: "left" }} className="card-text">{userPosts.postText}</p>

                                    <div>
                                        <div>
                                            {/* Only Display the following Elements if the email of the post matches the logged in user */}
                                            {userPosts.email === userData.email &&
                                                <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await deleteReplyPost2(userPosts); await deletePost(userPosts); setPosts(await getPosts(), await getReplyPosts()); }} >Delete</button>
                                            }
                                            <button style={{ float: "right", textAlign: "right" }} className="btn btn-dark mr-sm-2" onClick={() => togglePopup(userPosts.forumPosts_id)} >Reply</button>
                                            
                                            <img className="thumbsdown" src={process.env.PUBLIC_URL + 'assets/images/baseline_thumb_down_off_alt_black_24dp.png'} alt="Like Icon" />
                                            <img className="thumbsup" src={process.env.PUBLIC_URL + 'assets/images/baseline_thumb_up_off_alt_black_24dp.png'} alt="Like Icon" />
                                        
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div>
                                {/* Only shows reply box text area if Post ID matches the ID of the Post being Selected */}
                                {selectedId !== userPosts.forumPosts_id ?
                                    <div></div>
                                    :
                                    <div>
                                        <p>&nbsp;</p>
                                        <div>
                                            <form onSubmit={handleSubmitReply} >
                                                <div className="form-group">
                                                    <h5 style={{ margin: "10px 25% 10px 25%", width: "50%", textAlign: "left" }}>Reply to a post:</h5>
                                                    <textarea style={{ margin: "auto", width: "50%", height: "110px", border: "solid 2px #5dc7d8" }} className="form-control" id="postText" name="postText" rows="3" value={post} onChange={handleInputChange} />
                                                </div>
                                                {errorMessage && (
                                                    <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errorMessage}</p>
                                                )}
                                                <button type="submit" style={{ textAlign: "right", margin: "0 0 0 40%", padding: "5px 25px 5px 25px" }} className="btn btn-outline-primary mr-sm-2" >Post</button>
                                                <button type="button" style={{ textAlign: "right" }} className="btn btn-outline-danger mr-sm-2" onClick={() => { setPost(""); setErrorMessage(null); togglePopup() }}  >Cancel</button>
                                                <p>&nbsp;</p>
                                            </form>
                                        </div>
                                    </div>
                                }
                            </div>
                            {/* Shows Replied Posts underneath the Original Post */}
                            {replyPosts.map((replyPosts) =>
                                replyPosts.forumPosts_id === userPosts.forumPosts_id &&
                                <div className="posts card" style={{ width: "45%" }} >
                                    <div className="card-body">
                                        <h5 style={{ float: "left", textAlign: "center" }} className="card-title">{replyPosts.user.username} <span style={{ fontSize: "11px" }}>- Replied Post</span></h5>
                                        <span style={{ float: "right", textAlign: "center", color: "#212121" }}>{new Date(replyPosts.replyDate).toLocaleString("en-AU", { hour12: true, hour: 'numeric', minute: 'numeric', day: "numeric", month: "short", year: "numeric" })}</span>
                                        <p style={{ margin: "0 0 10% 0" }}></p>
                                        <p style={{ clear: "both", float: "left", textAlign: "left" }} className="card-text">{replyPosts.replyText}</p>

                                        <div>
                                            <div>
                                                {/* Only Display the following Elements if the email of the post matches the logged in user */}
                                                {replyPosts.email === userData.email &&
                                                    <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await deleteReplyPost(replyPosts); setPosts(await getPosts()); setReplyPosts(await getReplyPosts()); }} >Delete</button>
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}
                            <p>&nbsp;</p>
                        </div>
                    )}
        </div>
    );
}

// Export the sign-up Function
export default Forum;