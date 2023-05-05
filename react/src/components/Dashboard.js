// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import ReactSwitch from 'react-switch';
import { getFormStatus, updateFormStatus, updateFormText } from "../data/repository";

function Dashboard(props) {

    const [checked, setChecked] = useState(true);
    const [formText, setFormText] = useState("");

    // Load Form Status from DB
    useEffect(() => {


        // Loads Form Status from DB
        async function loadFormStatus() {
            const currentFormStatus = await getFormStatus();

            setChecked(currentFormStatus.status);
            setFormText(currentFormStatus.text);
        }

        // Calls the functions above
        loadFormStatus();
    }, []);

    const handleToggleChange = async (event) => {
        setChecked(event);
        const status = event ? true : false;
        await updateFormStatus({ status: status });
    }

    const handleTextChange = async (event) => {
        const text = event.target.value || "This form is no longer accepting responses";
        setFormText(text);
        await updateFormText({ text: text });

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
                <>
                    {props.user.group === "Admin" &&
                        <div style={{ textAlign: "center" }}>

                            <h4>Registration Form Status Setting:</h4>
                            <ReactSwitch checked={checked} onChange={handleToggleChange} />
                            {checked ?
                                <p>Accepting Responses</p>
                                :
                                <>
                                    <p>Not Accepting Responses</p>
                                    <div className="form-group">
                                        <h4 className="text-center" style={{ margin: "0 25% 10px 25%", width: "50%", textAlign: "left" }}>Message for respondents:</h4>
                                        <textarea style={{ margin: "auto", width: "40%", height: "50px", border: "solid 2px #2d6d99" }} className="form-control" id="text" name="text" value={formText === "This form is no longer accepting responses" ? "" : formText} placeholder="This form is no longer accepting responses" onChange={handleTextChange} />
                                    </div>
                                    <p>&nbsp;</p>
                                </>

                            }
                        </div>
                    }
                </>
        </div>
    );
}

// Export the Dashboard Function
export default Dashboard;
