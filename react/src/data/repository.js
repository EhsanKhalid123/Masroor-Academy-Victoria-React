
// Importing Libraries
import axios from "axios";
import jwtDecode from 'jwt-decode'

// --- Constants ----------------------------------------------------------------------------------
const API_HOST = "http://localhost:4000";
// const API_HOST = "https://masroor-academy-vic.herokuapp.com";
const USER_KEY = "user";
const SELECT_KEY = "SelectedID";
const SELECT_KEY2 = "SelectedID2";

function getHeaders() {
  return {
    headers: {
      accessToken: sessionStorage.getItem(USER_KEY),
    },
  };
}

// --- User ---------------------------------------------------------------------------------------
// Verify User Request For API from DB
async function verifyUser(id, password) {
  const response = await axios.post(API_HOST + "/MAApi/users/Sign-in", { id, password });
  const token = response.data;

  // Decode the access token to retrieve the user object.
  if (token !== null) {
    const user = jwtDecode(token);


    // NOTE: In this example the login is also persistent as it is stored in local storage.
    if (user !== null && user.archived !== true) {
      setUser(token);
    }
  }
  return token;
}

// Get User Details Request For API from DB
async function getProfile(id) {
  const response = await axios.get(API_HOST + `/MAApi/users/get/${id}`, getHeaders());

  return response.data;
}

// Get User Details Request For API from DB
async function getProfileRegister(id) {
  const response = await axios.get(API_HOST + `/MAApi/users/getRegister/${id}`, getHeaders());

  return response.data;
}

// Get User Details Request For API from DB
async function getProfileUsers() {
  const response = await axios.get(API_HOST + `/MAApi/users`, getHeaders());

  return response.data;
}

// Get User Details Request For API from DB
async function checkUserExists(name, fathersName) {
  const response = await axios.post(API_HOST + `/MAApi/users/check`, { name, fathersName }, getHeaders());

  return response.data;
}

// Create User Request For API to DB
async function createUser(user) {
  const response = await axios.post(API_HOST + "/MAApi/users", user, getHeaders());

  return response.data;
}

// Update User Details Request For API to DB
async function updateUser(user, id, loggedInUser) {
  const response = await axios.post(API_HOST + `/MAApi/users/update/${id}`, user, getHeaders());

  const updatedUser = response.data;

  if (loggedInUser === id)
    setUser(updatedUser);

  return updatedUser;

}

// Delete User Request For API from DB
async function deleteUserDB(user) {
  const response = await axios.post(API_HOST + "/MAApi/users/delete", user, getHeaders());

  return response.data;
}

// --- Homeworks ---------------------------------------------------------------------------------------
// Get Homeworks Details Request For API from DB
async function getHomeworks() {
  const response = await axios.get(API_HOST + "/MAApi/homeworks", getHeaders());

  return response.data;
}

// Create Homework Request For API from DB
async function createHomeworks(homework) {
  const response = await axios.post(API_HOST + "/MAApi/homeworks/create", homework, getHeaders());

  return response.data;
}

// Delete Homework Request For API from DB
async function deleteHomeworks(homeworkID) {
  const response = await axios.post(API_HOST + "/MAApi/homeworks/delete", homeworkID, getHeaders());

  return response.data;
}

// Delete All Homework associated with User Request For API from DB
async function deleteHomeworks2(id) {
  const response = await axios.post(API_HOST + "/MAApi/homeworks/delete2", id, getHeaders());

  return response.data;
}

// --- Announcements ---------------------------------------------------------------------------------------
// Create Announcements Request For API from DB
async function createAnnouncements(announcement) {
  const response = await axios.post(API_HOST + "/MAApi/announcements/create", announcement, getHeaders());

  return response.data;
}

// Get Announcements Request For API from DB
async function getAnnouncements() {
  const response = await axios.get(API_HOST + "/MAApi/announcements", getHeaders());

  return response.data;
}

// Delete Announcements Request For API from DB
async function deleteAnnouncements(announcement) {
  const response = await axios.post(API_HOST + "/MAApi/announcements/delete", announcement, getHeaders());

  return response.data;
}

// --- Form Status ---------------------------------------------------------------------------------------

// Get Form Status Request For API from DB
async function getFormStatus() {
  const response = await axios.get(API_HOST + "/MAApi/formStatus", getHeaders());

  return response.data;
}

// Update Form Status Request For API from DB
async function updateFormStatus(formStatus) {
  const response = await axios.post(API_HOST + "/MAApi/formStatus/updateFormStatus", formStatus, getHeaders());

  return response.data;
}

// Update Form Text Request For API from DB
async function updateFormText(formText) {
  const response = await axios.post(API_HOST + "/MAApi/formStatus/updateFormText", formText, getHeaders());

  return response.data;
}

// Update Registration Message Request For API from DB
async function updateRegFormMessage(formText) {
  const response = await axios.post(API_HOST + "/MAApi/formStatus/updateRegFormMessage", formText, getHeaders());

  return response.data;
}

// Get Registration Message Request For API from DB
async function getRegFormMessage() {
  const response = await axios.get(API_HOST + "/MAApi/formStatus/getRegFormMessage", getHeaders());

  return response.data;
}


// ---------- Resources --------------------------------------------
// Sets Current User In Local Storage
async function uploadResource(formData) {
  const response = await axios.post(API_HOST + "/MAApi/resources/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      accessToken: sessionStorage.getItem("user"),
    },
  });

  return response.data;
}

async function fetchResources() {
  const response = await axios.get(API_HOST + "/MAApi/resources", getHeaders());
  return response.data;
}

