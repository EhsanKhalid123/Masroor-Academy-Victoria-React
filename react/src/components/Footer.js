// Importing React classes and functions from node modules
import React from "react";
import { Link } from "react-router-dom";

// Functional Component for Footer Page
function Footer() {

    // Returns HTML content to display on pages
    return (

        // Footer code adapted from Bootstrap Official Documents, I made changes to it 
        // https://mdbootstrap.com/docs/b4/jquery/navigation/footer/

        <footer className="page-footer font-small" style={{ backgroundColor: "#f0f0f0" }}>

            {/* Top Footer - About Section */}
            <div className="parallax">
                <ul className="list-unstyled list-inline text-center py-2">
                    <li className="list-inline-item">
                        <h5 className="mb-1 text-uppercase footer-parralax-text">Masroor Academy Victoria</h5>
                        <p style={{ color: "white", fontSize: "20px", margin: "0 20px 20px 20px" }}>Students School Portal - View Progress and Results</p>
                    </li>
                </ul>
            </div>

            {/* Bottom Footer - Copyright Section */}
            <div className="footer-copyright text-center py-3 " style={{ backgroundColor: "#27b8cfba" }}><b>© 2022 Copyright:</b>
                <Link to="/" style={{ color: "#c30000" }}> <b>Masroor Academy - Victoria</b></Link>
            </div>

        </footer>
    );
}

// Export the footer Function
export default Footer;