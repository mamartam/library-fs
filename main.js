// authors
const addAuthorForm = document.querySelector(".form-author");
const listOfAuthors = document.querySelector(".list-authors");
const authorInput = document.querySelector("#author-name");

// books
const addBookForm = document.querySelector(".form-book");
const listOfBooks = document.querySelector(".list-books");
const bookTitle = document.querySelector("#book-title");
const bookAuthor = document.querySelector("#book-author");

// editing
const editBox = document.querySelector(".edit-box");
const editBookAuthor = document.querySelector("#edit-book-author");
const editBookTitle = document.querySelector("#edit-book-title");
const editBookForm = document.querySelector(".form-edit");

// search
const searchInput = document.querySelector("#search-input");

let currentEditingBookId = null;

async function loadAuthors() {
  const response = await fetch("/api/authors");
  const authors = await response.json();
  listOfAuthors.innerHTML = authors
    .map(
      (author) => `
    <li>
      🆔 ${author.id} — <b>${author.author_name}</b> 
      <button data-id="${author.id}" type="button" class="delete-author-btn">Delete</button>
    </li>
  `,
    )
    .join("");
  const optionsHtml = authors
    .map(
      (author) => `
    <option value="${author.id}">${author.author_name}</option>
  `,
    )
    .join("");

  if (bookAuthor) bookAuthor.innerHTML = optionsHtml;
  if (editBookAuthor) editBookAuthor.innerHTML = optionsHtml;
}
async function loadBooks() {
  const query = searchInput ? searchInput.value.trim() : "";
  const response = await fetch(
    `/api/books?search=${encodeURIComponent(query)}`,
  );
  const books = await response.json();

  listOfBooks.innerHTML = books
    .map(
      (book) => `
    <li value="${book.id}">
      📖 "<b>${book.book_title}</b>" — Author: <i>${book.author_name || "Unknown"}</i>
      <button data-id="${book.id}" type="button" class="delete-book-btn">Delete</button>
      <button data-id="${book.id}" type="button" class="edit-book-btn">Edit</button>
    </li>
  `,
    )
    .join("");
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    loadBooks();
  });
}

addAuthorForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = authorInput.value.trim();
  if (!name) return;

  await fetch("/api/authors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name }),
  });

  authorInput.value = "";
  loadAuthors();
});

listOfAuthors.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-author-btn")) {
    const id = Number(event.target.dataset.id);
    await fetch(`/api/authors/${id}`, { method: "DELETE" });
    loadAuthors();
    loadBooks();
  }
});

listOfBooks.addEventListener("click", async (event) => {
  const id = Number(event.target.dataset.id);

  if (event.target.classList.contains("delete-book-btn")) {
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    loadBooks();
  } else if (event.target.classList.contains("edit-book-btn")) {
    currentEditingBookId = id;
    editBox.classList.remove("card-box--hidden");
    const liElement = event.target.closest("li");
    const fullText = liElement.textContent;
    const currentTitle = fullText
      .split("—")[0]
      .replace("📖", "")
      .replace(/"/g, "")
      .trim();

    editBookTitle.value = currentTitle;
  }
});

editBookForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newTitle = editBookTitle.value.trim();
  const newAuthorId = Number(editBookAuthor.value);

  if (!newTitle || !currentEditingBookId || !newAuthorId) return;

  await fetch(`/api/books/${currentEditingBookId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ book_title: newTitle, author_id: newAuthorId }),
  });

  editBox.classList.add("card-box--hidden");
  currentEditingBookId = null;
  loadBooks();
});
addBookForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const book_title = bookTitle.value.trim();
  const authorId = Number(bookAuthor.value);
  if (!book_title) return;

  await fetch("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ book_title: book_title, authorId: authorId }),
  });

  bookTitle.value = "";
  loadBooks();
});

loadAuthors();
loadBooks();

const exportCsvBtn = document.querySelector("#export-csv-btn");

if (exportCsvBtn) {
  exportCsvBtn.addEventListener("click", async () => {
    const query = searchInput ? searchInput.value.trim() : "";
    const response = await fetch(
      `/api/books?search=${encodeURIComponent(query)}`,
    );
    const books = await response.json();

    if (books.length === 0) {
      alert("There is no data");
      return;
    }
    let csvContent = "\uFEFFID;Book title; Author\n";

    books.forEach((book) => {
      const author = book.author_name || "Unknown";
      const title = book.book_title.replace(/;/g, ",");

      csvContent += `${book.id};"${title}";"${author}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "library_books.csv");
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}
