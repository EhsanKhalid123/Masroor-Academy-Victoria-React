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
    const [image, setImage] = useState([]);

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
            },
            // Callback function that sets the image state variable
            uploadSuccess: (response) => {
              setImage(response.url);
            }
        }
    }

    // Handler for when textbox value changes
    const handleInputChange = (event, editor) => {
        const data = editor.getData();
        setAnnouncement(data);
        console.log(data);
        // setAnnouncement(event.target.value);
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
        const newAnnoucement = { announcementText: trimmedAnnouncement, announcementImage: image, announcementDate: new Date().toLocaleString(), id: props.user.id };
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
                                    <div className="postedContent card" style={{ minWidth: "50%", overflowX: "auto" }}>
                                        <div className="card-body">
                                            <h5 style={{ float: "left", textAlign: "center" }} className="card-title">{announcement.user.name}</h5>
                                            <span style={{ float: "right", textAlign: "center", color: "#212121" }}>{new Date(announcement.announcementDate).toLocaleString("en-AU", { hour12: true, hour: 'numeric', minute: 'numeric', day: "numeric", month: "short", year: "numeric" })}</span>
                                            <div className="post-body">
                                                <pre className="postStyle card-text" style={{ whiteSpace: 'pre-wrap' }}>{parse(announcement.announcementText)}</pre>

                                                <div>
                                                    <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await deleteAnnouncements(announcement); setAnnouncements(await getAnnouncements()); }} >Delete</button>
                                                </div>
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

// Export the home Function
export default Announcements;