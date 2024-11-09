const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ 
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;  // Get username and password from the request body

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Validate if the username and password match any user
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Create a JWT token after validating the credentials
  const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });  // You can change the expiration time

  // Save the token in the session (Optional, depending on your session strategy)
  req.session.authorization = { accessToken };

  // Return the token to the client
  return res.status(200).json({ message: "Login successful", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;  // Retrieve ISBN from request parameters
  const { review } = req.query;  // Get the review from the request query
  const { username } = req.session.authorization || {};  // Get the username from session

  // Check if the user is logged in (session contains a username)
 
  // Check if the review text is provided in the request query
  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  // Check if the book exists in the database
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or modify the review for the given ISBN
  if (!book.reviews[username]) {
    // Add new review if it does not exist for the user
    book.reviews[username] = review;
    return res.status(200).json({ message: `Review added for ISBN ${isbn}` });
  } else {
    // Modify the existing review
    book.reviews[username] = review;
    return res.status(200).json({ message: `Review updated for ISBN ${isbn}` });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;  // Retrieve ISBN from request parameters
  const { username } = req.session.authorization || {};  // Get the username from session

  // Check if the book exists in the database
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has already posted a review for this book
  if (!book.reviews[username]) {
    return res.status(404).json({ message: `No review found for ISBN ${isbn} ` });
  }

  // Delete the review
  delete book.reviews[username];

  // Return a simple success message
  return res.status(200).json({
    message: `Review for ISBN ${isbn} has been deleted.`
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
