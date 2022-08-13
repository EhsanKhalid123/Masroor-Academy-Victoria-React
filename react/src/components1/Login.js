
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

// Importing React classes and functions from node modules
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { verifyUser } from "../data/repository";

// Functional Component for Login Page
function Login(props) {
    // Declaration of useState Variables and Hook
    const history = useHistory();
    const [fields, setFields] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState(null);

    // Generic change handler.
    const handleInputChange = (event) => {
        setFields({ ...fields, [event.target.name]: event.target.value });
    };

    // Handler runs when login button is clicked
    const handleSubmit = async (event) => {
        event.preventDefault();

        //  Get user details from DB
        const user = await verifyUser(fields.email, fields.password);

        //  If user email does not exit
        if (user === null) {
            // Login failed, reset password field to blank and set error message.
            setFields({ ...fields, password: "" });
            setErrorMessage("Email and / or password invalid, please try again.");
            return;
        }

        // Set user state.
        props.loginUser(user);

        // Navigate to the home page.
        history.push("/");
    }

    // Returns HTML elements and content to display on the pages
    return (

        // Code adapted from Official Bootstrap Documents:
        // https://getbootstrap.com/docs/4.0/components/forms/

        // Login Form Code
        <div>
            <h1 className="text-center mb-3" style={{ padding: "50px 20px 0 20px" }}>Sign In</h1>
            <hr style={{ width: "50%", marginBottom: "20px", borderWidth: "1px", backgroundColor: "#5dc7d8" }} />
            <p>&nbsp;</p>
            <form className="login-form" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" className="form-control" id="email" name="email" placeholder="Please enter your email" value={fields.email} onChange={handleInputChange} />
                </div>
                {/* Password Field */}
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" className="form-control" id="password" name="password" placeholder="Please enter your Password" value={fields.password} onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>

                {/* Error Message */}
                {errorMessage !== null &&
                    <div className="form-group" style={{ textAlign: "center", margin: "50px 10px 10px 10px" }} onChange={handleInputChange}>
                        <span className="text-danger" style={{ textAlign: "center", fontSize: "20px" }}>{errorMessage}</span>
                    </div>
                }
            </form>
        </div>
    );
}

// Export the Login Function
export default Login;