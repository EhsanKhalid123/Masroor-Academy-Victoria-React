
// Importing React classes and functions from node modules
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyUser } from "../data/repository";

// Functional Component for Login Page
function Login(props) {
    // Declaration of useState Variables and Hook
    const history = useNavigate();
    const [fields, setFields] = useState({ id: "", password: "" });
    const [errorMessage, setErrorMessage] = useState(null);

    // Generic change handler.
    const handleInputChange = (event) => {
        setFields({ ...fields, [event.target.id]: event.target.value });
    };

    // Handler runs when login button is clicked
    const handleSubmit = async (event) => {
        event.preventDefault();

        //  Get user details from DB
        const user = await verifyUser(fields.id, fields.password);

        //  If user email does not exit
        if (user === null) {
            // Login failed, reset password field to blank and set error message.
            setFields({ ...fields, password: "" });
            setErrorMessage("ID and / or password invalid, please try again.");
            return;
        }

        // Set user state.
        props.loginUser(user);

        // Navigate to the home page.
        history("/Dashboard");
    }

    // Returns HTML elements and content to display on the pages
    return (

        // Code adapted from Official Bootstrap Documents:
        // https://getbootstrap.com/docs/4.0/components/forms/

        // Login Form Code
        <div>
            <h1 className="text-center mb-3" style={{ padding: "50px 20px 0 20px", color: "#112c3f" }}>Sign In</h1>
            <hr style={{ width: "50%", marginBottom: "20px", borderWidth: "1px", backgroundColor: "#aa0001" }} />
            <p>&nbsp;</p>
            <form className="login-form" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="form-group">
                    <label htmlFor="id">ID:</label>
                    <input type="text" className="form-control" id="id" name="id" placeholder="Please enter your ID" value={fields.id} onChange={handleInputChange} />
                </div>
                {/* Password Field */}
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" className="form-control" id="password" name="password" placeholder="Please enter your Password" value={fields.password} onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn btn-custom">Submit</button>

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