// Importing React classes and functions from node modules
import React from "react";
import { Link } from "react-router-dom";

import logo from "../Masroor Academy Logo 2.png";

function Home() {

    return (
        <div>
            {/* // Contents of the main page uses basic HTML elements */}
            <div className="text-center">
                {/* Message being shown here which was passed through App. */}
                <p>&nbsp;</p>
                <h3 className="home-welcome display-5">Welcome to Masroor Academy Victoria</h3>
                <img src={logo} className="home-logo-image" alt="logo"/>
                <hr style={{ width: "90%", borderWidth: "1px", backgroundColor: "#aa0001" }} />
                <div style={{ padding: "0 10% 5% 10%" }}>
                <Link to="/Sign-in">
                  <button className="btn btn-custom my-2 my-sm-0" style={{fontSize: "30px"}} type="submit">
                    Login
                  </button>
                </Link>
                </div>
            </div>
        </div>

    );

}

// Export the home Function
export default Home;