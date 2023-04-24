
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

// Importing Libraries
import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
const API_HOST = "http://localhost:4000";
// const API_HOST = "https://masroor-academy-vic.herokuapp.com";
const USER_KEY = "user";
const SELECT_KEY = "SelectedID";
const SELECT_KEY2 = "SelectedID2";

// --- User ---------------------------------------------------------------------------------------
// Verify User Request For API from DB
async function verifyUser(id, password) {
  const response = await axios.get(API_HOST + "/MAApi/users/Sign-in", { params: { id, password } });
  const user = response.data;

  // NOTE: In this example the login is also persistent as it is stored in local storage.
  if (user !== null && user.archived !== true)
    setUser(user);

  return user;
}

// Get User Details Request For API from DB
async function getProfile(id) {
  const response = await axios.get(API_HOST + `/MAApi/users/get/${id}`);

  return response.data;
}

// Get User Details Request For API from DB
async function getProfileUsers() {
  const response = await axios.get(API_HOST + `/MAApi/users`);

  return response.data;
}

// Find User Details Request For API from DB
async function findUser(email) {
  const response = await axios.get(API_HOST + `/MAApi/users/select/${email}`);

  return response.data;
}

// Create User Request For API to DB
async function createUser(user) {
  const response = await axios.post(API_HOST + "/MAApi/users", user);

  return response.data;
}

// Register User Request For API to DB
async function registerUser(registered) {
  const response = await axios.post(API_HOST + "/MAApi/registered", registered);

  return response.data;
}

// Update User Details Request For API to DB
async function updateUser(user, email) {
  const response = await axios.post(API_HOST + `/MAApi/users/update/${email}`, user);

  const updatedUser = response.data;

  setUser(updatedUser);

  return updatedUser;

}

// Delete User Request For API from DB
async function deleteUserDB(user) {
  const response = await axios.post(API_HOST + "/MAApi/users/delete", user);

  return response.data;
}

// --- Post ---------------------------------------------------------------------------------------
// Get Post Details Request For API from DB
async function getHomeworks() {
  const response = await axios.get(API_HOST + "/MAApi/homeworks");

  return response.data;
}

// Create Homework Request For API from DB
async function createHomeworks(homework) {
  const response = await axios.post(API_HOST + "/MAApi/homeworks/create", homework);

  return response.data;
}

// Delete Homework Request For API from DB
async function deleteHomeworks(homeworkID) {
  const response = await axios.post(API_HOST + "/MAApi/homeworks/delete", homeworkID);

  return response.data;
}

// Delete All Homework associated with User Request For API from DB
async function deleteHomeworks2(id) {
  const response = await axios.post(API_HOST + "/MAApi/homeworks/delete2", id);

  return response.data;
}

// --- Announcements ---------------------------------------------------------------------------------------
// Create Announcements Request For API from DB
async function createAnnouncements(announcement) {
  const response = await axios.post(API_HOST + "/MAApi/announcements/create", announcement);

  return response.data;
}

// Get Announcements Request For API from DB
async function getAnnouncements() {
  const response = await axios.get(API_HOST + "/MAApi/announcements");

  return response.data;
}

// Delete Announcements Request For API from DB
async function deleteAnnouncements(announcement) {
  const response = await axios.post(API_HOST + "/MAApi/announcements/delete", announcement);

  return response.data;
}

// --- Form Status ---------------------------------------------------------------------------------------

// Get Form Status Request For API from DB
async function getFormStatus() {
  const response = await axios.get(API_HOST + "/MAApi/formStatus");

  return response.data;
}

// Update Form Status Request For API from DB
async function updateFormStatus(formStatus) {
  const response = await axios.post(API_HOST + "/MAApi/formStatus/updateFormStatus", formStatus);

  return response.data;
}

// Update Form Text Request For API from DB
async function updateFormText(formText) {
  const response = await axios.post(API_HOST + "/MAApi/formStatus/updateFormText", formText);

  return response.data;
}

// --- Helper functions to interact with local storage --------------------------------------------
// Sets Current User In Local Storage
function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Get User Details from Local Storage
function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY));
}

// Removes user from Local Storage
function removeUser() {
  localStorage.removeItem(USER_KEY);
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
  verifyUser, findUser, createUser,
  getHomeworks, createHomeworks, deleteHomeworks,
  getUser, removeUser, deleteUserDB,
  getProfile, updateUser, setUser, deleteHomeworks2,
  createAnnouncements, getAnnouncements,
  getProfileUsers, deleteAnnouncements, selectedId, getSelectedId,
  getloggedInUser, loggedInUser, removeLoggedInUser, removeSelectedId,
  getSelectedId2, removeSelectedId2, selectedId2, registerUser, updateFormStatus, getFormStatus, updateFormText
}
