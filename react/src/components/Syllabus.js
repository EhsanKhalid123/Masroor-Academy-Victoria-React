// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import parse from 'html-react-parser';
import { createSyllabus, getGroups, getSyllabus, updateSyllabus, getSyllabusById } from "../data/repository";

function Syllabus(props) {

    const [groups, setGroupsData] = useState([]);
    const [syllabusMap, setSyllabusMap] = useState({});

    useEffect(() => {

        // Loads User Details from DB
        async function loadGroupDetails() {
            const currentGroups = await getGroups();
            const studentGroups = currentGroups.filter(groups =>
                groups.group !== 'Male Teacher' &&
                groups.group !== 'Female Teacher' &&
                groups.group !== 'Admin' &&
                groups.group !== 'Principal'
            );
            setGroupsData(studentGroups)
        }

        // Loads Syllabus Details from DB
        async function loadSyllabusDetails() {
            const currentSyllabus = await getSyllabus();
            const syllabusData = {};
            currentSyllabus.forEach((syllabus) => {
                syllabusData[syllabus.groupId] = syllabus.syllabusContent;
            });
            setSyllabusMap(syllabusData);
        }

        // Calls the functions above
        loadGroupDetails();
        loadSyllabusDetails();

    }, []);

    const editorConfig = {
        simpleUpload: {
            uploadUrl: 'http://localhost:4000/MAApi/image/upload',
            headers: {
                'X-CSRF-TOKEN': 'your-csrf-token'
            }
        },
        mediaEmbed: {
            previewsInData: true
        }
    }

    const saveSyllabusContent = async (groupId, content) => {
        // Check if syllabus content already exists for the group in the database
        const existingSyllabus = await getSyllabusById(groupId);

        if (existingSyllabus) {
            // If syllabus content exists, update it in the database
            await updateSyllabus(groupId, content);
        } else {
            // If syllabus content doesn't exist, create it in the database
            await createSyllabus(groupId, content);
        }
    };

    const handleInputChange = (event, editor, groupId) => {
        const data = editor.getData();
        setSyllabusMap((prevSyllabusMap) => ({
            ...prevSyllabusMap,
            [groupId]: data,
        }));

        // Save the syllabus content to the database
        saveSyllabusContent(groupId, data);
    };


    return (
        <div>
            <p>&nbsp;</p>

            {((props.user.group === "Admin") || (props.user.group === "Principal" && props.user.gender === "Male")) &&
                <>
                    <h3 className="text-center">Add Syllabus:</h3>
                    <br/>
                    {groups.map((group) => (
                        <div key={group.id}>
                            <h4 className="text-center">{group.group}:</h4>
                            <div className="richTextEditor">
                                <h3>{group.name}</h3>
                                <CKEditor
                                    editor={Editor}
                                    data={syllabusMap[group.id] || ""}
                                    onChange={(event, editor) => handleInputChange(event, editor, group.id)}
                                    config={editorConfig}
                                />
                            </div>
                        </div>
                    ))}

                    <p>&nbsp;</p>
                </>
            }

            <div className="col-lg-6 mb-4" style={{ display: "block", margin: "auto" }}>
                <div className="text-center">

                    <div className="card">
                        <h5 className="card-header card text-white bg-custom">Syllabus:</h5>
                        {(props.user.group !== "Male Teacher" && props.user.group !== "Female Teacher" && props.user.group !== "Admin" && props.user.group !== "Principal") &&
                            <h5 className="card-header card" style={{ color: "#112c3f" }}>{props.user.group}</h5>
                        }
                        <div className="card-body">

                            {groups.map((group) => (
                                <div key={group.id}>
                                    {props.user.group === group.group && (
                                        <pre className="" style={{ whiteSpace: 'pre-wrap', marginBottom: 0, fontSize: "16px", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif' }}>
                                            {typeof syllabusMap[group.id] === 'string' ? parse(syllabusMap[group.id]) : ""}
                                        </pre>
                                    )}
                                </div>
                            ))}

                            {(props.user.group === "Male Teacher" || props.user.group === "Female Teacher" || props.user.group === "Admin" || props.user.group === "Principal") &&
                                groups.map((group) => (
                                    <div key={group.id}>

                                        <pre className="" style={{ whiteSpace: 'pre-wrap', marginBottom: 0, fontSize: "16px", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif' }}>
                                            <h5 style={{ color: "blueviolet" }}>{group.group}:</h5>
                                            {typeof syllabusMap[group.id] === 'string' ? parse(syllabusMap[group.id]) : ""}
                                            <hr style={{ border: '1px dashed' }}></hr>
                                        </pre>

                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
            <p>&nbsp;</p>
        </div>


    );
}

// Export the Syllabus Function
export default Syllabus;



