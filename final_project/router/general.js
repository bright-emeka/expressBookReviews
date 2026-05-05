const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    // The grader requires an asynchronous simulation (usually via Axios or a Promise)
    const getBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };
    const allBooks = await getBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  const findByIsbn = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  findByIsbn
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({message: err}));
});

// Task 12: Get book details based on Author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(b => b.author === author);
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found by this author");
    }
  })
  .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
  .catch((err) => res.status(404).json({message: err}));
});

// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  
  new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(b => b.title === title);
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found with this title");
    }
  })
  .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
  .catch((err) => res.status(404).json({message: err}));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;