async function fetchResourcesByID(resourcesID) {
  const response = API_HOST + `/MAApi/resources/${resourcesID}`;
  return response;
}

// Delete resources Request For API from DB
async function deleteResources(resource) {
  const response = await axios.post(API_HOST + "/MAApi/resources/delete", resource, getHeaders());

  return response.data;
}

// ---------- Images --------------------------------------------

async function fetchImages() {
  const response = await axios.get(API_HOST + "/image", getHeaders());
  return response.data;
}

// ---------- Groups and Classes --------------------------------------------

async function createGroup(group) {
  const response = await axios.post(API_HOST + "/MAApi/groups", group, getHeaders());
  
  return response.data;
}

async function getGroups() {
  const response = await axios.get(API_HOST + "/MAApi/groups", getHeaders());
  return response.data;
}

// Get User Details Request For API from DB
async function getGroupById(id) {
  const response = await axios.get(API_HOST + `/MAApi/groups/get/${id}`, getHeaders());

  return response.data;
}

// Update Group Details Request For API to DB
async function editGroup(group, id,) {
  const response = await axios.post(API_HOST + `/MAApi/groups/update/${id}`, group, getHeaders());

  return response.data;

}

// Delete User Request For API from DB
async function deleteGroup(group) {
  const response = await axios.post(API_HOST + "/MAApi/groups/delete", group, getHeaders());

  return response.data;
}

async function createClass(classes) {
  const response = await axios.post(API_HOST + "/MAApi/classes", classes, getHeaders());
  
  return response.data;
}

async function getClasses() {
  const response = await axios.get(API_HOST + "/MAApi/classes", getHeaders());
  return response.data;
}

async function getClassById(id) {
  const response = await axios.get(API_HOST + `/MAApi/classes/get/${id}`, getHeaders());

  return response.data;
}

// Update Classes Details Request For API to DB
async function editClass(classes, id,) {
  const response = await axios.post(API_HOST + `/MAApi/classes/update/${id}`, classes, getHeaders());

  return response.data;

}

// Delete Classes Request For API from DB
async function deleteClass(classes) {
  const response = await axios.post(API_HOST + "/MAApi/classes/delete", classes, getHeaders());

  return response.data;
}

// ---------- Syllabus --------------------------------------------

async function createSyllabus(groupId, syllabus) {
  const response = await axios.post(API_HOST + "/MAApi/syllabus", {groupId, syllabus}, getHeaders());
  
  return response.data;
}

async function getSyllabus() {
  const response = await axios.get(API_HOST + "/MAApi/syllabus", getHeaders());
  return response.data;
}

async function getSyllabusById(id) {
  const response = await axios.get(API_HOST + `/MAApi/syllabus/get/${id}`, getHeaders());

  return response.data;
}

// Delete User Request For API from DB
async function deleteSyllabus(syllabus) {
  const response = await axios.post(API_HOST + "/MAApi/syllabus/delete", syllabus, getHeaders());

  return response.data;
}

// Update Registration Message Request For API from DB
async function updateSyllabus(groupId, syllabus) {
  const response = await axios.post(API_HOST + "/MAApi/syllabus/update", {groupId, syllabus}, getHeaders());

  return response.data;
}

// --- Helper functions to interact with local storage --------------------------------------------
// Sets Current User In Local Storage
function setUser(user) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Get User Details from Local Storage
function getUser() {
  return JSON.parse(sessionStorage.getItem(USER_KEY));
}

// Removes user from Local Storage
function removeUser() {
  sessionStorage.removeItem(USER_KEY);
}

function selectedId(id) {
  localStorage.setItem(SELECT_KEY, JSON.stringify(id));
}

function selectedId2(name) {
  localStorage.setItem(SELECT_KEY2, JSON.stringify(name));
}

function loggedInUser(name) {
  localStorage.setItem("LoggedIn", JSON.stringify(name));
}

function getloggedInUser() {
  return JSON.parse(localStorage.getItem("LoggedIn"));
}

// Removes user from Local Storage
function removeLoggedInUser() {
  localStorage.removeItem("LoggedIn");
}

function getSelectedId() {
  return JSON.parse(localStorage.getItem(SELECT_KEY));
}

function getSelectedId2() {
  return JSON.parse(localStorage.getItem(SELECT_KEY2));
}

function removeSelectedId() {
  localStorage.removeItem(SELECT_KEY);
}

function removeSelectedId2() {
  localStorage.removeItem(SELECT_KEY2);
}


// Exports all these functions to be used by other componenets
export {
  verifyUser, createUser, checkUserExists,
  getHomeworks, createHomeworks, deleteHomeworks,
  getUser, removeUser, deleteUserDB,
  getProfile, updateUser, setUser, deleteHomeworks2,
  createAnnouncements, getAnnouncements, getProfileRegister,
  getProfileUsers, deleteAnnouncements, selectedId, getSelectedId,
  getloggedInUser, loggedInUser, removeLoggedInUser, removeSelectedId,
  getSelectedId2, removeSelectedId2, selectedId2, updateFormStatus, getFormStatus, updateFormText,
  uploadResource, fetchResources, deleteResources, fetchResourcesByID, fetchImages,
  updateRegFormMessage, getRegFormMessage, createClass, createGroup, getClasses, getGroups,
  getGroupById, getClassById, deleteGroup, deleteClass, createSyllabus, getSyllabus,
  getSyllabusById, deleteSyllabus, updateSyllabus, editGroup, editClass
}
