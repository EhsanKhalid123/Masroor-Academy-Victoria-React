// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { getHomeworks, getAnnouncements } from "../data/repository";
import parse from 'html-react-parser';

function StudentDashboard(props) {

    const [homeworks, setHomeworks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);


    // Load users from DB
    useEffect(() => {

        // Loads Homeworks from DB
        async function loadHomeworks() {
            const currentHomeworks = await getHomeworks();

            setHomeworks(currentHomeworks);
            setIsLoading(false);
        }

        // Loads Announcements from DB
        async function loadAnnouncements() {
            const currentAnnouncements = await getAnnouncements();

            setAnnouncements(currentAnnouncements);
            setIsLoading(false);
        }

        // Calls the functions above
        loadAnnouncements();
        loadHomeworks();
    }, []);

    return (
        <div>

            <h1 className="text-center" style={{ paddingTop: "50px", color: "#112c3f" }}>
                {props.user.name}'s Dashboard
            </h1>
            <h4 className="text-center" style={{ paddingTop: "0px", color: "#112c3f" }}>
                Enrolled ID: <b>{props.user.id}</b>
            </h4>
            <h4 className="text-center" style={{ paddingTop: "0px", color: "#112c3f" }}>
                Group: <b>{props.user.group}</b>
            </h4>

            <br />

            <div className="row" style={{ marginRight: 0, marginLeft: "10px" }}>

                <div className="col-md-6">
                    <h2>Homeworks:</h2>
                    <hr style={{ borderTop: "2px solid #112c3f" }} />
                    {isLoading ?
                        <div className="card-body text-center">
                            <span className="text-muted">Loading Homework...</span>
                        </div>
                        :
                        <>
                            {homeworks.filter(homework => homework.student === props.user.id).length === 0 ?

                                <div className="card mb-3">
                                    <div className="card-body text-center">
                                        <span className="text-muted card-text">No Homework Posted!</span>
                                    </div>
                                </div>
                                :
                                <>
                                    {homeworks.filter(homework => homework.student === props.user.id).map((homework) =>
                                        <div key={homework.homeworkPosts_id}>
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <div className="noBottomMargin"><pre className="postStyle card-text">{parse(homework.homeworkText)}</pre></div>
                                                </div>
                                                <div className="card-footer text-center" style={{ color: "rgb(202 42 55)" }}>
                                                    {homework.poster.group === "Admin" ?
                                                        homework.poster.name + " - " + new Date(homework.homeworkDate).toLocaleString("en-AU", { day: "numeric", month: "short", year: "numeric" })
                                                        :
                                                        homework.poster.name + " - " + homework.poster.class + " - " + new Date(homework.homeworkDate).toLocaleString("en-AU", { day: "numeric", month: "short", year: "numeric" })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            }
                        </>
                    }
                </div>


                <div className="col-md-6">
                    <h2>Announcements:</h2>
                    <hr style={{ borderTop: "2px solid #112c3f" }} />
                    {isLoading ?
                        <div className="card mb-3">
                            <div className="card-body text-center">
                                <span className="text-muted card-text">Loading Annoucements...</span>
                            </div>
                        </div>
                        :
                        announcements.length === 0 ?
                            <div className="card mb-3">
                                <div className="card-body text-center">
                                    <span className="text-muted card-text">No Annoucements Posted!</span>
                                </div>
                            </div>
                            :
                            <>
                                {announcements.map((announcement) =>
                                    <div key={announcement.announcement_id}>
                                        <div className="card mb-3">
                                            <div className="card-body">
                                                <div className="noBottomMargin"><pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }} className="postStyle card-text">{parse(announcement.announcementText)}</pre></div>
                                            </div>

                                            <div className="card-footer text-center" style={{ color: "rgb(202 42 55)" }}>
                                                {announcement.user.group === "Admin" ?
                                                    announcement.user.name + " - " + new Date(announcement.announcementDate).toLocaleString("en-AU", { day: "numeric", month: "short", year: "numeric" })
                                                    :
                                                    announcement.user.name + " - " + announcement.user.class + " - " + new Date(announcement.announcementDate).toLocaleString("en-AU", { day: "numeric", month: "short", year: "numeric" })
                                                }

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                    }
                </div>
            </div>


            <br />

        </div>
    );
}

// Export the StudentDashboard Function
export default StudentDashboard;
