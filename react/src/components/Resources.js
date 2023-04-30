// Importing React classes and functions from node modules
import React, { useState, useEffect, useRef } from "react";
import { fetchResources, uploadResource, deleteResources, fetchResourcesByID } from "../data/repository";


function Resources(props) {

    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [resources, setResources] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Loads resources from DB
        async function loadResources() {
            const currentResources = await fetchResources();

            setResources(currentResources);
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
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await uploadResource(formData);
            if (response.error) {
                setErrorMessage(response.error);
            } else {
                setFile(null); // clear the file input field
                fileInputRef.current.value = ""; // clear the file input field
                setSuccessMessage(response.filename + " has been uploaded successfully");
            }
        } catch (error) {
            setErrorMessage(error.message);
            // console.log(error.message);
        }
    };

    const handleDownload = async (resourceID) => {
        const resourceUrl = await fetchResourcesByID(resourceID);

        // window.open(resourceUrl, '_blank'); // Downloads file by opening a new blank window and then cloese once file downloaded

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

    return (
        <div>
            <br />
            {(props.user.group === "Male Teacher" || props.user.group === "Female Teacher" || props.user.name === "Admin") &&
                <div className="text-center">
                    <input type="file" name="file" ref={fileInputRef} onChange={handleFileChange} />
                    <button className="btn btn-info" style={{ marginLeft: "5px" }} onClick={handleUpload}>Upload</button>
                </div>
            }

            {/* Error Message */}
            {errorMessage !== null &&
                <div className="form-group" style={{marginTop: "25px", textAlign: "center" }} onChange={handleFileChange}>
                    <span className="text-danger" style={{ textAlign: "center", fontSize: "20px", wordWrap: "break-word" }}>{errorMessage}</span>
                </div>
            }

            {successMessage && <div className="alert alert-success text-center" style={{ margin: "20px" }} role="alert">{successMessage}</div>}

            <div className="table-responsive">
                <table className="table table-striped mx-auto text-center">
                    <thead>
                        <tr>
                            <th style={{ color: "#112c3f" }} scope="col">Name:</th>
                            <th>Download:</th>
                            <th></th>
                            <th></th>

                        </tr>
                    </thead>
                    {resources.map((resource) => (
                        <tbody key={resource.id}>
                            <tr>
                                <td>{resource.filename}</td>
                                <td><button className="btn btn-custom" onClick={() => handleDownload(resource.id)}>Download</button></td>
                                <td>
                                    {props.user.group === "Admin" &&
                                        <button type="submit" style={{ float: "right", textAlign: "right" }} className="btn btn-danger mr-sm-2" onClick={async () => { await deleteResource(resource) }} >Delete</button>
                                    }
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>

        </div>
    );
}

// Export the Dashboard Function
export default Resources;
