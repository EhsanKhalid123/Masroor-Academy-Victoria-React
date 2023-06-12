// Importing React classes and functions from node modules
import React from "react";
import backgroundImage from "../assets/images/istockphoto-1192265107-170667a.jpg";

// Functional Component for header
function Header() {

    // Returns HTML elements and contents to display on page
    return (

        // Bootstrap classes used to style the header using simple HTML elements
        // Code adapted from https://mdbootstrap.com/docs/standard/navigation/headers/

        // url(" + "URL LINK HERE" + ") - Note to self Syntax for using websites for images
        <div className="p-5 text-center bg-image" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "50%", height: "200px" }}>
            <div className="mask" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', height: "100px" }}>
                <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="text-white">
                        <h1 className="mb-3">Masroor Academy Victoria</h1>
                        <h4 className="mb-3">Students Portal</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Export the Navigation Function
export default Header;