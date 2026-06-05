// server.js
import express from "express";
import mysql from "mysql2/promise";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("."));

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1111",
  database: "library_fs",
});

console.log("Connected to DataBase!");

// Getting data about author
app.get("/api/authors", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM authors");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error -", error: error.message });
  }
});
// Posting data about author
app.post("/api/authors", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "The name of author can't be empty" });
    }
    await db.query("INSERT INTO authors (author_name) VALUES (?)", [
      name.trim(),
    ]);
    res.status(201).json({ message: "Author was added to the database!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in adding author", error: error.message });
  }
});
// Adding new book to the database
app.post("/api/books", async (req, res) => {
  try {
    const { book_title, authorId } = req.body;
    if (!book_title || book_title.trim().length === 0 || !authorId) {
      return res
        .status(400)
        .json({ message: "Назва книги або автор не можуть бути порожніми" });
    }

    await db.query("INSERT INTO books (book_title, author_id) VALUES (?, ?)", [
      book_title.trim(),
      Number(authorId),
    ]);

    res.status(201).json({ message: "Книгу успішно додано в MySQL!" });
  } catch (error) {
    console.error("Ось тут зламався бекенд:", error);
    res
      .status(500)
      .json({ message: "Помилка при додаванні", error: error.message });
  }
});
// Getting filtered list of booksa
app.get("/api/books", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";

    let sql = `
      SELECT 
        books.id AS id, 
        books.book_title AS book_title, 
        books.author_id AS author_id, 
        authors.author_name AS author_name
      FROM books
      LEFT JOIN authors ON books.author_id = authors.id
    `;

    const params = [];

    if (searchQuery.trim() !== "") {
      sql += ` WHERE books.book_title LIKE ? OR authors.author_name LIKE ?`;
      params.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }

    const [books] = await db.query(sql, params);
    console.log("Books:", books);
    res.json(books);
  } catch (error) {
    console.error("Error in getting list og books:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

// Deleting book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const BookId = req.params.id;
    await db.query("DELETE FROM books WHERE id = ?", [BookId]);
    res.json({ message: "Book was deleted!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in deleting", error: error.message });
  }
});

// Editing book
app.put("/api/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const { book_title, author_id } = req.body;

    if (!book_title || book_title.trim().length === 0 || !author_id) {
      return res.status(400).json({ message: "Empty fields" });
    }

    await db.query(
      "UPDATE books SET book_title = ?, author_id = ? WHERE id = ?",
      [book_title.trim(), Number(author_id), bookId],
    );

    res.json({ message: "Book is updated" });
  } catch (error) {
    console.error("Error in editing book:", error);
    res.status(500).json({
      message: "error",
      error: error.message,
    });
  }
});

// deleting author and all his books
app.delete("/api/authors/:id", async (req, res) => {
  try {
    const authorId = req.params.id;
    await db.query("DELETE FROM authors WHERE id = ?", [authorId]);
    res.json({ message: "Author and his books was deleted" });
  } catch (error) {
    console.error("error in deleting author:", error);
    res.status(500).json({ message: "error", error: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
