// Importing React classes and functions from node modules
import React from "react";
import { Link } from "react-router-dom";

import logo from "../Masroor Academy Logo 2.png";

function About() {

    return (
        <div>
            {/* // Contents of the main page uses basic HTML elements */}
            <div className="text-center">
                {/* Message being shown here which was passed through App. */}
                <p>&nbsp;</p>
                <h3 className="home-welcome display-5">About Us</h3>
                <img src={logo} className="home-logo-image" alt="logo" style={{width: "13%"}} />
                <hr style={{ width: "90%", borderWidth: "1px", backgroundColor: "#aa0001" }} />
                <div style={{ padding: "0 10% 5% 10%" }}>
                  <p>&nbsp;</p>
              <h5 style={{margin: "0 100px 0 10px"}}>Masroor Academy is a private school for the Ahmadiyya Muslim Community Organisation. 
                This website is a school management website, where students will be able to see their final results/grades, 
                their attendance and total classes that were run. Students will be able to see their homeworks and their syllabus 
                as well as see their progress and all the work they have completed. Teachers will be able to record attendance 
                for each student as well as give their marks, add homework and add announcements.</h5>
                </div>
            </div>
        </div>

    );

}

// Export the home Function
export default About;