// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import parse from 'html-react-parser';
import { Link, useLocation } from "react-router-dom";
import { deleteHomeworks, getSelectedId, createHomeworks, getHomeworks, getSelectedId2, removeSelectedId, removeSelectedId2, getGroups } from "../data/repository";

// Functional Component for Navigation Bar
function AddHomework(props) {

    const [errorMessage, setErrorMessage] = useState(null);
    const [homework, setHomework] = useState("");
    const [homeworks, setHomeworks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [groups, setGroupsData] = useState([]);
    const location = useLocation();
    const groupNumber = location?.state?.groupNumber;

    let groupDetails;

    const group = groups.find((group) => group.id === groupNumber);
    
    if (group) {
        groupDetails = group.group;
    } else if (groupNumber === "5") {
        groupDetails = "All Students";
    } else {
        groupDetails = "Invalid group number";
    }


    var IFRAME_SRC = '//cdn.iframe.ly/api/iframe';
    var API_KEY = 'ec1627000e306b7c55174b';

    // Load Homeworks, Announcements and user Details from DB.
    useEffect(() => {

        // Loads Homeworks from DB
        async function loadHomeworks() {
            const currentHomeworks = await getHomeworks();

            setHomeworks(currentHomeworks);
            setIsLoading(false);
        }

         // Loads User Details from DB
         async function loadGroupDetails() {
            const currentGroups = await getGroups();
            setGroupsData(currentGroups)
        }

        // Calls the functions above
        loadHomeworks();
        loadGroupDetails();
    }, []);

    // Handler for when textbox value changes
    const handleInputChange = (event, editor) => {
        const data = editor.getData();
        setHomework(data);
        setErrorMessage("");
    };

    const editorConfig = {
        simpleUpload: {
            uploadUrl: 'http://localhost:4000/MAApi/image/upload',
            headers: {
                'X-CSRF-TOKEN': 'your-csrf-token'
            }
        },
        mediaEmbed: {
            previewsInData: true,
            providers: [
                {
                    // hint: this is just for previews. Get actual HTML codes by making API calls from your CMS
                    name: 'iframely previews',

                    // Match all URLs or just the ones you need:
                    url: /.+/,

                    html: match => {
                        const url = match[0];

                        var iframeUrl = IFRAME_SRC + '?app=1&api_key=' + API_KEY + '&url=' + encodeURIComponent(url);
                        // alternatively, use &key= instead of &api_key with the MD5 hash of your api_key
                        // more about it: https://iframely.com/docs/allow-origins

                        return (
                            // If you need, set maxwidth and other styles for 'iframely-embed' class - it's yours to customize
                            '<div class="iframely-embed" style="width: 100%">' +
                            '<div class="iframely-responsive">' +
                            `<iframe src="${iframeUrl}" ` +
                            'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                            '</iframe>' +
                            '</div>' +
                            '</div>'
                        );
                    }
                }
            ]
        }
    }

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
                    <h5 className="text-center"> Please Delete the Previous Homework Once it is Completed!</h5>
                    <div className="richTextEditor">
                        <CKEditor editor={Editor} data={homework} onChange={handleInputChange} config={editorConfig} />
                    </div>
                </div>
                {errorMessage && (
                    <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errorMessage}</p>
                )}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button type="submit" style={{ margin: "5px", padding: "5px 25px 5px 25px" }} className="text-center btn btn-outline-primary2" >Add</button>
                    <button type="button" style={{ margin: "5px " }} className="text-center btn btn-outline-danger" onClick={() => { setHomework(""); setErrorMessage(null); }} >Clear</button>
                    <Link to={`/HomeworkGroup/${groupNumber}`}>
                        <button type="button" style={{ margin: "5px" }} className="text-center btn btn-success" onClick={() => { setHomework(""); setErrorMessage(null); removeSelectedId2(); removeSelectedId(); }} >Go Back to {groupDetails}</button>
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
                    {homeworks.filter(homeworkPosts => homeworkPosts.student === getSelectedId()).length === 0 ?
                        <div className="text-center">
                            <span className="text-muted">No Homework have been Posted!</span>
                            <p>&nbsp;</p>
                        </div>
                        :
                        <>
                            {homeworks.filter(homeworkPosts => homeworkPosts.student === getSelectedId()).map((homeworkPosts) =>
                                <div key={homeworkPosts.homeworkPosts_id}>
                                    <div className="postedContent card" style={{ minWidth: "50%", overflowX: "auto" }}>
                                        <div className="card-body">
                                            <h5 style={{ float: "left", textAlign: "center", color: "#112c3f" }} className="card-title">
                                                {homeworkPosts.poster.gender === "Female" && homeworkPosts.poster.group === "Principal"
                                                    ? `${homeworkPosts.poster.name} - In Charge Girls Section` // If the homework is made by a female Principal, display "In Charge Girls Section"
                                                    : `${homeworkPosts.poster.name} - ${homeworkPosts.poster.group}`}
                                            </h5>
                                            <span style={{ float: "right", textAlign: "center", color: "#212121" }}>{new Date(homeworkPosts.homeworkDate).toLocaleString("en-AU", { hour12: true, hour: 'numeric', minute: 'numeric', day: "numeric", month: "short", year: "numeric" })}</span>
                                            <div className="post-body">
                                                <pre className="postStyle card-text" style={{ whiteSpace: 'pre-wrap' }}>{parse(homeworkPosts.homeworkText)}</pre>

                                                {
                                                    (props.user.group === "Admin") ||  // Group Admin can delete any homeworks made by anyone
                                                        (homeworkPosts.poster.group === "Male Teacher" && props.user.group === "Principal" && props.user.gender === "Male") ||  // Principal (Male) can delete homeworks made by Male Teachers
                                                        (homeworkPosts.poster.group === "Principal" && props.user.group === "Principal" && (props.user.gender === "Male" || (props.user.gender === "Female" && homeworkPosts.poster.gender === "Female"))) ||  // Principal (any gender) can delete homeworks made by themselves or by Female Principals
                                                        (homeworkPosts.poster.group === "Male Teacher" && homeworkPosts.poster.id === props.user.id) ||  // Logged-in user can delete their own homeworks if they are a Male Teacher
                                                        (homeworkPosts.poster.group === "Female Teacher" && props.user.group === "Principal") ||  // Principal (any gender) can delete homeworks made by Female Teachers
                                                        (homeworkPosts.poster.group === "Female Teacher" && homeworkPosts.poster.id === props.user.id) || // Logged-in user can delete their own announcement if they are a Female Teacher
                                                        (homeworkPosts.poster.group === "Principal" && props.user.group === "Admin" && props.user.gender === "Female")  // Principal (Female) can be deleted only by Group Admin or Principal (any gender)
                                                        ? (
                                                            <div>
                                                                <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await deleteHomeworks(homeworkPosts); setHomeworks(await getHomeworks()); }} >Delete</button>
                                                            </div>
                                                        ) : null
                                                }
                                            </div>
                                        </div>
                                    </div>
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
export default AddHomework;