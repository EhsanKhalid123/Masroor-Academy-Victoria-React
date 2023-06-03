// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { getProfileUsers, getHomeworks, getAnnouncements, fetchResources, fetchImages, getClasses, getGroups } from "../data/repository";

function Dashboard(props) {


    const [totalHomeworks, setTotalHomeworks] = useState(0);
    const [totalAnnouncements, setTotalAnnouncements] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalResources, setTotalResources] = useState(0);
    const [totalImages, setTotalImages] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const [totalAdmins, setTotalAdmins] = useState(0);
    const [totalGroups, setTotalGroups] = useState(0);
    const [totalStudentGroups, setTotalStudentGroups] = useState(0);
    const [totalClasses, setTotalClasses] = useState(0);
    const [totalPrincipals, setTotalPrincipals] = useState(0);
    const [maleTeachers, setMaleTeachers] = useState(0);
    const [femaleTeachers, setFemaleTeachers] = useState(0);
    const [atfal, setAtfal] = useState(0);
    const [nasirat, setNasirat] = useState(0);


    // Load Form Status from DB
    useEffect(() => {
        async function loadUserProfile() {
            const currentDetails = await getProfileUsers();
            const currentHomeworks = await getHomeworks();
            const currentAnnouncements = await getAnnouncements();
            const currentResources = await fetchResources();
            const currentImages = await fetchImages();
            const currentClasses = await getClasses();
            const currentGroups = await getGroups();

            // Count total number of Homeworks Posted
            setTotalHomeworks(currentHomeworks.length);
            // Count total number of users
            setTotalUsers(currentDetails.length);
            // Count total number of Announcements Posted
            setTotalAnnouncements(currentAnnouncements.length);
            // Count total number of Announcements Posted
            setTotalResources(currentResources.length);
            // Count total number of Images
            setTotalImages(currentImages.length);
            // Count total number of Classes
            setTotalClasses(currentClasses.length);
            // Count total number of Groups
            setTotalGroups(currentGroups.length);

            const studentGroups = currentGroups.filter(groups =>
                groups.group !== 'Male Teacher' &&
                groups.group !== 'Female Teacher' &&
                groups.group !== 'Admin' &&
                groups.group !== 'Principal'
            );

            setTotalStudentGroups(studentGroups.length);

            // Count total number of teachers
            const teachers = currentDetails.filter(user => (user.group === 'Male Teacher' || user.group === 'Female Teacher'));
            setTotalTeachers(teachers.length);

            const students = currentDetails.filter(user => (user.group !== 'Male Teacher' && user.group !== 'Female Teacher' && user.group !== 'Admin'));
            setTotalStudents(students.length);

            const admins = currentDetails.filter(user => (user.group === 'Admin'));
            setTotalAdmins(admins.length);

            const maleTeachers = currentDetails.filter(user => (user.group === 'Male Teacher'));
            setMaleTeachers(maleTeachers.length);

            const femaleTeachers = currentDetails.filter(user => (user.group === 'Female Teacher'));
            setFemaleTeachers(femaleTeachers.length);

            const principals = currentDetails.filter(user => (user.group === 'Principal'));
            setTotalPrincipals(principals.length);

            const atfal = currentDetails.filter(user => (user.gender === 'Atfal'));
            setAtfal(atfal.length);

            const nasirat = currentDetails.filter(user => (user.gender === 'Nasirat'));
            setNasirat(nasirat.length);


        }

        // Calls the functions above
        loadUserProfile();

    }, []);


    return (
        <div>
            <h1 className="text-center" style={{ paddingTop: "50px", color: "#112c3f" }}>
                {props.user.name}'s Dashboard
            </h1>
            <h4 className="text-center" style={{ paddingTop: "0px", color: "#112c3f" }}>
                Enrolled ID: <b>{props.user.id}</b>
            </h4>
            <p>&nbsp;</p>

            {(props.user.group === "Male Teacher" || props.user.group === "Female Teacher" || (props.user.group === "Principal" && props.user.gender === "Female")) &&
                <>
                    <div className="container">


                        <div className="row">
                            <div className="col-sm-4 mt-custom" style={{ display: "block", margin: "auto", marginTop: "20px" }} >
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(29 169 96 / 44%)" }}>
                                        <h5>Total Groups:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{totalStudentGroups}</h2>
                                    </div>
                                </div>
                            </div>
                            {(props.user.group === "Female Teacher" || props.user.group === "Principal") &&
                                <div className="col-sm-4 mt-custom" style={{ display: "block", margin: "auto", marginTop: "20px" }}>
                                    <div className="card text-center">
                                        <div className="card-header" style={{ backgroundColor: "rgb(238 183 49 / 52%)" }}>
                                            <h5>Total Nasirat:</h5>
                                        </div>
                                        <div className="card-body">
                                            <h2 className="card-title font-weight-bold">{nasirat}</h2>
                                        </div>
                                    </div>
                                </div>
                            }

                            {props.user.group === "Principal" && props.user.gender === "Female" &&
                                <div className="col-sm-4 mt-custom" style={{ display: "block", margin: "auto", marginTop: "20px" }}>
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(49 200 238 / 52%)" }}>
                                        <h5>Female Teachers:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{femaleTeachers}</h2>
                                    </div>
                                </div>
                            </div>
                            }

                            {props.user.group === "Male Teacher" &&
                                <div className="col-sm-4 mt-custom" style={{ display: "block", margin: "auto", marginTop: "20px" }}>
                                    <div className="card text-center">
                                        <div className="card-header" style={{ backgroundColor: "rgb(238 183 49 / 52%)" }}>
                                            <h5>Total Atfal:</h5>
                                        </div>
                                        <div className="card-body">
                                            <h2 className="card-title font-weight-bold">{atfal}</h2>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </>
            }

            {(props.user.group === "Admin" || (props.user.group === "Principal" && props.user.gender === "Male")) &&
                <>
                    <div className="container">

                        <div className="row">
                            <div className="col-sm-4 mt-custom">
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(29 169 96 / 44%)" }}>
                                        <h5>Total Students:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{totalStudents}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 mt-custom">
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(79 169 29 / 44%)" }}>
                                        <h5>Total Teachers:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{totalTeachers}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 mt-custom">
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(238 49 49 / 52%)" }}>
                                        <h5>Total Users:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{totalUsers}</h2>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <br />

                        <div className="row">
                            <div className="col-sm-4 mt-custom">
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(80 29 169 / 44%)" }}>
                                        <h5>Total Admins:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{totalAdmins}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 mt-custom">
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(29 126 169 / 44%)" }}>
                                        <h5>Male Teachers:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{maleTeachers}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 mt-custom">
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(207 238 49 / 52%)" }}>
                                        <h5>Female Teachers:</h5>
                                    </div>
                                    <div className="card-body mt-custom">
                                        <h2 className="card-title font-weight-bold">{femaleTeachers}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <br />

                        <div className="row">
                            <div className="col-sm-4 mt-custom">
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(238 49 140 / 52%)" }}>
                                        <h5>Total Atfal:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{atfal}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 mt-custom">
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(238 183 49 / 52%)" }}>
                                        <h5>Total Nasirat:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{nasirat}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 mt-custom">
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(49 238 107 / 52%)" }}>
                                        <h5>Announcements Posted:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{totalAnnouncements}</h2>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <br />

                        <div className="row">
                            <div className="col-sm-4 mt-custom" >
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(167 167 167 / 58%)" }}>
                                        <h5>Homeworks Posted:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{totalHomeworks}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 mt-custom">
                                <div className="card text-center">
                                    <div className="card-header">
                                        <h5>Total Resources:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{totalResources}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 mt-custom">
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(28 109 120 / 77%)", color: "white" }}>
                                        <h5>Total Images:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{totalImages}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <br />

                        <div className="row">
                            <div className="col-sm-4 mt-custom" style={{ display: "block", margin: "auto", marginTop: "20px" }} >
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(29 169 96 / 44%)" }}>
                                        <h5>Total Groups:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{totalGroups}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-4 mt-custom" style={{ display: "block", margin: "auto", marginTop: "20px" }}>
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(79 169 29 / 44%)" }}>
                                        <h5>Total Classes:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{totalClasses}</h2>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-sm-4 mt-custom" style={{ display: "block", margin: "auto", marginTop: "20px" }}>
                                <div className="card text-center">
                                    <div className="card-header" style={{ backgroundColor: "rgb(79 169 29 / 44%)" }}>
                                        <h5>Total Principals:</h5>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title font-weight-bold">{totalPrincipals}</h2>
                                    </div>
                                </div>
                            </div>
                        
                        </div>

                    </div>
                </>
            }

            <p>&nbsp;</p>

        </div>
    );
}

// Export the Dashboard Function
export default Dashboard;
