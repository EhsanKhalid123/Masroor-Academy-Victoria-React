// Importing React classes and functions from node modules
import React, { useState, useEffect } from "react";
import ReactSwitch from 'react-switch';
import { getFormStatus, getRegFormMessage, updateFormStatus, updateFormText, updateRegFormMessage } from "../data/repository";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

function Settings(props) {

    const [checked, setChecked] = useState(true);
    const [formText, setFormText] = useState("");
    const [regText, setRegText] = useState({ text: "" });


    var IFRAME_SRC = '//cdn.iframe.ly/api/iframe';
    var API_KEY = 'ec1627000e306b7c55174b';

    // Load Form Status from DB
    useEffect(() => {


        // Loads Form Status from DB
        async function loadFormStatus() {
            const currentFormStatus = await getFormStatus();
            const currentRegText = await getRegFormMessage();

            setChecked(currentFormStatus.status);
            setFormText(currentFormStatus.text);
            setRegText(currentRegText);
        }

        // Calls the functions above
        loadFormStatus();
    }, []);

    const editorConfig = {
        placeholder: 'Please fill in the form below in order to enroll for Masroor Academy. By filling in this form you accept all the rules and guidelines.',
        simpleUpload: {
            uploadUrl: 'http://localhost:4000/MAApi/image/upload',
            headers: {
                'X-CSRF-TOKEN': 'your-csrf-token'
            }
        },
        mediaEmbed: {
            previewsInData: true,
            providers: [
                {
                    // hint: this is just for previews. Get actual HTML codes by making API calls from your CMS
                    name: 'iframely previews',

                    // Match all URLs or just the ones you need:
                    url: /.+/,

                    html: match => {
                        const url = match[0];

                        var iframeUrl = IFRAME_SRC + '?app=1&api_key=' + API_KEY + '&url=' + encodeURIComponent(url);
                        // alternatively, use &key= instead of &api_key with the MD5 hash of your api_key
                        // more about it: https://iframely.com/docs/allow-origins

                        return (
                            // If you need, set maxwidth and other styles for 'iframely-embed' class - it's yours to customize
                            '<div className="iframely-embed" style="width: 100%">' +
                            '<div className="iframely-responsive">' +
                            `<iframe src="${iframeUrl}" ` +
                            'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                            '</iframe>' +
                            '</div>' +
                            '</div>'
                        );
                    }
                }
            ]
        }
    }

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

    // Handler for when textbox value changes
    const handleInputChange = async (event, editor) => {
        if (editor) {
            const data = editor.getData() || "Please fill in the form below in order to enroll for Masroor Academy. By filling in this form you accept all the rules and guidelines.";
            setRegText({ text: data });
            await updateRegFormMessage({ text: data });
        }
    };

    return (
        <div>
            <h1 className="text-center" style={{ paddingTop: "50px", color: "#112c3f" }}>
                Masroor Academy Portal Settings
            </h1>
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

                        <br />
                        <h4>Registration Form Message:</h4>
                        <div className="richTextEditor">
                            <CKEditor editor={Editor} data={regText.text === "Please fill in the form below in order to enroll for Masroor Academy. By filling in this form you accept all the rules and guidelines." ? "" : regText.text} onChange={handleInputChange} config={editorConfig} />
                        </div>

                    </div>
                }
            </>
            <p>&nbsp;</p>
        </div>
    );
}

// Export the Settings Function
export default Settings;
