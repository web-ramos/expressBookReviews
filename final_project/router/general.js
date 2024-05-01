const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let getBooks = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 3000);
  });
};

let getBookByIsbn = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      resolve(book);
    }, 3000);
  });
};

let getBookByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
    const booksByAuthor = Object.fromEntries(
      Object.entries(books).filter(([_, book]) => book.author == author)
    );
      resolve(booksByAuthor);
    }, 3000);
  });
};

let getBookByTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByTitle = Object.fromEntries(
        Object.entries(books).filter(([_, book]) => book.title == title)
      );
      resolve(booksByTitle);
    }, 3000);
  });
};


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log(req.body, username, password);

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  //Write your code here
  try {
    let loadedBooks = await getBooks();
    res.status(200).json(loadedBooks);
  } catch (error) {
    res.status(500).json({ error: "Failed to load books" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  try {
    let loadedBook = await getBookByIsbn(isbn);
    res.status(200).json(loadedBook);
  } catch (error) {
    res.status(500).json({ error: "Failed to load book" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  //Write your code here
  const author = req.params.author;
  if (author) {
    try {
      let loadedBook = await getBookByAuthor(isbn);
      res.status(200).json(loadedBook);
    } catch (error) {
      res.status(500).json({ error: "Failed to load book" });
    }
  } else {
    return res.status(400).json({ message: "author is incorrect" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  //Write your code here
  const title = req.params.title;
  if (title) {
    try {
      let loadedBook = await getBookByTitle(title);
      res.status(200).json(loadedBook);
    } catch (error) {
      res.status(500).json({ error: "Failed to load book" });
    }
  } else {
    return res.status(400).json({ message: "title is incorrect" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book["reviews"]);
  } else {
    return res.status(404).json({ message: "Reviews not found by isbn" });
  }
});

module.exports.general = public_users;
