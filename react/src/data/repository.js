
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

// Importing Libraries
import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
const API_HOST = "http://localhost:4000";
const USER_KEY = "user";
const SELECT_KEY = "SelectedID";
const SELECT_KEY2 = "SelectedID2";

// --- User ---------------------------------------------------------------------------------------
// Verify User Request For API from DB
async function verifyUser(id, password) {
  const response = await axios.get(API_HOST + "/VCApi/users/Sign-in", { params: { id, password } });
  const user = response.data;

  // NOTE: In this example the login is also persistent as it is stored in local storage.
  if (user !== null)
    setUser(user);

  return user;
}

// Get User Details Request For API from DB
async function getProfile(name) {
  const response = await axios.get(API_HOST + `/VCApi/users/get/${name}`);

  return response.data;
}

// Get User Details Request For API from DB
async function getProfileUsers() {
  const response = await axios.get(API_HOST + `/VCApi/users`);

  return response.data;
}

// Find User Details Request For API from DB
async function findUser(email) {
  const response = await axios.get(API_HOST + `/VCApi/users/select/${email}`);

  return response.data;
}

// Create User Request For API to DB
async function createUser(user) {
  const response = await axios.post(API_HOST + "/VCApi/users", user);

  return response.data;
}

// Update User Details Request For API to DB
async function updateUser(user, email) {
  const response = await axios.post(API_HOST + `/VCApi/users/update/${email}`, user);

  const updatedUser = response.data;

  setUser(updatedUser);

  return updatedUser;

}

// Delete User Request For API from DB
async function deleteUserDB(user) {
  const response = await axios.post(API_HOST + "/VCApi/users/delete", user);

  return response.data;
}

// --- Post ---------------------------------------------------------------------------------------
// Get Post Details Request For API from DB
async function getPosts() {
  const response = await axios.get(API_HOST + "/VCApi/posts");

  return response.data;
}

// Create post Request For API from DB
async function createPost(homework) {
  const response = await axios.post(API_HOST + "/VCApi/posts/create", homework);

  return response.data;
}

// Delete Post Request For API from DB
async function deletePost(postID) {
  const response = await axios.post(API_HOST + "/VCApi/posts/delete", postID);

  return response.data;
}

// Delete All posts associated with User Request For API from DB
async function deletePost2(email) {
  const response = await axios.post(API_HOST + "/VCApi/posts/delete2", email);

  return response.data;
}

// --- Reply Post ---------------------------------------------------------------------------------------
// Create Reply Post Request For API from DB
async function createReplyPost(post) {
  const response = await axios.post(API_HOST + "/VCApi/replyPosts/create", post);

  return response.data;
}

// Get Replied Posts Request For API from DB
async function getReplyPosts() {
  const response = await axios.get(API_HOST + "/VCApi/replyPosts");

  return response.data;
}

// Delete Replied Post Request For API from DB
async function deleteReplyPost(post) {
  const response = await axios.post(API_HOST + "/VCApi/replyPosts/delete", post);

  return response.data;
}

// Delete all posts associated with original post Request For API from DB
async function deleteReplyPost2(forumPosts_id) {
  const response = await axios.post(API_HOST + "/VCApi/replyPosts/delete2", forumPosts_id);

  return response.data;
}

// Delete all posts associated with original post and the user Request For API from DB
async function deleteReplyPost3(post) {
  const response = await axios.post(API_HOST + "/VCApi/replyPosts/delete3", post);

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
  getPosts, createPost, deletePost,
  getUser, removeUser, deleteUserDB,
  getProfile, updateUser, setUser, deletePost2,
  createReplyPost, getReplyPosts, deleteReplyPost2,
  getProfileUsers, deleteReplyPost, deleteReplyPost3, selectedId, getSelectedId,
  getloggedInUser, loggedInUser, removeLoggedInUser, removeSelectedId,
  getSelectedId2, removeSelectedId2, selectedId2
}
