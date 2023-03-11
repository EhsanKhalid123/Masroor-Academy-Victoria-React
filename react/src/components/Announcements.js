// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { createAnnouncements, getAnnouncements, deleteAnnouncements, getSelectedId } from "../data/repository";


function Announcements(props) {

    const [errorMessage, setErrorMessage] = useState(null);
    const [announcement, setAnnouncement] = useState("");
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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


    // Handler for when textbox value changes
    const handleInputChange = (event) => {
        setAnnouncement(event.target.value);
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
        console.log(newAnnoucement);
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
                        announcements.map((announcement) =>
                            <div>
                                <div className="postedContent card" >
                                    <div className="card-body">
                                        <h5 style={{ float: "left", textAlign: "center" }} className="card-title">{announcement.user.name}</h5>
                                        <span style={{ float: "right", textAlign: "center", color: "#212121" }}>{new Date(announcement.announcementDate).toLocaleString("en-AU", { hour12: true, hour: 'numeric', minute: 'numeric', day: "numeric", month: "short", year: "numeric" })}</span>
                                        <p style={{ margin: "0 0 10% 0" }}></p>
                                        <pre className="postStyle card-text">{announcement.announcementText}</pre>

                                        <div>
                                            <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await deleteAnnouncements(announcement); setAnnouncements(await getAnnouncements()); }} >Delete</button>
                                        </div>

                                    </div>
                                </div>
                                <p>&nbsp;</p>
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