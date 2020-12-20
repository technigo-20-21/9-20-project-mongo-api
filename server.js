import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Middlewares to enable cors, json body parsing and error handling
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(500).json({ error: "Service unavailable" });
  }
});

// Object model
const Book = new mongoose.model("Member", {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: String,
  isbn13: Number,
  languageCode: Number,
  numPages: Number,
  ratingsCount: Number,
  textReviewsCount: Number,
});

// Clearing and populating database
if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Book.deleteMany();

    booksData.forEach((item) => {
      const newBook = new Book(item);
      newBook.save();
    });
  };
  populateDatabase();
}

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Evelina's RESTful book reviews API");
});

app.get("/books", async (req, res) => {
  const books = await Book.find(req.query);
  console.log(books);
  res.json(books);
});

app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid book id" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
