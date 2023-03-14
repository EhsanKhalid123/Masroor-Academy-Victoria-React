// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import parse from 'html-react-parser';
import { Link } from "react-router-dom";
import { deleteHomeworks, getSelectedId, createHomeworks, getHomeworks, getSelectedId2 } from "../data/repository";

// Functional Component for Navigation Bar
function Homework(props) {

    const [errorMessage, setErrorMessage] = useState(null);
    const [homework, setHomework] = useState("");
    const [homeworks, setHomeworks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load Homeworks, Announcements and user Details from DB.
    useEffect(() => {

        // Loads Homeworks from DB
        async function loadHomeworks() {
            const currentHomeworks = await getHomeworks();

            setHomeworks(currentHomeworks);
            setIsLoading(false);
        }

        // Calls the functions above
        loadHomeworks();
    }, []);

    // Handler for when textbox value changes
    const handleInputChange = (event, editor) => {
        const data = editor.getData();
        setHomework(data);
        // setHomework(event.target.value);
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
        const newHomework = { homeworkText: trimmedHomework, homeworkDate: new Date().toLocaleString, id: props.user.id, student: getSelectedId() };
        await createHomeworks(newHomework);

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
                    <h3 className="text-center">Add Homework for Student {getSelectedId2()}</h3>
                    <h5 className="text-center"> Make Sure to Please Delete the Previous Homework Once Done!</h5>
                    <div className="richTextEditor">
                        <CKEditor editor={Editor} data={homework} onChange={handleInputChange} />
                    </div>
                </div>
                {errorMessage && (
                    <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errorMessage}</p>
                )}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button type="submit" style={{ margin: "5px", padding: "5px 25px 5px 25px" }} className="text-center btn btn-outline-primary2" >Add</button>
                    <button type="button" style={{ margin: "5px " }} className="text-center btn btn-outline-danger" onClick={() => { setHomework(""); setErrorMessage(null); }} >Clear</button>
                    <Link to="/Student">
                        <button type="button" style={{ margin: "5px" }} className="text-center btn btn-success" onClick={() => { setHomework(""); setErrorMessage(null); }}  >Go Back to Students</button>
                    </Link>
                </div>
            </form>
            <p>&nbsp;</p>

            {isLoading ?
                <div className="card-body text-center">
                    <span className="text-muted">Loading Homework...</span>
                </div>
                :
                <>
                    {homeworks.length === 0 ?
                        <div className="text-center">
                            <span className="text-muted">No Homework have been Posted!</span>
                            <p>&nbsp;</p>
                        </div>
                        :
                        <>
                            {homeworks.map((homeworkPosts) =>
                                <div key={homeworkPosts.homeworkPosts_id}>
                                    {homeworkPosts.student === getSelectedId() ?
                                        <div className="postedContent card" >
                                            <div className="card-body">
                                                <h5 style={{ float: "left", textAlign: "center", color: "#112c3f" }} className="card-title">{homeworkPosts.id}</h5>
                                                <span style={{ float: "right", textAlign: "center", color: "#212121" }}>{new Date(homeworkPosts.homeworkDate).toLocaleString("en-AU", { hour12: true, hour: 'numeric', minute: 'numeric', day: "numeric", month: "short", year: "numeric" })}</span>
                                                <p style={{ margin: "0 0 10% 0" }}></p>

                                                <div className="post-body">
                                                    <pre className="postStyle card-text" style={{ whiteSpace: 'pre-wrap' }}>{parse(homeworkPosts.homeworkText)}</pre>

                                                    <div>
                                                        <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await deleteHomeworks(homeworkPosts); setHomeworks(await getHomeworks()); }} >Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className="text-center text-muted">
                                            <div className="card-body">No Homework have been Posted!</div>
                                        </div>
                                    }
                                    <p>&nbsp;</p>
                                </div>
                            )}
                        </>
                    }
                </>
            }
            <p>&nbsp;</p>
        </div>
    );
}

// Export the Navigation Function
export default Homework;