const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check if username is not already taken
  return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Check if username and password match
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send(JSON.stringify({message: "Username and password are required"}, null, 4));
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).send(JSON.stringify({message: "Invalid credentials"}, null, 4));
  }
  const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });
  req.session.authorization = { accessToken: token, username };
  return res.status(200).send(JSON.stringify({message: "Login successful"}, null, 4));
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username;
  if (!books[isbn]) {
    return res.status(404).send(JSON.stringify({message: "Book not found"}, null, 4));
  }
  if (!review) {
    return res.status(400).send(JSON.stringify({message: "Review is required"}, null, 4));
  }
  books[isbn].reviews[username] = review;
  return res.status(200).send(JSON.stringify({message: "Review added/modified successfully"}, null, 4));
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;
  if (!books[isbn]) {
    return res.status(404).send(JSON.stringify({message: "Book not found"}, null, 4));
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).send(JSON.stringify({message: "Review not found"}, null, 4));
  }
  delete books[isbn].reviews[username];
  return res.status(200).send(JSON.stringify({message: "Review deleted successfully"}, null, 4));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
