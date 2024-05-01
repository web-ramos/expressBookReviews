const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(401)
      .json({ message: "Username and password are required." });
  }

  if (authenticatedUser(username, password)) {

    let accessToken = jwt.sign(
      {
        username: username,
      },
      "fingerprint_customer",
      { expiresIn: '1h' }
    );


    req.session.authorization = {
      accessToken,
      username,
    };

    return res.status(200).send("User successfully logged in");

  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn
  const review = req.body.review
  const username = req.username.username

  const book = books[isbn];

  console.log(book, review, username);

  if (book && review && username) {
      book.reviews[username] = review;
      console.log(book)
      return res.status(200).json({ message: `Reviews for isbn: ${isbn} were changed` });
  } else {
    return res.status(404).json({ message: "Reviews not found by isbn" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.username.username;

  const book = books[isbn];

  console.log(book, username);

  if (book && username) {
    delete book.reviews[username];
    console.log(book);
    return res
      .status(200)
      .json({ message: `Reviews for isbn: ${isbn} were deleted` });
  } else {
    return res.status(404).json({ message: "Reviews not found by isbn" });
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
