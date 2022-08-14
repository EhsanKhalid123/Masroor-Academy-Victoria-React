// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { selectedId, getPosts, selectedId2, getProfileUsers, deleteUserDB, getSelectedId, getProfile, deletePost2, createReplyPost, getReplyPosts, deleteReplyPost } from "../data/repository";

function Dashboad(props) {


    const [users, setUsersData] = useState([]);
    // const [homeworks, setHomeworks] = useState([]);
    const [userData, setUserData] = useState([]);
    const [user, setUser] = useState([]);
    const [homeworks, setPosts] = useState([]);
    const [replyPosts, setReplyPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [announcement, setAnnouncement] = useState("");
    const [announcements, setAnnouncements] = useState([]);

    // Load users from DB.
    useEffect(() => {

        // Loads Posts from DB
        async function loadPosts() {
            const currentPosts = await getPosts();

            setPosts(currentPosts);
            setIsLoading(false);
        }

        // Loads User Data from DB
        // async function loadUserDetails() {
        //     const currentDetails = await getProfile(getSelectedId());
        //     setUserData(currentDetails)
        //     setIsLoading(false);

        // }

        async function loadUserDetails() {
            const currentDetails = await getProfileUsers();
            setUsersData(currentDetails)
            setIsLoading(false);

        }

        async function loadAnnouncements() {
            const currentPosts = await getReplyPosts();

            setAnnouncements(currentPosts);
            setIsLoading(false);
        }

        // Calls the functions above
        loadAnnouncements();
        loadUserDetails();
        loadPosts();
    }, []);

    const deleteSelectedUser = async (event) => {
        const currentDetails = await getProfile(getSelectedId());
        setUser(currentDetails);
        const id = { id: getSelectedId() };
        deletePost2(id);
        deleteUserDB(user);
    }

    return (
        <div>
            <h1 className="text-center" style={{ paddingTop: "50px", color: "#112c3f" }}>
                {props.user.name}'s Dashboard
            </h1>
            <h4 className="text-center" style={{ paddingTop: "0px", color: "#112c3f" }}>
                Enrolled ID: <b>{props.user.id}</b>
            </h4>
            <p>&nbsp;</p>
            {props.user.name !== "Admin" && props.user.name !== "Teacher" ?

                <div className="container">

                    <div className="profile-card" style={{padding: "0 20px 2% 20px"}}>
                        <div className="text-center">
                            <div className="card">
                                <h5 className="card-header card text-white bg-custom">Announcements:</h5>
                                {isLoading ?
                                    <div className="card-body text-center">
                                        <span className="text-muted">Loading Annoucements...</span>
                                    </div>
                                    :
                                    announcements.length === 0 ?
                                        <div className="text-center text-muted">
                                            <div className="card-body">No Annoucements Posted!</div>  
                                        </div>
                                        :
                                        announcements.map((userPosts) =>
                                            <div>
                                                <div className="card-body" style={{padding: "5px"}}>{userPosts.announcementText}</div>
                                            </div>
                                        )
                                }
                            </div>

                        </div>
                    </div>


                    <div className="row">
                        <div className="col-lg-6 mb-4">
                            <div className="card">
                                <img className="card-img-top" src="" alt="" />

                                <div className="card-body">
                                    <div className="text-center">
                                        <div className="card">
                                            <h5 className="card-header card text-white bg-custom">Homework:</h5>
                                            <h5 className="card-header card" style={{ color: "#112c3f" }}>{props.user.group}</h5>
                                            {isLoading ?
                                                <div className="card-body">
                                                    <span className="text-muted">Loading Homework...</span>
                                                </div>
                                                :
                                                homeworks.map((homework) =>
                                                    <>
                                                        {homework.id === props.user.id &&
                                                            <div className="card-body">{homework.homeworkText}</div>
                                                        }

                                                    </>
                                                )}
                                        </div>

                                    </div>

                                    {/* <a href="#" className="btn btn-outline-primary btn-sm">Card link</a> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-4">
                            <div className="card">
                                <img className="card-img-top" src="" alt="" />

                                <div className="card-body">
                                    <div className="text-center">

                                        <div className="card">
                                            <h5 className="card-header card text-white bg-custom">Syllabus:</h5>
                                            <h5 className="card-header card" style={{ color: "#112c3f" }}>{props.user.group}</h5>
                                            <div className="card-body">

                                                {props.user.group === "14-15 (Group 4)" &&
                                                    <div>
                                                        <div>
                                                            <h5>Holy Quran <span>&amp;</span> Namaz:</h5>
                                                            <p>-----------------</p>
                                                            <p>Surah Al-Qariah</p>
                                                            <p>Surah Al-Takathur</p>
                                                            <p>Surah Al-Qadr</p>
                                                            <p>Surah Al-Kahf</p>
                                                            <p>Surah Al-Zilzal</p>
                                                            <p>Surah At-Teen</p>
                                                            <p>Surah Al-Inshirah</p>
                                                            <p>Surah Al-Duha</p>
                                                            <p>Page 31-60 : Salat the Muslim Prayer Book</p>
                                                            <p>Namaz with Translation</p>
                                                        </div>
                                                        <div>
                                                            <h5>Islam <span>&amp;</span> Ahmadiyyat:</h5>
                                                            <p>-----------------</p>
                                                            <p>Q1 - Hazrat Umer Farooq r.a - page 1 - 48</p>
                                                            <p>Q2 - My Book about God - Page 1 - 50</p>
                                                            <p>Q3 - My Book about God - Page 51 - 97</p>
                                                            <p>Q4  -Syedna Bilal r.a - Page 1 - 31</p>
                                                            <p>Q1 – Life of the Promised Messiah (AS) by Hazrat Maulvi Abdul Karim of Sialkot – Page 101-112</p>
                                                            <p>Q2 – Ahmad the Guided one by Iain Adamson – Page 1-39</p>
                                                            <p>Q3 – Ahmad the Guided one by Iain Adamson – Page 40-73</p>
                                                            <p>Q4 – Ahmad the Guided one by Iain Adamson – Page 74-112</p>
                                                        </div>
                                                    </div>
                                                }
                                                {props.user.group === "12-13 (Group 3)" &&
                                                    <div>
                                                        <div>
                                                            <h5>Holy Quran <span>&amp;</span> Namaz:</h5>
                                                            <p>-----------------</p>
                                                            <p>Surah Al-A’laa</p>
                                                            <p>Surah Al-Ghaashiah</p>
                                                            <p>Namaz-e-Janaza with Translation</p>
                                                            <p>Surah Al- Lahab</p>
                                                            <p>Surah Al- Quraish </p>
                                                            <p>First 17 verses of Surah Al-Baqra</p>
                                                            <p>Page 31-60 : Salat the Muslim Prayer Book</p>
                                                            <p>Namaz with Translation</p>
                                                        </div>
                                                        <div>
                                                            <h5>Islam <span>&amp;</span> Ahmadiyyat:</h5>
                                                            <p>-----------------</p>
                                                            <p>Q1 - Muslim Festivals and Ceremonies - page 51-100 </p>
                                                            <p>Q2 - Holy Prophet’s kindness to children - page 1-45 </p>
                                                            <p>Q3 - Hazrat Abu Bakr Siddique r.a - page 5-72</p>
                                                            <p>Q4 - Hazrat Abu Bakr Siddique r.a - page 73-120</p>
                                                            <p>Q1 – Life of the Promised Messiah (AS) by Hazrat Maulvi Abdul Karim of Sialkot – Page 51-62</p>
                                                            <p>Q2 – Life of the Promised Messiah (AS) by Hazrat Maulvi Abdul Karim of Sialkot – Page 63-74</p>
                                                            <p>Q3 – Life of the Promised Messiah (AS) by Hazrat Maulvi Abdul Karim of Sialkot – Page 74-87</p>
                                                            <p>Q4 – Life of the Promised Messiah (AS) by Hazrat Maulvi Abdul Karim of Sialkot – Page 87-99</p>
                                                        </div>
                                                    </div>
                                                }

                                                {props.user.group === "9-11 (Group 2)" &&
                                                    <div>
                                                        <div>
                                                            <h5>Holy Quran <span>&amp;</span> Namaz:</h5>
                                                            <p>-----------------</p>
                                                            <p>Surah Al-Quresh </p>
                                                            <p>Surah Al-Ma’un</p>
                                                            <p>Surah Al-Fil</p>
                                                            <p>Ayat-Al-Kursi</p>
                                                            <p>Neyaah</p>
                                                            <p>Sanaa</p>
                                                            <p>Taa’uz and Surah Fateha</p>
                                                            <p>Rukuh - Tasbeeh - Tehmeed - Sajdah</p>
                                                            <p>Surah At-Takasur</p>
                                                            <p>Surah Al-Humazah</p>
                                                            <p>Surah Al-Qaariah</p>
                                                            <p>Surah At-Teen</p>
                                                            <p>Dua Sajdain</p>
                                                            <p>Tashahud</p>
                                                            <p>Darood Sharif</p>
                                                            <p>Last 2 prayers of namaz</p>
                                                            <p>Surah Al-Qadr</p>
                                                            <p>Surah Al-Zilzaal</p>
                                                            <p>Surah Ad-Duhaa</p>
                                                            <p>Surah Al-Inshiraah</p>
                                                            <p>Dua-e-Qanoot with Translation</p>
                                                        </div>
                                                        <div>
                                                            <h5>Islam <span>&amp;</span> Ahmadiyyat:</h5>
                                                            <p>-----------------</p>
                                                            <p>Q1 - Stories from early Islam - page 1-64</p>
                                                            <p>Q2 - Stories from early Islam - page 65 - 120</p>
                                                            <p>Q3 - Stories from early Islam - page 121 - 194</p>
                                                            <p>Q4 - Muslim Festivals and Ceremonies - page 1-50</p>
                                                            <p>Q1 - Stories from early Ahmadiyyat - page 83-102</p>
                                                            <p>Q2 – Life of the Promised Messiah (AS) by Hazrat Maulvi Abdul Karim of Sialkot – Page 19-30</p>
                                                            <p>Q3 – Life of the Promised Messiah (AS) by Hazrat Maulvi Abdul Karim of Sialkot – Page 30-41</p>
                                                            <p>Q4 – Life of the Promised Messiah (AS) by Hazrat Maulvi Abdul Karim of Sialkot – Page 41-50</p>
                                                        </div>
                                                    </div>
                                                }

                                                {props.user.group === "7-8 (Group 1)" &&
                                                    <div>
                                                        <div>
                                                            <h5>Holy Quran <span>&amp;</span> Namaz:</h5>
                                                            <p>-----------------</p>
                                                            <p>Yassernal Quran Page 6 - 20</p>
                                                            <p>Yassernal Quran Page 21 - 30</p>
                                                            <p>Yassernal Quran Page 31 - 47</p>
                                                            <p>Surah Al-Kausar</p>
                                                            <p>Surah Al-Asar</p>
                                                            <p>Surah Al-Akhlas</p>
                                                            <p>Surah Al-Falaq</p>
                                                            <p>Neyaah</p>
                                                            <p>Sanaa</p>
                                                            <p>Taa’uz and Surah Fateha</p>
                                                            <p>Rukuh - Tasbeeh - Tehmeed - Sajdah</p>
                                                            <p>Yassernal Quran Page 48 - 55</p>
                                                            <p>Yassernal Quran Page 56 - 61</p>
                                                            <p>Yassernal Quran Page 62 - 69</p>
                                                            <p>Yassernal Quran Page 48 - 55</p>
                                                            <p>Surah An-Naas</p>
                                                            <p>Surah La-Haab</p>
                                                            <p>Surah An-Nasar</p>
                                                            <p>Surah Al-Kafirun</p>
                                                            <p>Dua Sajdain</p>
                                                            <p>Tashahud</p>
                                                            <p>Darood Sharif</p>
                                                            <p>Last 2 prayers of namaz</p>
                                                        </div>
                                                        <div>
                                                            <h5>Islam <span>&amp;</span> Ahmadiyyat:</h5>
                                                            <p>-----------------</p>
                                                            <p>Q1 - Our beloved master’s early life - page 1-67</p>
                                                            <p>Q2 - Our beloved master’s early life - page 71 - 127</p>
                                                            <p>Q3 - Our beloved master’s early life - page 127 - 189</p>
                                                            <p>Q4 - My book of Islamic rhymes - page 1 -55</p>
                                                            <p>Q1 - Stories from early Ahmadiyyat - page 3-20</p>
                                                            <p>Q2 - Stories from early Ahmadiyyat - page 21-40</p>
                                                            <p>Q3 - Stories from early Ahmadiyyat - page 41-61</p>
                                                            <p>Q4 - Stories from early Ahmadiyyat - page 62-81</p>
                                                        </div>
                                                    </div>
                                                }

                                            </div>
                                        </div>
                                    </div>

                                    {/* <a href="#" className="btn btn-outline-primary btn-sm">Card link</a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                // props.user.name === "Admin" &&
                <div>
                    <p>&nbsp;</p>

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th></th>
                                <th>ID</th>
                                <th style={{ color: "#112c3f" }} scope="col">Name</th>
                                <th style={{ color: "#112c3f" }} scope="col">Group</th>
                                <th></th>

                            </tr>
                        </thead>
                        {/* Mapping Users state Variable to access its content easily to display in Table */}
                        {users.map((userDetails) =>
                            <tbody>
                                {userDetails.name !== props.user.name && (userDetails.name !== "Admin") &&
                                    <>
                                        {((props.user.id === "FemaleTeachers" && userDetails.gender === "Nasirat") || (props.user.id === "MaleTeachers" && userDetails.gender === "Atfal") || (props.user.id === "Admin")) &&
                                            <tr key={userDetails.name}>
                                                <td></td>
                                                <td style={{ color: "#112c3f" }}>{userDetails.id}</td>
                                                <td style={{ color: "#112c3f" }} scope="row">{userDetails.name}</td>
                                                <td style={{ color: "#112c3f" }}>{userDetails.group}</td>

                                                <td>
                                                    <Link to="/Homework">
                                                        <button className="btn2 btn-custom" onClick={() => { selectedId(userDetails.id); selectedId2(userDetails.name) }}>Select</button>
                                                    </Link>
                                                    {props.user.name === "Admin" &&
                                                        <Link to="/Dashboard">
                                                            <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await selectedId(userDetails.id); await deleteSelectedUser() }} >Delete</button>
                                                        </Link>
                                                    }
                                                </td>
                                            </tr>
                                        }
                                    </>
                                }


                            </tbody>
                        )}
                    </table>
                </div>
            }
        </div>
    );
}

// Export the home Function
export default Dashboad;
