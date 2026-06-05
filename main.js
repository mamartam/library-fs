const addAuthorForm = document.querySelector(".add-author");
const authorInput = document.querySelector("#author-name");
const listOfAuthors = document.querySelector(".list-of-authors");

async function loadAuthors() {
  const response = await fetch("/api/authors");
  const authors = await response.json();

  listOfAuthors.innerHTML = authors
    .map(
      (author) => `
    <li>${author.id} — ${author.author_name}</li>
  `,
    )
    .join("");
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

loadAuthors();
