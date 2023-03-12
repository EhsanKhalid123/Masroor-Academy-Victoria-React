// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import ReactSwitch from 'react-switch';
import { getFormStatus, updateFormStatus, updateFormText } from "../data/repository";
import StudentDashboard from "./StudentDashboard";

function Dashboard(props) {

    const [formStatus, setFormStatus] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [checked, setChecked] = useState(true);

    // Load Form Status from DB
    useEffect(() => {


        // Loads Form Status from DB
        async function loadFormStatus() {
            const currentFormStatus = await getFormStatus();

            setFormStatus(currentFormStatus);
            setChecked(currentFormStatus.status)

            setIsLoading(false);
        }

        // Calls the functions above
        loadFormStatus();
    }, []);

    const handleToggleChange = async (event) => {
        setChecked(event);
        const status = event ? true : false;
        const response = await updateFormStatus({status: status});
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
                <StudentDashboard user={props.user} />
                :

                <div style={{ textAlign: "center" }}>
                    {/* Below commented out code is to only render switch once it's value from database has been recieved */}
                    {/* {checked !== undefined && <ReactSwitch checked={checked} onChange={handleToggleChange} />} */}
                    
                    <ReactSwitch checked={checked} onChange={handleToggleChange} />
                    {/* {checked ?
                        <p>Accepting Responses</p>
                        :
                        <>
                            <div className="form-group">
                                <h3 className="text-center" style={{ margin: "0 25% 10px 25%", width: "50%", textAlign: "left" }}>Message for respondents:</h3>
                                <textarea style={{ margin: "auto", width: "40%", height: "50px", border: "solid 2px #2d6d99" }} className="form-control" id="text" name="text" value={formStatusText} />
                            </div>
                            <p>&nbsp;</p>
                        </>
                    } */}

                </div>

            }
        </div>
    );
}

// Export the Dashboard Function
export default Dashboard;
