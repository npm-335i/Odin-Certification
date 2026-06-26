const myLibrary = [];

class Book {
  constructor(title, author, pages, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  toggleRead() {
    this.read = !this.read;
  }
}

function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
  return book;
}

function removeBookById(id) {
  const index = myLibrary.findIndex((book) => book.id === id);

  if (index === -1) return false;

  myLibrary.splice(index, 1);
  return true;
}

function getBookById(id) {
  return myLibrary.find((book) => book.id === id);
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

function renderLibrary() {
  const container = document.getElementById("libraryContainer");

  if (!myLibrary.length) {
    container.innerHTML = `
      <div class="empty-state">
        No books available. Add your first book.
      </div>
    `;
    return;
  }

  container.innerHTML = myLibrary
    .map((book) => {
      const status = book.read ? "Read" : "Not Read";
      const statusClass = book.read ? "status-read" : "status-unread";

      return `
      <div class="book-card" data-id="${book.id}">

        <h3>${escapeHtml(book.title)}</h3>

        <div class="author">
          by ${escapeHtml(book.author)}
        </div>

        <div class="pages">
          ${book.pages} pages
        </div>

        <div class="status ${statusClass}">
          ${status}
        </div>


        <div class="card-actions">

          <button 
            class="btn-toggle"
            data-action="toggle"
            data-id="${book.id}">
            Toggle Read
          </button>


          <button
            class="btn-remove"
            data-action="remove"
            data-id="${book.id}">
            Remove
          </button>

        </div>

      </div>
    `;
    })
    .join("");
}

const libraryContainer = document.getElementById("libraryContainer");

libraryContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) return;

  const id = button.dataset.id;

  const book = getBookById(id);

  if (!book) return;

  if (button.dataset.action === "toggle") {
    book.toggleRead();
    renderLibrary();
  }

  if (button.dataset.action === "remove") {
    const confirmed = confirm("Remove this book from your library?");

    if (confirmed) {
      removeBookById(id);
      renderLibrary();
    }
  }
});

const dialog = document.getElementById("bookDialog");

const newBookBtn = document.getElementById("newBookBtn");

const cancelBtn = document.getElementById("cancelBtn");

const bookForm = document.getElementById("bookForm");

newBookBtn.addEventListener("click", () => {
  bookForm.reset();
  dialog.showModal();
});

cancelBtn.addEventListener("click", () => {
  dialog.close();
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

bookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();

  const author = document.getElementById("author").value.trim();

  const pages = Number(document.getElementById("pages").value);

  const read = document.getElementById("readStatus").checked;

  if (!title || !author || !Number.isInteger(pages) || pages <= 0) {
    alert("Please enter valid book details.");

    return;
  }

  addBookToLibrary(title, author, pages, read);

  renderLibrary();

  bookForm.reset();

  dialog.close();
});

function seedLibrary() {
  addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310, true);

  addBookToLibrary("Dune", "Frank Herbert", 688, false);

  addBookToLibrary("Neuromancer", "William Gibson", 271, true);

  addBookToLibrary("The Name of the Wind", "Patrick Rothfuss", 662, false);

  renderLibrary();
}

seedLibrary();
