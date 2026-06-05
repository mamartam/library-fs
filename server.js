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

console.log("Connected to the dataBase!");

app.get("/api/authors", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM authors");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error - ", error: error.message });
  }
});

app.post("/api/authors", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "Name of author can't be empty " });
    }
    await db.query("INSERT INTO authors (author_name) VALUES (?)", [
      name.trim(),
    ]);

    res.status(201).json({ message: "Author is added." });
  } catch (error) {
    res.status(500).json({ message: "Error in adding", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
