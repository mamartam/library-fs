# User-friendly web application

## Features
* **Author Management (CRUD):** Adding authors and cascading/direct deletion.
* **Book Management (CRUD):** Creating books linked to an author via a dynamic list, editing the title/author in an interactive form, and deleting them.
* **Smart “Live” Search:** Instant filtering and searching for books on the backend by book title or author name (uses the SQL `LIKE` operator).
* **Data export to CSV:** Download the current (or search-filtered) list of books with a single click. The file is optimized using BOM (`\uFEFF`) and the `;` separator for correct display of Cyrillic characters in Microsoft Excel.
* **Responsive interface:** The layout is built using the **BEM** methodology and is fully responsive for mobile devices and desktops (CSS Grid & Flexbox).


## Tech Stack
* **Frontend:** HTML5, CSS3 (BEM, responsive design), Vanilla JavaScript (ES6+, Fetch API, Async/Await).
* **Backend:** Node.js, Express.js (REST API, static file serving).
* **Database:** MySQL (`mysql2/promise` package for asynchronous queries).

## Project Structure
```
├── index.html          # Page layout and UI structure
├── style.css           # Responsive styles for the application (BEM components)
├── main.js             # Client-side JavaScript (DOM, events, API requests)
├── server.js           # Node.js / Express server-side code and database configuration
└── README.md           # Project documentation
```
## REST API Endpoints

### authors
- GET /api/authors — Retrieve a list of all authors from the database.
- POST /api/authors — Add a new author (body: { name }).
- DELETE /api/authors/:id — Delete an author by their ID.

### books
- GET /api/books?search=... — Retrieve a list of books using a LEFT JOIN, optionally filtered by a search query.
- POST /api/books — Add a new book (body: { book_title, authorId }).
- PUT /api/books/:id — Update the title and author of a book by its ID (body: { book_title, author_id }).
- DELETE /api/books/:id — Delete a book by its ID.

## How to run a project locally
1. Setting up the database (MySQL)
Make sure your MySQL server is running. Create a database and two tables. You can use the following SQL commands:
```CREATE DATABASE library_fs;
USE library_fs;

CREATE TABLE authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_title VARCHAR(255) NOT NULL,
    author_id INT,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);
```

2. Cloning and setting up the server
3.Initialize a Node.js project and install the necessary dependencies:
`npm init -y
npm install express mysql2`
4. Open the server.js file and check the connection settings for your MySQL database:
`const db = await mysql.createConnection({
  host: "localhost",
  user: "root",       
  password: "password",
  database: "library_fs",
});`
5. Running the application
Start the server using Node.js:
`node server.js`
6. The following message will appear in the console:
`Connected to the database!
Server: http://localhost:3000`



