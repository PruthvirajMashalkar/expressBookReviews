const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;  // Get username and password from the request body

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the username already exists
  if (isValid(username)) {
    return res.status(400).json({ message: `Username "${username}" already exists. Please choose a different one.` });
  }

  // Register the new user
  users.push({ username, password });

  // Return success message
  return res.status(200).json({ message: "User successfully registered." });
});

public_users.get('/', async (req, res) => {
  try {
    // Simulate an external request to fetch books, for demo purposes we use local data
    const response = await axios.get('http://localhost:5000/');  // Adjust the URL to your backend endpoint
    // Send the fetched list of books in the response
    return res.status(200).json({
      message: "List of books fetched successfully",
      books: response.data
    });
  } catch (error) {
    console.error("Error fetching book list:", error);
    return res.status(500).json({ message: "Error fetching book list from server" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;  // Retrieve ISBN from request parameters
  
  try {
    // Fetch book details based on ISBN using Axios (local books data or an API call)
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);  // Adjust URL
    // Send the details of the requested book in the response
    return res.status(200).json({
      message: `Details for ISBN ${isbn} fetched successfully`,
      book: response.data
    });
  } catch (error) {
    console.error("Error fetching book details by ISBN:", error);
    return res.status(500).json({ message: "Error fetching book details by ISBN" });
  }
});

public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params;  // Retrieve author name from request parameters
  
  try {
    // Fetch books by the given author using Axios (you can simulate with local data)
    const response = await axios.get(`http://localhost:5000/author/${author}`);  // Adjust URL
    // Send the filtered list of books by the author in the response
    return res.status(200).json({
      message: `Books by ${author} fetched successfully`,
      books: response.data
    });
  } catch (error) {
    console.error("Error fetching books by author:", error);
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const { title } = req.params;  // Retrieve book title from request parameters
  
  try {
    // Fetch books based on the given title using Axios (you can simulate with local data)
    const response = await axios.get(`http://localhost:5000/title/${title}`);  // Adjust URL
    // Send the filtered list of books by the title in the response
    return res.status(200).json({
      message: `Books titled ${title} fetched successfully`,
      books: response.data
    });
  } catch (error) {
    console.error("Error fetching books by title:", error);
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});

module.exports.general = public_users;
