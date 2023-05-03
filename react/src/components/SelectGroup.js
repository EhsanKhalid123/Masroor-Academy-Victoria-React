// Importing React classes and functions from node modules
import React, { } from "react";
import { Link } from "react-router-dom";

function SelectGroup(props) {

    return (
        <>
            <p>&nbsp;</p>
            <h5 className="text-center" style={{ margin: "5px" }}> Please select the students group level for which you would like to add homework for.</h5>
            <p>&nbsp;</p>
            <div style={{ display: "flex", justifyContent: "center" }}>

                <div className="container">
                    <div className="row" style={{justifyContent: "center"}}>
                        <div style={{ margin: "5px" }}>
                            <Link to="/Group/4" className="selectGroupLinks" style={{ textDecoration: "none" }}>
                                <div className="card">
                                    <div className="card-body" style={{ padding: "15px" }}>
                                        <h5 className="text-center" style={{ marginBottom: "0px" }}>14-15 (Group 4)</h5>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div style={{ margin: "5px" }}>
                            <Link to="/Group/3" className="selectGroupLinks" style={{ textDecoration: "none" }}>
                                <div className="card">
                                    <div className="card-body" style={{ padding: "15px" }}>
                                        <h5 className="text-center" style={{ marginBottom: "0px" }}>12-13 (Group 3)</h5>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div style={{ margin: "5px" }}>
                            <Link to="/Group/2" className="selectGroupLinks" style={{ textDecoration: "none" }}>
                                <div className="card">
                                    <div className="card-body" style={{ padding: "15px" }}>
                                        <h5 className="text-center" style={{ marginBottom: "0px" }}>9-11 (Group 2)</h5>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div style={{ margin: "5px" }}>
                            <Link to="/Group/1" className="selectGroupLinks" style={{ textDecoration: "none" }}>
                                <div className="card">
                                    <div className="card-body" style={{ padding: "15px" }}>
                                        <h5 className="text-center" style={{ marginBottom: "0px" }}>7-8 (Group 1)</h5>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div style={{ margin: "5px" }}>
                            <Link to="/Group/5" className="selectGroupLinks" style={{ textDecoration: "none" }}>
                                <div className="card">
                                    <div className="card-body" style={{ padding: "15px" }}>
                                        <h5 className="text-center" style={{ marginBottom: "0px" }}>All Students</h5>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
            <p>&nbsp;</p>
        </>
    )
}

// Export the Student Function
export default SelectGroup;