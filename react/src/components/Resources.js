// Importing React classes and functions from node modules
import React, { useState, useEffect, useRef } from "react";
import { fetchResources, uploadResource, deleteResources, fetchResourcesByID } from "../data/repository";
import Toolbar from "./Toolbar";


function Resources(props) {

    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef(null);
    const [selectedResources, setSelectedResources] = useState([]);

    useEffect(() => {
        // Loads resources from DB
        async function loadResources() {
            const currentResources = await fetchResources();

            setResources(currentResources);
            setIsLoading(false);
        }

        // Calls the functions above
        loadResources();

        if (successMessage === null)
            return;

        // Time limit for message to display
        const id = setTimeout(() => setSuccessMessage(null), 4000);

        // When message changes clear the queued timeout function.
        return () => clearTimeout(id);

    }, [successMessage]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setErrorMessage();
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", file);
        if (fileInputRef.current.files.length === 0) {
            setErrorMessage("No File Provided!");
            return;
        }
        try {
            const response = await uploadResource(formData);
            setFile(null); // clear the file input field
            fileInputRef.current.value = ""; // clear the file input field
            setSuccessMessage(response.filename + " has been uploaded successfully");
        } catch (error) {
            setErrorMessage(error.response.data.error);
            setFile(null);
            fileInputRef.current.value = "";
        }
    };

    const handleDownload = async (resourceID) => {
        const resourceUrl = await fetchResourcesByID(resourceID);

        // Downloads the file instantly
        const filename = resourceUrl.split("/").pop();
        const aTag = document.createElement("a");
        aTag.href = resourceUrl;
        aTag.setAttribute("download", filename);
        document.body.appendChild(aTag);
        aTag.click();
        aTag.remove();
    };

    const deleteResource = async (resource) => {

        await deleteResources(resource);

        // Update Page/Refresh the Data
        const currentResources = await fetchResources();
        setResources(currentResources);
    }

    const handleBulkUpdate = async () => {
        const currentResources = await fetchResources();
        setResources(currentResources);
        setSelectedResources([]);
    };

    const handleSelectResource = (id) => {
        if (selectedResources.includes(id)) {
            setSelectedResources(selectedResources.filter((selectedResource) => selectedResource !== id));
        } else {
            setSelectedResources([...selectedResources, id]);
        }
    };

    return (
        <div>
            <br />
            <h3 className="text-center">Resources:</h3>

            {(props.user.group === "Male Teacher" || props.user.group === "Female Teacher" || props.user.group === "Admin" || props.user.group === "Principal") &&
                <>
                    <br />
                    <div className="text-center">
                        <input type="file" name="file" ref={fileInputRef} onChange={handleFileChange} />
                        <button className="btn btn-info" style={{ marginLeft: "5px" }} onClick={handleUpload}>Upload</button>
                    </div>
                    <br />
                </>
            }

            {selectedResources.length > 0 && <Toolbar selectedResources={selectedResources} onUpdate={handleBulkUpdate} props={props} />}
            <br />

            {/* Error Message */}
            {errorMessage !== null &&
                <div className="form-group" style={{ marginTop: "25px", textAlign: "center" }} onChange={handleFileChange}>
                    <span className="text-danger" style={{ textAlign: "center", fontSize: "20px", wordWrap: "break-word" }}>{errorMessage}</span>
                </div>
            }

            {successMessage && <div className="alert alert-success text-center" style={{ margin: "20px" }} role="alert">{successMessage}</div>}

            {isLoading ?
                <div className="card-body text-center">
                    <span className="text-muted">Loading Resources...</span>
                </div>
                :
                <>
                    {resources.length === 0 ?
                        <div className="text-center">
                            <p>&nbsp;</p>
                            <span className="text-muted">No resources are available for download!</span>
                            <p>&nbsp;</p>
                        </div>
                        :
                        <div className="table-responsive">
                            <table className="table table-striped mx-auto text-center">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th style={{ color: "#112c3f" }} scope="col">Name:</th>
                                        <th>Download:</th>
                                        <th></th>
                                        <th></th>

                                    </tr>
                                </thead>
                                {resources.map((resource) => (
                                    <tbody key={resource.id}>
                                        <tr>
                                            <td><input type="checkbox" className="checkbox" checked={selectedResources.includes(resource.id)} onChange={() => handleSelectResource(resource.id)} /></td>
                                            <td>{resource.filename}</td>
                                            <td><button className="btn btn-custom" onClick={() => handleDownload(resource.id)}>Download</button></td>
                                            <td>
                                                {props.user.id === "Admin" &&
                                                    <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await deleteResource(resource) }} >Delete</button>
                                                }
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>
                        </div>
                    }
                </>
            }
        </div>
    );
}

// Export the Dashboard Function
export default Resources;
