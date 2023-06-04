// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { createAnnouncements, getAnnouncements, deleteAnnouncements } from "../data/repository";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import parse from 'html-react-parser';

function Announcements(props) {

    const [errorMessage, setErrorMessage] = useState(null);
    const [announcement, setAnnouncement] = useState("");
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    var IFRAME_SRC = '//cdn.iframe.ly/api/iframe';
    var API_KEY = 'ec1627000e306b7c55174b';

    useEffect(() => {

        // Loads Announcements from DB
        async function loadAnnouncements() {
            const currentAnnouncements = await getAnnouncements();

            setAnnouncements(currentAnnouncements);
            setIsLoading(false);
        }

        // Calls the functions above
        loadAnnouncements();
    }, []);

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
                            '<div className="iframely-embed" style="width: 100%">' +
                            '<div className="iframely-responsive">' +
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

    // Handler for when textbox value changes
    const handleInputChange = (event, editor) => {
        const data = editor.getData();
        setAnnouncement(data);
        setErrorMessage("");
    };

    // Generic Form Submission Handler
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Trim the Announcement text.
        const trimmedAnnouncement = announcement.trim();

        // Validation Code
        if (trimmedAnnouncement === "") {
            setErrorMessage("Annoucement is Empty!");
            return;
        }

        // Create an Announcement.
        const newAnnoucement = { announcementText: trimmedAnnouncement, announcementDate: new Date().toLocaleString(), id: props.user.id };
        await createAnnouncements(newAnnoucement);

        // Update Page/Refresh the Data
        const currentAnnouncements = await getAnnouncements();
        setAnnouncements(currentAnnouncements);

        // Reset Announcement content.
        setAnnouncement("");
        setErrorMessage("");
    };

    return (
        <div>
            <p>&nbsp;</p>
            <form onSubmit={handleSubmit} >
                <div className="form-group">
                    <h3 className="text-center">Add Announcements:</h3>
                    <h5 className="text-center"> Make Sure to Please Delete the Previous Announcements when adding new ones!</h5>
                    <div className="richTextEditor">
                        <CKEditor editor={Editor} data={announcement} onChange={handleInputChange} config={editorConfig} />
                    </div>
                </div>
                {errorMessage && (
                    <p style={{ color: "red", textAlign: "center", fontSize: "18px", margin: "10px 10px 10px 10px" }}>{errorMessage}</p>
                )}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button type="submit" style={{ margin: "5px", padding: "5px 25px 5px 25px" }} className="text-center btn btn-outline-primary2" >Add</button>
                    <button type="button" style={{ margin: "5px" }} className="text-center btn btn-outline-danger" onClick={() => { setAnnouncement(""); setErrorMessage(null); }} >Clear</button>
                </div>
            </form>
            <p>&nbsp;</p>

            {isLoading ?
                <div className="card-body text-center">
                    <span className="text-muted">Loading Annoucements...</span>
                </div>
                :
                <>
                    {announcements.length === 0 ?
                        <div className="text-center">
                            <span className="text-muted">No Annoucements have been Posted!</span>
                            <p>&nbsp;</p>
                        </div>
                        :
                        <>
                            {announcements.map((announcement) =>
                                <div key={announcement.announcement_id}>
                                    {
                                        (props.user.group === "Admin") || // Group Admin can see any announcement made by anyone
                                        (props.user.group === "Principal" && props.user.gender === "Male") ||  // Principal (Male) can see announcements made Everyone
                                        (props.user.group === "Male Teacher" && announcement.user.group !== "Female Teacher" && announcement.user.gender !== "Female") || // Male teachers can only see their and other Male Teachers announcement and Admin and Male Principals
                                        (props.user.group === "Female Teacher" && announcement.user.group !== "Male Teacher" || announcement.user.group === "Principal") // Female teachers can only see their and other Female teacher and Admins and all Principals Announcements
                                        ? (


                                                <div className="postedContent card" style={{ minWidth: "50%", overflowX: "auto" }} >
                                                    <div className="card-body">
                                                        <h5 style={{ float: "left", textAlign: "center" }} className="card-title">{announcement.user.name} - {announcement.user.group} </h5>
                                                        <span style={{ float: "right", textAlign: "center", color: "#212121" }}>{new Date(announcement.announcementDate).toLocaleString("en-AU", { hour12: true, hour: 'numeric', minute: 'numeric', day: "numeric", month: "short", year: "numeric" })}</span>
                                                        <div className="post-body">
                                                            <pre className="postStyle card-text" style={{ whiteSpace: 'pre-wrap' }}>{parse(announcement.announcementText)}</pre>

                                                            {
                                                                (props.user.group === "Admin") ||  // Group Admin can delete any announcement made by anyone
                                                                    (announcement.user.group === "Male Teacher" && props.user.group === "Principal" && props.user.gender === "Male") ||  // Principal (Male) can delete announcements made by Male Teachers
                                                                    (announcement.user.group === "Principal" && props.user.group === "Principal" && (props.user.gender === "Male" || (props.user.gender === "Female" && announcement.user.gender === "Female"))) ||  // Principal (any gender) can delete announcements made by themselves or by Female Principals
                                                                    (announcement.user.group === "Male Teacher" && announcement.user.id === props.user.id) ||  // Logged-in user can delete their own announcement if they are a Male Teacher
                                                                    (announcement.user.group === "Female Teacher" && props.user.group === "Principal") ||  // Principal (any gender) can delete announcements made by Female Teachers
                                                                    (announcement.user.group === "Female Teacher" && announcement.user.id === props.user.id) || // Logged-in user can delete their own announcement if they are a Female Teacher
                                                                    (announcement.user.group === "Principal" && props.user.group === "Admin" && props.user.gender === "Female")  // Principal (Female) can be deleted only by Group Admin or Principal (any gender)
                                                                    ? (
                                                                        <div>
                                                                            <button
                                                                                type="submit"
                                                                                style={{ float: "right", textAlign: "right" }}
                                                                                className="btn btn-danger mr-sm-2"
                                                                                onClick={async () => {
                                                                                    await deleteAnnouncements(announcement);
                                                                                    setAnnouncements(await getAnnouncements());
                                                                                }}
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    ) : null
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null
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

// Export the home Function
export default Announcements;
