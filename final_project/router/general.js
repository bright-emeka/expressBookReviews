const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send(JSON.stringify({message: "Username and password are required"}, null, 4));
  }
  if (!isValid(username)) {
    return res.status(409).send(JSON.stringify({message: "Username already exists"}, null, 4));
  }
  users.push({username, password});
  return res.status(201).send(JSON.stringify({message: "User registered successfully"}, null, 4));
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const getAllBooks = async () => {
    return new Promise((resolve) => {
      resolve(books);
    });
  };
  const data = await getAllBooks();
  res.send(JSON.stringify(data, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    });
  };
  getBookByISBN(isbn)
    .then(data => res.send(JSON.stringify(data, null, 4)))
    .catch(err => res.status(404).send(JSON.stringify({message: err.message}, null, 4)));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const result = Object.keys(books).filter(isbn => books[isbn].author === author).map(isbn => ({isbn, ...books[isbn]}));
      if (result.length > 0) {
        resolve(result);
      } else {
        reject(new Error("No books found for this author"));
      }
    });
  };
  getBooksByAuthor(author)
    .then(data => res.send(JSON.stringify(data, null, 4)))
    .catch(err => res.status(404).send(JSON.stringify({message: err.message}, null, 4)));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      const result = Object.keys(books).filter(isbn => books[isbn].title === title).map(isbn => ({isbn, ...books[isbn]}));
      if (result.length > 0) {
        resolve(result);
      } else {
        reject(new Error("No books found with this title"));
      }
    });
  };
  getBooksByTitle(title)
    .then(data => res.send(JSON.stringify(data, null, 4)))
    .catch(err => res.status(404).send(JSON.stringify({message: err.message}, null, 4)));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).send(JSON.stringify({message: "Book not found"}, null, 4));
  }
});

module.exports.general = public_users;
