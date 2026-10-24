const myLibrary = [];

function Book(title, author, pages, read) {
this.id = crypto.randomUUID();
this.title = title;
this.author = author;
this.pages = pages;
this.read = read;
}

Book.prototype.toggleRead = function () {
this.read = !this.read;
};

function addBookToLibrary(title, author, pages, read) {
const book = new Book(title, author, pages, read);
myLibrary.push(book);
}

function displayBooks() {
const library = document.querySelector("#library");
const emptyState = document.querySelector("#empty-state");

library.innerHTML = "";

myLibrary.forEach(book => {
    const card = document.createElement("article");

    card.classList.add("book-card");
    card.dataset.id = book.id;

    const decoration = document.createElement("div");
    decoration.classList.add("book-decoration");

    const title = document.createElement("h3");
    title.classList.add("book-title");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.classList.add("book-author");
    author.textContent = `by ${book.author}`;

    const details = document.createElement("div");
    details.classList.add("book-details");

    const pagesLabel = document.createElement("span");
    pagesLabel.classList.add("pages-label");
    pagesLabel.textContent = "Length";

    const pagesValue = document.createElement("span");
    pagesValue.classList.add("pages-value");
    pagesValue.textContent = `${book.pages} pages`;

    details.append(pagesLabel, pagesValue);

    const status = document.createElement("span");
    status.classList.add("status-badge");
    status.classList.add(book.read ? "status-read" : "status-unread");
    status.textContent = book.read ? "Read" : "Not read yet";

    const actions = document.createElement("div");
    actions.classList.add("book-actions");

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.classList.add("toggle-btn");
    toggleButton.dataset.id = book.id;
    toggleButton.textContent = book.read ? "Mark unread" : "Mark as read";
    toggleButton.setAttribute(
        "aria-label",
        `${book.read ? "Mark unread" : "Mark as read"}: ${book.title}`
    );

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("remove-btn");
    removeButton.dataset.id = book.id;
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${book.title}`);

    actions.append(toggleButton, removeButton);

    card.append(decoration, title, author, details, status, actions);
    library.appendChild(card);
});

updateStats();

emptyState.hidden = myLibrary.length !== 0;
library.hidden = myLibrary.length === 0;


}

function updateStats() {
const totalBooks = myLibrary.length;
const booksRead = myLibrary.filter(book => book.read).length;
const booksUnread = totalBooks - booksRead;


document.querySelector("#total-books").textContent = totalBooks;
document.querySelector("#books-read").textContent = booksRead;
document.querySelector("#books-unread").textContent = booksUnread;

document.querySelector("#library-description").textContent =
    `${totalBooks} ${totalBooks === 1 ? "book" : "books"} in your collection`;


}

function removeBook(id) {
const index = myLibrary.findIndex(book => book.id === id);


if (index !== -1) {
    myLibrary.splice(index, 1);
    displayBooks();
}


}

function toggleBookRead(id) {
const book = myLibrary.find(book => book.id === id);


if (book) {
    book.toggleRead();
    displayBooks();
}


}

// Event delegation: handle clicks on book action buttons.
document.querySelector("#library").addEventListener("click", event => {
const button = event.target.closest("button");

if (!button) {
    return;
}

const id = button.dataset.id;

if (button.classList.contains("remove-btn")) {
    removeBook(id);
} else if (button.classList.contains("toggle-btn")) {
    toggleBookRead(id);
}

});


const dialog = document.querySelector("#book-dialog");
const bookForm = document.querySelector("#book-form");

function openBookDialog() {
bookForm.reset();
dialog.showModal();
document.querySelector("#title").focus();
}

document.querySelector("#new-book-btn").addEventListener("click", openBookDialog);

document.querySelector("#empty-add-btn").addEventListener("click", openBookDialog);

document.querySelector("#close-dialog-btn").addEventListener("click", () => {
dialog.close();
});

document.querySelector("#cancel-btn").addEventListener("click", () => {
dialog.close();
});

// Handle form submission.
bookForm.addEventListener("submit", event => {
event.preventDefault();

if (!bookForm.reportValidity()) {
    return;
}

const title = document.querySelector("#title").value.trim();
const author = document.querySelector("#author").value.trim();
const pages = Number(document.querySelector("#pages").value);
const read = document.querySelector("#read").checked;

if (!title || !author || !Number.isInteger(pages) || pages < 1) {
    return;
}

addBookToLibrary(title, author, pages, read);

displayBooks();

bookForm.reset();
dialog.close();

});

// Close the dialog when clicking outside its content.
dialog.addEventListener("click", event => {
if (event.target === dialog) {
dialog.close();
}
});

// Initial sample books.
addBookToLibrary("Atomic Habits", "James Clear", 320, true);
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310, false);
addBookToLibrary("The Psychology of Money", "Morgan Housel", 256, true);
addBookToLibrary("1984", "George Orwell", 328, false);
addBookToLibrary("Ikigai", "Héctor García & Francesc Miralles", 208, true);
addBookToLibrary("The Alchemist", "Paulo Coelho", 208, false);

// Render the initial library.
displayBooks();
