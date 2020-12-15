import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8081;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

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

// Start defining your routes here

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
